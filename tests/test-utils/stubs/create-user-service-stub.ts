import { CreateUserUseCase } from "../../../src/domain/protocols";
import { makeUserEntity } from "../entities/user-entity-mock";

export class CreateUserServiceStub implements CreateUserUseCase.Service {
  public execute(
    input: CreateUserUseCase.Input
  ): Promise<CreateUserUseCase.Output | Error> {
    return Promise.resolve(makeUserEntity());
  }
}
