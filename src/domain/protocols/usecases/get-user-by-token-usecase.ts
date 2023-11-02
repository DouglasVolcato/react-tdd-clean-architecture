import { UserEntity } from "..";

export namespace GetUserByTokenUseCase {
  export interface Service {
    execute(): Promise<GetUserByTokenUseCase.Output | Error>;
  }

  export type Output = UserEntity;
}
