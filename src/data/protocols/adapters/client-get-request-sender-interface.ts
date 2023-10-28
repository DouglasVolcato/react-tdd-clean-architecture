export interface ClientGetRequestSenderInterface {
  get(url: string, authToken: string): Promise<any>;
}
