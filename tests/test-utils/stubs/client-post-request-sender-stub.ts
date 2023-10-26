import { ClientPostRequestSenderInterface } from "../../../src/data/protocols";
import { makeUserEntity } from "../entities/user-entity-mock";

export class ClientPostRequestSenderStub
  implements ClientPostRequestSenderInterface
{
  public post(url: string, data: any): Promise<any> {
    return Promise.resolve(makeUserEntity());
  }
}
