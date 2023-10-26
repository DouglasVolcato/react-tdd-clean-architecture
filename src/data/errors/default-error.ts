export class DefaultError extends Error {
  public constructor() {
    super(`An error occurrred`);
    this.name = "DafaultError";
  }
}
