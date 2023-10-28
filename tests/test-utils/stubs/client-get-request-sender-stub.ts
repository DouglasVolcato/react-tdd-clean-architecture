import { ClientGetRequestSenderInterface } from "../../../src/data/protocols";
import { makeUserEntity } from "../entities/user-entity-mock";

export class ClientGetRequestSenderStub
  implements ClientGetRequestSenderInterface
{
  public async get(url: string, authToken: string): Promise<any> {
    return makeUserEntity();
  }
}
