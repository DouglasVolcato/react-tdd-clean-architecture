import { GetUserByTokenUseCase } from "../../domain/protocols/index";
import { ApiError, DefaultError } from "../errors";
import {
  ClientGetRequestSenderInterface,
  TokenStorageInterface,
} from "../protocols";

export class GetUserByTokenService implements GetUserByTokenUseCase.Service {
  private readonly url: string;
  private readonly clientGetRequestSender: ClientGetRequestSenderInterface;
  private readonly tokenStorage: TokenStorageInterface;

  public constructor(
    userSearchUrl: string,
    clientGetRequestSender: ClientGetRequestSenderInterface,
    tokenStorage: TokenStorageInterface
  ) {
    this.url = userSearchUrl;
    this.clientGetRequestSender = clientGetRequestSender;
    this.tokenStorage = tokenStorage;
  }

  public async execute(): Promise<GetUserByTokenUseCase.Output | Error> {
    const token = await this.tokenStorage.get("token");
    if (!token) {
      return new DefaultError();
    }
    const data = await this.clientGetRequestSender.get(this.url, token);
    if (!data) {
      return new DefaultError();
    } else if (data.error) {
      return new ApiError(data.error);
    } else {
      return data;
    }
  }
}
