export namespace GetUserByTokenUseCase {
  export interface Service {
    execute(): Promise<GetUserByTokenUseCase.Output | Error>;
  }

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
}
