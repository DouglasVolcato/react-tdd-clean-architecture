import { validate } from "email-validator";
import { EmailValidatorInterface } from "../../validation/protocols";

export class EmailValidatorAdapter implements EmailValidatorInterface {
  public isEmail(value: string): boolean {
    return validate(value);
  }
}
