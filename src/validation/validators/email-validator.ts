import { EmailValidatorAdapter } from "../../infra/adapters";
import { ValidatorInterface } from "../../presentation/protocols";
import { RequiredFieldError, InvalidFieldError } from "../errors";
import { EmailValidationInterface } from "../protocols";

export class EmailValidator implements ValidatorInterface {
  private readonly emailValidation: EmailValidationInterface;
  private readonly fieldName: string;

  public constructor(fieldName: string) {
    this.emailValidation = new EmailValidatorAdapter();
    this.fieldName = fieldName;
  }

  public validate(data: any): Error | undefined {
    if (!data[this.fieldName]) {
      return new RequiredFieldError(this.fieldName);
    }
    if (!this.emailValidation.isEmail(data[this.fieldName])) {
      return new InvalidFieldError(this.fieldName);
    }
  }
}
