export class DefaultError extends Error {
  public constructor() {
    super(`An error occured`);
    this.name = "DafaultError";
  }
}
