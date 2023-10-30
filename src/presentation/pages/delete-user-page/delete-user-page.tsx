import { DeleteUserUseCase } from "../../../domain/protocols";
import React from "react";
import "./styles.scss";
import {
  ButtonComponent,
  ButtonTypeEnum,
  HeaderComponent,
} from "../../components";

type Props = {
  deleteUserService: DeleteUserUseCase.Service;
};

export const DeleteUserPage: React.FC<Props> = ({
  deleteUserService,
}: Props) => {
  const deleteUser = async () => {
    try {
      await deleteUserService.execute();
    } catch (error) {}
  };

  return (
    <div className="delete-user-page">
      <HeaderComponent />
      <ButtonComponent
        disabled={false}
        name="Delete user"
        type={ButtonTypeEnum.BUTTON}
        onClickCallback={deleteUser}
      />
    </div>
  );
};
