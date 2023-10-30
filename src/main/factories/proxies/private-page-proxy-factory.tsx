import React from "react";
import { PrivatePageProxy } from "../../../presentation/proxies";
import { GetUserByTokenService } from "../../../data/services";
import {
  ClientRequestSenderAdapter,
  StorageAdapter,
} from "../../../infra/adapters";

export const makePrivatePageProxyFactory = (
  privatePage: React.FC,
  loginPageRoute: string
): React.FC<any> => {
  const apiUrl = "http://localhost:3000";
  const tokenStorage = new StorageAdapter();
  const clientRequestSender = new ClientRequestSenderAdapter();
  const getUserByTokenService = new GetUserByTokenService(
    apiUrl + "/user/get",
    clientRequestSender,
    tokenStorage
  );
  const page: React.FC<any> = () => (
    <PrivatePageProxy
      PrivatePage={privatePage}
      loginPageRoute={loginPageRoute}
      getUserByTokenService={getUserByTokenService}
    />
  );
  return page;
};
