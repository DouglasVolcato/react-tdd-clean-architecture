import React from "react";
import { DeleteUserPage } from "../../../presentation/pages";
import { DeleteUserService } from "../../../data/services";
import {
  ClientRequestSenderAdapter,
  StorageAdapter,
} from "../../../infra/adapters";

export const makeDeleteUserPageFactory: React.FC = () => {
  const apiUrl = "http://localhost:3000";
  const tokenStorage = new StorageAdapter();
  const clientRequestSender = new ClientRequestSenderAdapter();
  const deleteUserService = new DeleteUserService(
    apiUrl + "/user/delete",
    clientRequestSender,
    tokenStorage
  );
  return <DeleteUserPage deleteUserService={deleteUserService} />;
};
