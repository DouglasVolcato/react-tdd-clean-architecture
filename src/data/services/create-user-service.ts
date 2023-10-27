import { CreateUserUseCase } from "../../domain/protocols/index";
import { ApiError, DefaultError } from "../errors";
import { ClientPostRequestSenderInterface } from "../protocols";

export class CreateUserService implements CreateUserUseCase.Service {
  private readonly url: string;
  private readonly clientPostRequestSender: ClientPostRequestSenderInterface;

  public constructor(
    userCreationUrl: string,
    clientPostRequestSender: ClientPostRequestSenderInterface
  ) {
    this.url = userCreationUrl;
    this.clientPostRequestSender = clientPostRequestSender;
  }

  public async execute(
    input: CreateUserUseCase.Input
  ): Promise<CreateUserUseCase.Output | Error> {
    const data = await this.clientPostRequestSender.post(this.url, input);

    if (!data) {
      return new DefaultError();
    } else if (data.error) {
      return new ApiError(data.error);
    } else {
      return data;
    }
  }
}
