export namespace DeleteUserByTokenUseCase {
  export interface Service {
    execute(): Promise<DeleteUserByTokenUseCase.Output | Error>;
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
