import React, { createContext, useContext, useState } from "react";
import { GetUserByTokenUseCase } from "../../domain/protocols";

type Props = {
  onUserLogin: (loggedUser: GetUserByTokenUseCase.Output) => void;
  getLoggedUser: () => GetUserByTokenUseCase.Output | null;
};

export const GlobalContext = createContext<Props>(null as any);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }: any) => {
  const [loggedUser, setLoggedUser] =
    useState<GetUserByTokenUseCase.Output | null>(null);

  const onUserLogin = (user: GetUserByTokenUseCase.Output) => {
    setLoggedUser(user);
  };

  const getLoggedUser = () => {
    return loggedUser;
  };

  return (
    <GlobalContext.Provider value={{ onUserLogin, getLoggedUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
