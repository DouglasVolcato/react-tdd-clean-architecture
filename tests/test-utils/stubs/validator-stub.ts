import { ValidatorInterface } from "../../../src/presentation/protocols";

export class ValidatorStub implements ValidatorInterface {
  public validate(data: any): Error | undefined {
    return;
  }
}
