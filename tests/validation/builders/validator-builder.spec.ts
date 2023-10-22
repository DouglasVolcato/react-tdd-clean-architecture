import { ValidatorBuilder } from "../../../src/validation/builders";
import {
  EmailValidator,
  RequiredFieldValidator,
} from "../../../src/validation/validators";

type SutTypes = {
  sut: ValidatorBuilder;
};

const makeSut = (): SutTypes => {
  const sut = new ValidatorBuilder();
  return { sut };
};

describe("ValidatorBuilder", () => {
  test("Of method should set the field name and return the class instance", () => {
    const { sut } = makeSut();
    const data = sut.of("any_field");

    expect(data).toBeInstanceOf(ValidatorBuilder);
    expect((data as any).fieldName).toBe("any_field");
  });

  test("IsRequired method should return a RequiredFieldValidator", () => {
    const { sut } = makeSut();
    const validator = sut.of("any_field").isRequired();

    expect(validator).toBeInstanceOf(RequiredFieldValidator);
  });

  test("IsEmail method should return a EmailValidator", () => {
    const { sut } = makeSut();
    const validator = sut.of("any_field").isEmail();

    expect(validator).toBeInstanceOf(EmailValidator);
  });
});
