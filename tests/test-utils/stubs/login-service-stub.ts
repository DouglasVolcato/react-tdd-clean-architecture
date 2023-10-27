import { CreateUserUseCase, LoginUseCase } from "../../../src/domain/protocols";
import { makeLoginDto } from "../dtos/login-token-dto-mock";

export class LoginServiceStub implements CreateUserUseCase.Service {
  public execute(
    input: LoginUseCase.Input
  ): Promise<LoginUseCase.Output | Error> {
    return Promise.resolve(makeLoginDto().user);
  }
}
