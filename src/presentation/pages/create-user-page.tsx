import React from "react";
import { ValidatorInterface } from "../protocols";

type Props = {
  validator: ValidatorInterface;
};

export const CreateUserPage: React.FC<Props> = ({ validator }: Props) => {
  return (
    <>
      <h1>Create User Page</h1>
    </>
  );
};
