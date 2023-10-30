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

  useEffect(() => {
    if (!loggedUser) {
      try {
        getUserByTokenService.execute().then((foundUser) => {
          if (!(foundUser instanceof Error)) {
            if (globalContext) {
              globalContext.onUserLogin(foundUser);
              setLoggedUser(foundUser);
              return;
            }
          } else {
            navigate(loginPageRoute);
          }
        });
      } catch (error) {
        navigate(loginPageRoute);
      }
    }
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
