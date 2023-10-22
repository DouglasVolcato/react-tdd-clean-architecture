import { CreateUserUseCase } from "../../../src/domain/protocols";

export const makeUserEntity = (): CreateUserUseCase.Output => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});
