export interface ClientPostRequestSenderInterface {
  post(url: string, data: any): Promise<any>;
}
