import { StorageAdapter } from "../../../src/infra/adapters";

type SutTypes = {
  sut: StorageAdapter;
  storage: Storage;
};

const makeSut = (): SutTypes => {
  const sut = new StorageAdapter();
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest.fn();
  return { sut, storage: localStorage };
};

describe("StorageAdapter", () => {
  describe("Store", () => {
    test("Should call store with correct values", async () => {
      const { sut, storage } = makeSut();
      const storageSpy = jest.spyOn(storage, "setItem");
      const key = "any_key";
      const value = { value: "any_value" };
      sut.store(key, value);

      expect(storageSpy).toHaveBeenCalledTimes(1);
      expect(storageSpy).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    test("Should throw if store throws", async () => {
      const { sut, storage } = makeSut();
      jest.spyOn(storage, "setItem").mockImplementationOnce(() => {
        throw new Error();
      });

      expect(
        async () => await sut.store("any_key", { value: "any_value" })
      ).rejects.toThrow();
    });
  });

  describe("Get", () => {
    test("Should call getItem with correct values", async () => {
      const { sut, storage } = makeSut();
      const storageSpy = jest.spyOn(storage, "getItem");
      const key = "any_key";
      sut.get(key);

      expect(storageSpy).toHaveBeenCalledTimes(1);
      expect(storageSpy).toHaveBeenCalledWith(key);
    });

    test("Should return an object if getItem returns a json object", async () => {
      const { sut, storage } = makeSut();
      const value = {value: 'any_value'};
      jest.spyOn(storage, "getItem").mockReturnValueOnce(JSON.stringify(value));

      const obj = await sut.get("any_key")
      expect(obj).toEqual(value);
    });

    test("Should return a string if getItem returns string", async () => {
      const { sut, storage } = makeSut();
      const value = 'any_value';
      jest.spyOn(storage, "getItem").mockReturnValueOnce(value);

      const str = await sut.get("any_key")
      expect(str).toEqual(value);
    });

    test("Should throw if getItem throws", async () => {
      const { sut, storage } = makeSut();
      jest.spyOn(storage, "getItem").mockImplementationOnce(() => {
        throw new Error();
      });

      expect(
        async () => await sut.get("any_key")
      ).rejects.toThrow();
    });
  });
});
