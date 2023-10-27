import { ValidatorInterface } from "../../../presentation/protocols";
import { ValidatorBuilder } from "../../../validation/builders";
import { ValidatorComposite } from "../../../validation/composites";

export function makeLoginValidationFactory(): ValidatorInterface {
  return new ValidatorComposite([
    new ValidatorBuilder().of("email").isRequired(),
    new ValidatorBuilder().of("email").isEmail(),
    new ValidatorBuilder().of("password").isRequired(),
  ]);
}
