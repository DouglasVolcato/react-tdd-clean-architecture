import { ClientPostRequestSenderInterface } from "../../../src/data/contracts";
import { CreateUserUseCase } from "../../../src/domain/protocols";
import { CreateUserService } from "../../../src/data/services";

export const makeUserDto = (): CreateUserUseCase.Input => ({
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

export const makeUserEntity = (): CreateUserUseCase.Output => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

class ClientPostRequestSenderStub implements ClientPostRequestSenderInterface {
  public post(url: string, data: any): Promise<any> {
    return Promise.resolve(makeUserEntity());
  }
}

type SutTypes = {
  sut: CreateUserService;
  clientPostRequestSender: ClientPostRequestSenderInterface;
};

const makeSut = (userCreationUrl = "any_url"): SutTypes => {
  const clientPostRequestSender = new ClientPostRequestSenderStub();
  const sut = new CreateUserService(userCreationUrl, clientPostRequestSender);

  return { sut, clientPostRequestSender };
};

describe("CreateUserService", () => {
  test("Should call ClientPostRequestSender with correct values", async () => {
    const { sut, clientPostRequestSender } = makeSut("valid_api_url");
    const requestSenderSpy = jest.spyOn(clientPostRequestSender, "post");
    await sut.execute(makeUserDto());

    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith(
      "valid_api_url",
      makeUserDto()
    );
  });

  test("Should return the ClientPostRequestSender output data", async () => {
    const { sut, clientPostRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientPostRequestSender, "post")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    const data = await sut.execute(makeUserDto());

    expect(data).toEqual(makeUserEntity());
  });

  test("Should return the ClientPostRequestSender output error", async () => {
    const { sut, clientPostRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientPostRequestSender, "post")
      .mockReturnValueOnce(Promise.resolve(new Error("test")));
    const data = await sut.execute(makeUserDto());

    expect(data).toEqual(new Error("test"));
  });

  test("Should throw if ClientPostRequestSender throws", async () => {
    const { sut, clientPostRequestSender } = makeSut("valid_api_url");
    jest.spyOn(clientPostRequestSender, "post").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(makeUserDto())).rejects.toThrow();
  });
});
