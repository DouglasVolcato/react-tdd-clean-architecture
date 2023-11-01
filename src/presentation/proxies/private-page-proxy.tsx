import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../components";
import { useNavigate } from "react-router-dom";
import { GetUserByTokenUseCase } from "../../domain/protocols";
import { useGlobalContext } from "../contexts";

type Props = {
  getUserByTokenService: GetUserByTokenUseCase.Service;
  PrivatePage: React.FC<any>;
  loginPageRoute: string;
};

export const PrivatePageProxy: React.FC<Props> = ({
  getUserByTokenService,
  PrivatePage,
  loginPageRoute,
}) => {
  const navigate = useNavigate();
  const globalContext = useGlobalContext();
  const [loggedUser, setLoggedUser] =
    useState<GetUserByTokenUseCase.Output | null>(null);

  const getUser = async (): Promise<void> => {
    if (loggedUser) return;
    try {
      const foundUser = await getUserByTokenService.execute();
      if (!(foundUser instanceof Error)) {
        if (globalContext) {
          globalContext.onUserLogin(foundUser);
          setLoggedUser(foundUser);
          return;
        }
      } else {
        navigate(loginPageRoute);
      }
    } catch (error) {
      navigate(loginPageRoute);
    }
  };

  useEffect(() => {
    getUser();
  }, [
    loggedUser,
    getUserByTokenService,
    globalContext,
    navigate,
    loginPageRoute,
  ]);

  return (
    <>{loggedUser ? <PrivatePage /> : <LoadingSpinner loading={true} />}</>
  );
};
