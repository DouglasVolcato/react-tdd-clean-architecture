import { CreateUserUseCase } from "../../domain/protocols/index";
import { ClientPostRequestSenderInterface } from "../contracts";

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
  ): Promise<CreateUserUseCase.Output> {
    const data = await this.clientPostRequestSender.post(this.url, input);
    return data;
  }
}
