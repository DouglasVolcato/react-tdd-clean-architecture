export namespace LoginUseCase {
  export interface Service {
    execute(input: LoginUseCase.Input): Promise<LoginUseCase.Output | Error>;
  }

  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
}
