import { DeleteUserUseCase } from "../../../domain/protocols";
import { useGlobalContext } from "../../contexts";
import React, { useState } from "react";
import "./styles.scss";
import {
  ButtonComponent,
  ButtonTypeEnum,
  ErrorMessageComponent,
  HeaderComponent,
  LoadingSpinner,
} from "../../components";

type Props = {
  deleteUserService: DeleteUserUseCase.Service;
};

export const DeleteUserPage: React.FC<Props> = ({
  deleteUserService,
}: Props) => {
  const globalContext = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState({
    message: "",
    show: false,
  });

  const deleteUser = async () => {
    try {
      setLoading(true);
      const loggedUser = globalContext?.getLoggedUser();
      const error = await deleteUserService.execute({
        userId: loggedUser?.id || "",
      });
      if (error instanceof Error) {
        handlePageError(error.message);
      }
    } catch (error) {
      handlePageError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePageError = (message: string) => {
    setPageError((old) => ({
      ...old,
      show: true,
      message,
    }));
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
      {pageError.show && <ErrorMessageComponent message={pageError.message} />}
      <LoadingSpinner loading={loading} />
    </div>
  );
};
