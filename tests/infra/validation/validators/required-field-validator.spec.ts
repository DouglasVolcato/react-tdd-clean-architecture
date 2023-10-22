import { RequiredFieldValidator } from "../../../../src/validation/validators";
import { RequiredFieldError } from "../../../../src/validation/errors";

type SutTypes = {
  sut: RequiredFieldValidator;
};

const makeSut = (fieldName: string): SutTypes => {
  const sut = new RequiredFieldValidator(fieldName);
  return { sut };
};

const mockData = () => ({
  any_field: "any_field",
  valid_field: "any_value",
});

describe("RequiredFieldValidator", () => {
  test("Should return an error if field does not exist", () => {
    const { sut } = makeSut("wrong_field");
    const result = sut.validate(mockData());

    expect(result).toBeInstanceOf(RequiredFieldError);
  });

  test("Should return undefined if field exists", () => {
    const { sut } = makeSut("valid_field");
    const result = sut.validate(mockData());

    expect(result).toBeUndefined();
  });
});
