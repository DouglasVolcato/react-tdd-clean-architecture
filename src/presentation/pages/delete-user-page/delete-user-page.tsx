import React from "react";
import { DeleteUserUseCase } from "../../../domain/protocols";
import "./styles.scss";

type Props = {
  deleteUserService: DeleteUserUseCase.Service;
};

export const DeleteUserPage: React.FC<Props> = ({
  deleteUserService,
}: Props) => {
  return <div className="delete-user-page">
    <h1>Delete user page</h1>
  </div>;
};
