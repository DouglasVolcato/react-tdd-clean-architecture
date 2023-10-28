import {
  DeleteUserUseCase,
  GetUserByTokenUseCase,
} from "../../../domain/protocols";
import {
  ButtonComponent,
  ButtonTypeEnum,
  HeaderComponent,
} from "../../components";
import React from "react";
import "./styles.scss";

type Props = {
  deleteUserService: DeleteUserUseCase.Service;
  getUserByTokenService: GetUserByTokenUseCase.Service;
};

export const DeleteUserPage: React.FC<Props> = ({
  deleteUserService,
  getUserByTokenService,
}: Props) => {
  const deleteUser = async () => {
    try {
      await deleteUserService.execute();
    } catch (error) {}
  };

  return (
    <div className="delete-user-page">
      <HeaderComponent getUserByTokenService={getUserByTokenService} />
      <ButtonComponent
        disabled={false}
        name="Delete user"
        type={ButtonTypeEnum.BUTTON}
        onClickCallback={deleteUser}
      />
    </div>
  );
};
