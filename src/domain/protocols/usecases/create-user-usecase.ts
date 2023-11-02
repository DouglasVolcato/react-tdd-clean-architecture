import { UserEntity } from "..";

export namespace CreateUserUseCase {
  export interface Service {
    execute(
      input: CreateUserUseCase.Input
    ): Promise<CreateUserUseCase.Output | Error>;
  }

  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserEntity;
}
