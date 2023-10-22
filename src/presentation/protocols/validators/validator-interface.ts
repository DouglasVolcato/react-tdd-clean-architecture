export interface ValidatorInterface {
  validate(data: any): Error | undefined;
}
