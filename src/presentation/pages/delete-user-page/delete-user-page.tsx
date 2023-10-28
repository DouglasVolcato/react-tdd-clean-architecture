import React from "react";
import {
  DeleteUserUseCase,
  GetUserByTokenUseCase,
} from "../../../domain/protocols";
import "./styles.scss";
import { HeaderComponent } from "../../components";

type Props = {
  deleteUserService: DeleteUserUseCase.Service;
  getUserByTokenService: GetUserByTokenUseCase.Service;
};

export const DeleteUserPage: React.FC<Props> = ({
  deleteUserService,
  getUserByTokenService,
}: Props) => {
  return (
    <div className="delete-user-page">
      <HeaderComponent getUserByTokenService={getUserByTokenService} />
      <h1>Delete user page</h1>
    </div>
  );
};
