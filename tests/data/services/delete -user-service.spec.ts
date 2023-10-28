import { DefaultError, ApiError } from "../../../src/data/errors";
import { DeleteUserService } from "../../../src/data/services";
import {
  ClientDeleteRequestSenderInterface,
  TokenStorageInterface,
} from "../../../src/data/protocols";
import {
  makeLoginDto,
  ClientDeleteRequestSenderStub,
  TokenStorageStub,
  makeUserEntity,
} from "../../test-utils";

const authToken = makeLoginDto().token;

type SutTypes = {
  sut: DeleteUserService;
  clientDeleteRequestSender: ClientDeleteRequestSenderInterface;
  tokenStorage: TokenStorageInterface;
};

const makeSut = (userSearchUrl = "any_url"): SutTypes => {
  const clientDeleteRequestSender = new ClientDeleteRequestSenderStub();
  const tokenStorage = new TokenStorageStub();
  const sut = new DeleteUserService(
    userSearchUrl,
    clientDeleteRequestSender,
    tokenStorage
  );

  return { sut, clientDeleteRequestSender, tokenStorage };
};

describe("LoginService", () => {
  test("Should call TokenStorage with correct values", async () => {
    const { sut, tokenStorage } = makeSut("valid_api_url");
    const storageSpy = jest.spyOn(tokenStorage, "get");
    await sut.execute();

    expect(storageSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledWith("token");
  });

  test("Should throw if TokenStorage throws", async () => {
    const { sut, tokenStorage } = makeSut("valid_api_url");
    jest.spyOn(tokenStorage, "get").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute()).rejects.toThrow();
  });

  test("Should call ClientDeleteRequestSender with correct values", async () => {
    const { sut, clientDeleteRequestSender, tokenStorage } =
      makeSut("valid_api_url");
    const requestSenderSpy = jest.spyOn(clientDeleteRequestSender, "delete");
    jest
      .spyOn(tokenStorage, "get")
      .mockReturnValueOnce(Promise.resolve(authToken));
    await sut.execute();

    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith("valid_api_url", authToken);
  });

  test("Should return the ClientDeleteRequestSender output data", async () => {
    const { sut, clientDeleteRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientDeleteRequestSender, "delete")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    const data = await sut.execute();

    expect(data).toEqual(makeUserEntity());
  });

  test("Should throw if ClientDeleteRequestSender throws", async () => {
    const { sut, clientDeleteRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientDeleteRequestSender, "delete")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    expect(async () => await sut.execute()).rejects.toThrow();
  });

  test("Should return an error if ClientDeleteRequestSender returns undefined", async () => {
    const { sut, clientDeleteRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientDeleteRequestSender, "delete")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const error = await sut.execute();

    expect(error).toBeInstanceOf(DefaultError);
  });

  test("Should return an error if ClientDeleteRequestSender returns an object with error property", async () => {
    const { sut, clientDeleteRequestSender } = makeSut("valid_api_url");
    jest
      .spyOn(clientDeleteRequestSender, "delete")
      .mockReturnValueOnce(Promise.resolve({ error: "any_error_message" }));
    const error = await sut.execute();

    expect(error).toBeInstanceOf(ApiError);
  });
});
