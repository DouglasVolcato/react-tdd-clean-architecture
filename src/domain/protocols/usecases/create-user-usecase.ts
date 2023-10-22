export namespace CreateUserUseCase {
  export interface Service {
    execute(input: CreateUserUseCase.Input): Promise<CreateUserUseCase.Output>;
  }

  export type Input = {
    name: string;
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
