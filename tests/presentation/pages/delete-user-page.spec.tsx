import { DeleteUserPage } from "../../../src/presentation/pages";
import { render, waitFor } from "@testing-library/react";
import {
  DeleteUserUseCase,
  GetUserByTokenUseCase,
} from "../../../src/domain/protocols";
import { DeleteUserServiceStub, DomTestHelpers } from "../../test-utils";
import React from "react";

type SutMockTypes = {
  getUserByTokenService?: GetUserByTokenUseCase.Service;
  deleteUserService?: DeleteUserUseCase.Service;
};

const makeSut = (mocks?: SutMockTypes): void => {
  render(
    <DeleteUserPage
      deleteUserService={
        mocks?.deleteUserService ?? new DeleteUserServiceStub()
      }
    />
  );
};

describe("DeleteUserPage", () => {
  test("Should not call DeleteUserService on page render", async () => {
    const mockDeleteUserService = new DeleteUserServiceStub();
    const deleteUserServiceSpy = jest.spyOn(mockDeleteUserService, "execute");
    makeSut({ deleteUserService: mockDeleteUserService });

    await waitFor(() => {
      expect(deleteUserServiceSpy).toHaveBeenCalledTimes(0);
    });
  });

  test("Should call DeleteUserService on button click", async () => {
    const mockDeleteUserService = new DeleteUserServiceStub();
    const deleteUserServiceSpy = jest.spyOn(mockDeleteUserService, "execute");
    makeSut({ deleteUserService: mockDeleteUserService });

    await DomTestHelpers.clickButton("deleteuser-button");

    await waitFor(() => {
      expect(deleteUserServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  test("Should not break the app if DeleteUserService throws", async () => {
    const mockDeleteUserService = new DeleteUserServiceStub();
    const deleteUserServiceSpy = jest
      .spyOn(mockDeleteUserService, "execute")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    makeSut({ deleteUserService: mockDeleteUserService });

    await DomTestHelpers.clickButton("deleteuser-button");

    await waitFor(() => {
      expect(deleteUserServiceSpy).toHaveBeenCalled();
    });
  });
});
