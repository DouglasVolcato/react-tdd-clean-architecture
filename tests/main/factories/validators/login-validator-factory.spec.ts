import { makeLoginValidationFactory } from "../../../../src/main/factories";
import { ValidatorInterface } from "../../../../src/presentation/protocols";
import {
  EmailValidator,
  RequiredFieldValidator,
} from "../../../../src/validation/validators";

type SutTypes = {
  sut: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const sut = makeLoginValidationFactory();
  return { sut };
};

describe("CreateUserValidatorFactory", () => {
  test("Should setup validators correctly", () => {
    const { sut } = makeSut();
    expect((sut as any).validators).toEqual([
      new RequiredFieldValidator("email"),
      new EmailValidator("email"),
      new RequiredFieldValidator("password"),
    ]);
  });
});
