import { ClientDeleteRequestSenderInterface } from "../../../src/data/protocols";
import { makeUserEntity } from "../entities/user-entity-mock";

export class ClientDeleteRequestSenderStub
  implements ClientDeleteRequestSenderInterface
{
  public async delete(url: string, authToken: string): Promise<any> {
    return makeUserEntity();
  }
}
