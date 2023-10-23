import { ValidatorInterface } from "../../../presentation/protocols";
import { ValidatorBuilder } from "../../../validation/builders";
import { ValidatorComposite } from "../../../validation/composites";

export function makeCreateUserValidationFactory(): ValidatorInterface {
  return new ValidatorComposite([
    new ValidatorBuilder().of("name").isRequired(),
    new ValidatorBuilder().of("password").isRequired(),
    new ValidatorBuilder().of("email").isRequired(),
    new ValidatorBuilder().of("email").isEmail(),
  ]);
}
