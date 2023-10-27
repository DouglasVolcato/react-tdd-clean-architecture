import { StorageAdapter } from "../../../src/infra/adapters";

type SutTypes = {
  sut: StorageAdapter;
  storage: Storage;
};

const makeSut = (): SutTypes => {
  const sut = new StorageAdapter();
  jest.spyOn(Storage.prototype, "setItem");
  Storage.prototype.setItem = jest.fn();
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

    test("Should throw is store throws", async () => {
      const { sut, storage } = makeSut();
      jest.spyOn(storage, "setItem").mockImplementationOnce(() => {
        throw new Error();
      });

      expect(
        async () => await sut.store("any_key", { value: "any_value" })
      ).rejects.toThrow();
    });
  });
});
