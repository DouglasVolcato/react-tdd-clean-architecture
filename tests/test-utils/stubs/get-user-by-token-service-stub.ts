import { GetUserByTokenUseCase } from "../../../src/domain/protocols";
import { makeUserEntity } from "../entities/user-entity-mock";

export class GetUserByTokenServiceStub
  implements GetUserByTokenUseCase.Service
{
  public execute(): Promise<GetUserByTokenUseCase.Output | Error> {
    return Promise.resolve(makeUserEntity());
  }
}
