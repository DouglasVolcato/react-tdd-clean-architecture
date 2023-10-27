export interface TokenStorageInterface {
  store(key: string, value: any): Promise<void>;
}
