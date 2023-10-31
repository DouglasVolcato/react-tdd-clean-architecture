import { DeleteUserPage } from "../../../presentation/pages";
import { DeleteUserService } from "../../../data/services";
import { Env } from "../../config";
import React from "react";
import {
  ClientRequestSenderAdapter,
  StorageAdapter,
} from "../../../infra/adapters";

export const makeDeleteUserPageFactory: React.FC = () => {
  const apiUrl = Env.API_URL;
  const tokenStorage = new StorageAdapter();
  const clientRequestSender = new ClientRequestSenderAdapter();
  const deleteUserService = new DeleteUserService(
    apiUrl + "/user/delete",
    clientRequestSender,
    tokenStorage
  );
  return <DeleteUserPage deleteUserService={deleteUserService} />;
};
