import { TokenStorageInterface } from "../../../src/data/protocols";

export class TokenStorageStub implements TokenStorageInterface {
  public async store(key: string, value: any): Promise<void> {
    return await Promise.resolve();
  }
  public async get(key: string): Promise<any> {
    return await Promise.resolve("any_token");
  }
}
