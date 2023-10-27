import { makeUserEntity } from "../entities/user-entity-mock";

export const makeLoginDto = () => ({
  token: "valid_token",
  user: makeUserEntity(),
});
