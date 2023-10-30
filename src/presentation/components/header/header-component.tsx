import { GetUserByTokenUseCase } from "../../../domain/protocols";
import { useGlobalContext } from "../../../main/contexts";
import React, { useEffect, useState } from "react";
import "./styles.scss";

type HeaderProps = {
  getUserByTokenService: GetUserByTokenUseCase.Service;
};

export const HeaderComponent: React.FC<HeaderProps> = ({
  getUserByTokenService,
}: HeaderProps) => {
  const globalContext = useGlobalContext();
  const [loggedUser, setLoggedUser] =
    useState<GetUserByTokenUseCase.Output | null>(null);

  useEffect(() => {
    if (!loggedUser) {
      try {
        getUserByTokenService.execute().then((foundUser) => {
          if (!(foundUser instanceof Error)) {
            if(globalContext){
              globalContext?.onUserLogin(foundUser)
              setLoggedUser(foundUser);
            }
          }
        });
      } catch (error) {}
    }
  }, []);

  return (
    <div className="header" data-testid="header">
      {loggedUser ? (
        <h2 data-testid="logged-user-name">{loggedUser.name}</h2>
      ) : (
        <h2>Not logged in</h2>
      )}
    </div>
  );
};
