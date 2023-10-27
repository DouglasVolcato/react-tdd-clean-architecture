import { DefaultError, ApiError } from "../../../src/data/errors";
import { LoginService } from "../../../src/data/services";
import {
  ClientPostRequestSenderInterface,
  TokenStorageInterface,
} from "../../../src/data/protocols";
import {
  makeUserDto,
  ClientPostRequestSenderStub,
  makeLoginDto,
  TokenStorageStub,
} from "../../test-utils";

type SutTypes = {
  sut: LoginService;
  clientPostRequestSender: ClientPostRequestSenderInterface;
  tokenStorage: TokenStorageInterface;
};

const makeSut = (userCreationUrl = "any_url"): SutTypes => {
  const clientPostRequestSender = new ClientPostRequestSenderStub();
  const tokenStorage = new TokenStorageStub();
  const sut = new LoginService(
    userCreationUrl,
    clientPostRequestSender,
    tokenStorage
  );

  return { sut, clientPostRequestSender, tokenStorage };
};

describe("LoginService", () => {
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

  test("Should call the TokenStorage return the ClientPostRequestSender output data", async () => {
    const { sut, clientPostRequestSender, tokenStorage } =
      makeSut("valid_api_url");
    jest
      .spyOn(clientPostRequestSender, "post")
      .mockReturnValueOnce(Promise.resolve(makeLoginDto()));
    const tokenStorageSpy = jest.spyOn(tokenStorage, "store");
    const data = await sut.execute(makeUserDto());

    expect(data).toEqual(makeLoginDto().user);
    expect(tokenStorageSpy).toHaveBeenCalledTimes(1);
    expect(tokenStorageSpy).toHaveBeenCalledWith("token", makeLoginDto().token);
  });

  test("Should throw if ClientPostRequestSender throws", async () => {
    const { sut, clientPostRequestSender } = makeSut("valid_api_url");
    jest.spyOn(clientPostRequestSender, "post").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(makeUserDto())).rejects.toThrow();
  });

  test("Should return an error if ClientPostRequestSender returns undefined", async () => {
    const { sut, clientPostRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientPostRequestSender, "post")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const error = await sut.execute(makeUserDto());

    expect(error).toBeInstanceOf(DefaultError);
  });

  test("Should return an error if ClientPostRequestSender returns an object with error property", async () => {
    const { sut, clientPostRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientPostRequestSender, "post")
      .mockReturnValueOnce(Promise.resolve({ error: "any_error_message" }));
    const error = await sut.execute(makeUserDto());

    expect(error).toBeInstanceOf(ApiError);
  });
});
