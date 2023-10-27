import { LoginUseCase } from "../../domain/protocols";
import { ApiError, DefaultError } from "../errors";
import {
  ClientPostRequestSenderInterface,
  TokenStorageInterface,
} from "../protocols";

export class LoginService implements LoginUseCase.Service {
  private readonly url: string;
  private readonly clientPostRequestSender: ClientPostRequestSenderInterface;
  private readonly tokenStorage: TokenStorageInterface;

  public constructor(
    userCreationUrl: string,
    clientPostRequestSender: ClientPostRequestSenderInterface,
    tokenStorage: TokenStorageInterface
  ) {
    this.url = userCreationUrl;
    this.clientPostRequestSender = clientPostRequestSender;
    this.tokenStorage = tokenStorage;
  }

  public async execute(
    input: LoginUseCase.Input
  ): Promise<LoginUseCase.Output | Error> {
    const data = await this.clientPostRequestSender.post(this.url, input);
    if (!data) {
      return new DefaultError();
    } else if (data.error) {
      return new ApiError(data.error);
    } else {
      await this.tokenStorage.store("token", data.token);
      return data.user;
    }
  }
}
