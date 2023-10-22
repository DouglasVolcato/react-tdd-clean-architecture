import axios from "axios";
import { ClientPostRequestSenderInterface } from "../../data/contracts";

export class ClientRequestSenderAdapter
  implements ClientPostRequestSenderInterface
{
  public async post(url: string, data: any): Promise<any> {
    const response = await axios.post(url, data, {
      validateStatus: () => true,
    });
    return response.data;
  }
}
