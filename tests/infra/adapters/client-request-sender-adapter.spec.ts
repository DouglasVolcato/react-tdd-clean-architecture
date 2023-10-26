import { ClientRequestSenderAdapter } from "../../../src/infra/adapters/client-request-sender-adapter";
import { ClientPostRequestSenderInterface } from "../../../src/data/protocols";
import axios from "axios";

const urlLink = "any_url";
const bodyData = {
  value: "any_value",
};
const apiResponse = {
  statusCode: 200,
  data: {
    value: "any_value",
  },
};

jest.mock("axios", () => ({
  post: jest
    .fn()
    .mockImplementationOnce(async () => Promise.resolve(apiResponse)),
}));

type SutTypes = {
  sut: ClientPostRequestSenderInterface;
};

const makeSut = (): SutTypes => {
  const sut = new ClientRequestSenderAdapter();
  return { sut };
};

describe("ClientRequestSenderAdapter", () => {
  test("Should call axios post with correct values", async () => {
    const { sut } = makeSut();
    await sut.post(urlLink, bodyData);
    const axiosPostCalls = jest.spyOn(axios, "post").mock.calls;

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axiosPostCalls[0][0]).toBe(urlLink);
    expect(axiosPostCalls[0][1]).toBe(bodyData);
    expect(axiosPostCalls[0][2]).toEqual({
      validateStatus: expect.any(Function),
    });
  });

  test("Should return the correct data from axios post", async () => {
    const { sut } = makeSut();
    jest.spyOn(axios, "post").mockReturnValueOnce(Promise.resolve(apiResponse));
    const data = await sut.post(urlLink, bodyData);

    expect(data).toEqual(apiResponse.data);
  });

  test("Should throw if axios post throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(axios, "post").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.post(urlLink, bodyData)).rejects.toThrow();
  });
});
