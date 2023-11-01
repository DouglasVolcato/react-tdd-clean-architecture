import { DeleteUserUseCase } from "../../domain/protocols";
import { ApiError, DefaultError } from "../errors";
import {
  ClientDeleteRequestSenderInterface,
  TokenStorageInterface,
} from "../protocols";

export class DeleteUserService implements DeleteUserUseCase.Service {
  private readonly url: string;
  private readonly clientDeleteRequestSender: ClientDeleteRequestSenderInterface;
  private readonly tokenStorage: TokenStorageInterface;

  public constructor(
    userSearchUrl: string,
    clientDeleteRequestSender: ClientDeleteRequestSenderInterface,
    tokenStorage: TokenStorageInterface
  ) {
    this.url = userSearchUrl;
    this.clientDeleteRequestSender = clientDeleteRequestSender;
    this.tokenStorage = tokenStorage;
  }

  public async execute({
    userId,
  }: DeleteUserUseCase.Input): Promise<DeleteUserUseCase.Output | Error> {
    const token = await this.tokenStorage.get("token");
    const data = await this.clientDeleteRequestSender.delete(
      `${this.url}/${userId}`,
      token
    );
    if (!data) {
      return new DefaultError();
    } else if (data.error) {
      return new ApiError(data.error);
    } else {
      return data;
    }
  }
}
