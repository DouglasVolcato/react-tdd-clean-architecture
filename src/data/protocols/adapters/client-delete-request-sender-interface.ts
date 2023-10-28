export interface ClientDeleteRequestSenderInterface {
  delete(url: string, authToken: string): Promise<any>;
}
