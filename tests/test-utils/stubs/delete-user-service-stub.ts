import { DeleteUserUseCase } from "../../../src/domain/protocols";
import { makeUserEntity } from "../entities/user-entity-mock";

export class DeleteUserServiceStub implements DeleteUserUseCase.Service {
  public execute(): Promise<DeleteUserUseCase.Output | Error> {
    return Promise.resolve(makeUserEntity());
  }
}
