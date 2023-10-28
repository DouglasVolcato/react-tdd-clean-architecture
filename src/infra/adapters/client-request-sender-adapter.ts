import axios from "axios";
import {
  ClientDeleteRequestSenderInterface,
  ClientGetRequestSenderInterface,
  ClientPostRequestSenderInterface,
} from "../../data/protocols";

export class ClientRequestSenderAdapter
  implements
    ClientPostRequestSenderInterface,
    ClientGetRequestSenderInterface,
    ClientDeleteRequestSenderInterface
{
  public async post(url: string, data: any): Promise<any> {
    const response = await axios.post(url, data, {
      validateStatus: () => true,
    });
    return response.data;
  }

  public async get(url: string, authToken: string): Promise<any> {
    const response = await axios.get(url, {
      validateStatus: () => true,
      headers: {
        authorization: authToken,
      },
    });
    return response.data;
  }

  public async delete(url: string, authToken: string): Promise<any> {
    const response = await axios.delete(url, {
      validateStatus: () => true,
      headers: {
        authorization: authToken,
      },
    });
    return response.data;
  }
}
