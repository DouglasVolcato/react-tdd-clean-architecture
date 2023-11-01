import { PrivatePageProxy } from "../../../presentation/proxies";
import { GetUserByTokenService } from "../../../data/services";
import { Env } from "../../config";
import React from "react";
import {
  ClientRequestSenderAdapter,
  StorageAdapter,
} from "../../../infra/adapters";

export const makePrivatePageProxyFactory = (
  privatePage: React.FC,
  loginPageRoute: string
): React.FC<any> => {
  const apiUrl = Env.API_URL;
  const tokenStorage = new StorageAdapter();
  const clientRequestSender = new ClientRequestSenderAdapter();
  const getUserByTokenService = new GetUserByTokenService(
    apiUrl + "/user/get/token",
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
