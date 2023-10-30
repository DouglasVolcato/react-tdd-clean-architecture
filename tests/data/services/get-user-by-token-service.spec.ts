import { DefaultError, ApiError } from "../../../src/data/errors";
import { GetUserByTokenService } from "../../../src/data/services";
import {
  ClientGetRequestSenderInterface,
  TokenStorageInterface,
} from "../../../src/data/protocols";
import {
  makeLoginDto,
  ClientGetRequestSenderStub,
  TokenStorageStub,
  makeUserEntity,
} from "../../test-utils";

const authToken = makeLoginDto().token;

type SutTypes = {
  sut: GetUserByTokenService;
  clientGetRequestSender: ClientGetRequestSenderInterface;
  tokenStorage: TokenStorageInterface;
};

const makeSut = (userSearchUrl = "any_url"): SutTypes => {
  const clientGetRequestSender = new ClientGetRequestSenderStub();
  const tokenStorage = new TokenStorageStub();
  const sut = new GetUserByTokenService(
    userSearchUrl,
    clientGetRequestSender,
    tokenStorage
  );

  return { sut, clientGetRequestSender, tokenStorage };
};

describe("LoginService", () => {
  test("Should call TokenStorage with correct values", async () => {
    const { sut, tokenStorage } = makeSut("valid_api_url");
    const storageSpy = jest.spyOn(tokenStorage, "get");
    await sut.execute();

    expect(storageSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledWith("token");
  });

  test("Should return an error if TokenStorage returns null", async () => {
    const { sut, tokenStorage } = makeSut("valid_api_url");
    jest.spyOn(tokenStorage, "get").mockReturnValueOnce(Promise.resolve(null));
    const error = await sut.execute();

    expect(error).toBeInstanceOf(DefaultError);
  });

  test("Should throw if TokenStorage throws", async () => {
    const { sut, tokenStorage } = makeSut("valid_api_url");
    jest.spyOn(tokenStorage, "get").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute()).rejects.toThrow();
  });

  test("Should call ClientGetRequestSender with correct values", async () => {
    const { sut, clientGetRequestSender, tokenStorage } =
      makeSut("valid_api_url");
    const requestSenderSpy = jest.spyOn(clientGetRequestSender, "get");
    jest
      .spyOn(tokenStorage, "get")
      .mockReturnValueOnce(Promise.resolve(authToken));
    await sut.execute();

    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith("valid_api_url", authToken);
  });

  test("Should return the ClientGetRequestSender output data", async () => {
    const { sut, clientGetRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    const data = await sut.execute();

    expect(data).toEqual(makeUserEntity());
  });

  test("Should throw if ClientGetRequestSender throws", async () => {
    const { sut, clientGetRequestSender } = makeSut("valid_api_url");
    jest.spyOn(clientGetRequestSender, "get").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute()).rejects.toThrow();
  });

  test("Should return an error if ClientGetRequestSender returns undefined", async () => {
    const { sut, clientGetRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const error = await sut.execute();

    expect(error).toBeInstanceOf(DefaultError);
  });

  test("Should return an error if ClientGetRequestSender returns an object with error property", async () => {
    const { sut, clientGetRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve({ error: "any_error_message" }));
    const error = await sut.execute();

    expect(error).toBeInstanceOf(ApiError);
  });
});
