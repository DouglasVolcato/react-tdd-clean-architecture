export namespace DeleteUserUseCase {
  export interface Service {
    execute(
      input: DeleteUserUseCase.Input
    ): Promise<DeleteUserUseCase.Output | Error>;
  }

  export type Input = {
    userId: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
}