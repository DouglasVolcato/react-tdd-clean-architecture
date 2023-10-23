import React from "react";
import { ValidatorInterface } from "../protocols";
import { CreateUserUseCase } from "../../domain/protocols";

type Props = {
  validator: ValidatorInterface;
  createUserService: CreateUserUseCase.Service;
};

export const CreateUserPage: React.FC<Props> = ({
  validator,
  createUserService,
}: Props) => {
  return (
    <>
      <form></form>
    </>
  );
};
