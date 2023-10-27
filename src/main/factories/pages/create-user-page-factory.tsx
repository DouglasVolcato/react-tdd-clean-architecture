import React, { ReactNode } from "react";
import { CreateUserPage } from "../../../presentation/pages/create-user-page/create-user-page";
import { makeCreateUserValidationFactory } from "../validators/create-user-validator-factory";
import { CreateUserService } from "../../../data/services";
import { ClientRequestSenderAdapter } from "../../../infra/adapters";

export function makeCreateUserPageFactory(apiUrl: string): ReactNode {
  const validator = makeCreateUserValidationFactory();
  const clientPostRequestSender = new ClientRequestSenderAdapter();
  const createUserService = new CreateUserService(
    "/user/create",
    clientPostRequestSender
  );
  return (
    <CreateUserPage
      validator={validator}
      createUserService={createUserService}
    />
  );
}
