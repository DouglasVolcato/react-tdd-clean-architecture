import { validate } from "email-validator";
import { EmailValidatorInterface } from "../../presentation/protocols";

export class EmailValidatorAdapter implements EmailValidatorInterface {
  public isEmail(value: string): boolean {
    return validate(value);
  }
}
