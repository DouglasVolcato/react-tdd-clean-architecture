import { LoginPage } from "../../../presentation/pages";
import { LoginService } from "../../../data/services";
import { makeLoginValidationFactory } from "..";
import { Env } from "../../config";
import React from "react";
import {
  ClientRequestSenderAdapter,
  StorageAdapter,
} from "../../../infra/adapters";

export const makeLoginPageFactory: React.FC = () => {
  const apiUrl = Env.API_URL;
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
