import { TokenStorageInterface } from "../../data/protocols";

export class StorageAdapter implements TokenStorageInterface {
  public async store(key: string, value: any): Promise<void> {
    await Promise.resolve(localStorage.setItem(key, JSON.stringify(value)));
  }

  public async get(key: string): Promise<any> {
    let value = await Promise.resolve(localStorage.getItem(key));
    try {
      value = JSON.parse(value || "");
    } catch (error) {}
    return value;
  }
}
