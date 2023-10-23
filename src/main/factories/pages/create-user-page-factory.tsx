import React, { ReactNode } from "react";
import { CreateUserPage } from "../../../presentation/pages/create-user-page";
import { makeCreateUserValidationFactory } from "../validators/create-user-validator-factory";

export function makeCreateUserPageFactory(): ReactNode {
  const validator = makeCreateUserValidationFactory();
  return <CreateUserPage validator={validator} />;
}
