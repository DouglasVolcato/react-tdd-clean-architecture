import { ClientRequestSenderAdapter } from "../../../infra/adapters";
import { CreateUserPage } from "../../../presentation/pages";
import { CreateUserService } from "../../../data/services";
import { makeCreateUserValidationFactory } from "..";
import { Env } from "../../config";
import React from "react";

export const makeCreateUserPageFactory: React.FC = () => {
  const apiUrl = Env.API_URL;
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
