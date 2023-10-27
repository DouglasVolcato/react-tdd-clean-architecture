export interface TokenStorageInterface {
  store(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
}
