import { ValidatorInterface } from "../../presentation/protocols";
import { EmailValidator, RequiredFieldValidator } from "../validators";

export class ValidatorBuilder {
  private fieldName: string;

  public constructor() {
    this.fieldName = "";
  }

  public of(fieldName: string): typeof this {
    this.fieldName = fieldName;
    return this;
  }

  public isRequired(): ValidatorInterface {
    return new RequiredFieldValidator(this.fieldName);
  }

  public isEmail(): ValidatorInterface {
    return new EmailValidator(this.fieldName);
  }
}
