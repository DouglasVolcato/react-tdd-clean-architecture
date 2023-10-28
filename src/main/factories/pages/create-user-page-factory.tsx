import React from "react";
import { CreateUserPage } from "../../../presentation/pages";
import { makeCreateUserValidationFactory } from "..";
import { CreateUserService } from "../../../data/services";
import { ClientRequestSenderAdapter } from "../../../infra/adapters";

export const makeCreateUserPageFactory: React.FC = () => {
  const apiUrl = "http://localhost:3000";
  const validator = makeCreateUserValidationFactory();
  const clientPostRequestSender = new ClientRequestSenderAdapter();
  const createUserService = new CreateUserService(
    apiUrl + "/user/create",
    clientPostRequestSender
  );
  return (
    <CreateUserPage
      validator={validator}
      createUserService={createUserService}
    />
  );
};
