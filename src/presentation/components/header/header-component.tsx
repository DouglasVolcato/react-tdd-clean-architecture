import { GetUserByTokenUseCase } from "../../../domain/protocols";
import { useGlobalContext } from "../../contexts";
import React, { useEffect, useState } from "react";
import "./styles.scss";

export const HeaderComponent: React.FC = () => {
  const globalContext = useGlobalContext();
  const [loggedUser, setLoggedUser] =
    useState<GetUserByTokenUseCase.Output | null>(null);

  useEffect(() => {
    if (!loggedUser && globalContext) {
      setLoggedUser(globalContext.getLoggedUser());
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
