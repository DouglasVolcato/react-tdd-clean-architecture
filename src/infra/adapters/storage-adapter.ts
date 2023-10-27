import { TokenStorageInterface } from "../../data/protocols";

export class StorageAdapter implements TokenStorageInterface {
  public async store(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
