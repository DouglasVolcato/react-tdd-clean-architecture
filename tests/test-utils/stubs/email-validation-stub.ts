import { EmailValidationInterface } from "../../../src/validation/protocols";

export class EmailValidationStub implements EmailValidationInterface {
  public isEmail(value: string): boolean {
    return true;
  }
}
