import React from "react";
import { LoginService } from "../../../data/services";
import { LoginPage } from "../../../presentation/pages";
import { makeLoginValidationFactory } from "..";
import {
  ClientRequestSenderAdapter,
  StorageAdapter,
} from "../../../infra/adapters";

export const makeLoginPageFactory: React.FC = () => {
  const apiUrl = "http://localhost:3000";
  const validator = makeLoginValidationFactory();
  const clientPostRequestSender = new ClientRequestSenderAdapter();
  const tokenStorage = new StorageAdapter();
  const loginService = new LoginService(
    apiUrl + "/login",
    clientPostRequestSender,
    tokenStorage
  );
  return <LoginPage validator={validator} loginService={loginService} />;
};
