import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DeleteUserPage } from "../../../src/presentation/pages";
import { render, waitFor } from "@testing-library/react";
import {
  DeleteUserUseCase,
  GetUserByTokenUseCase,
} from "../../../src/domain/protocols";
import {
  DeleteUserServiceStub,
  DomTestHelpers,
  makeUserEntity,
} from "../../test-utils";
import React from "react";
import { GlobalContext } from "../../../src/presentation/contexts";

type SutMockTypes = {
  getUserByTokenService?: GetUserByTokenUseCase.Service;
  deleteUserService?: DeleteUserUseCase.Service;
  getLoggedUser?: () => GetUserByTokenUseCase.Output | null;
};

const makeSut = (mocks?: SutMockTypes): void => {
  const onUserLogin = (loggedUser: any) => {};
  const getLoggedUser = mocks?.getLoggedUser ?? (() => makeUserEntity());

  render(
    <BrowserRouter>
      <GlobalContext.Provider value={{ onUserLogin, getLoggedUser }}>
        <Routes>
          <Route
            path="/"
            element={
              <DeleteUserPage
                deleteUserService={
                  mocks?.deleteUserService ?? new DeleteUserServiceStub()
                }
              />
            }
          />
        </Routes>
      </GlobalContext.Provider>
    </BrowserRouter>
  );
};

describe("DeleteUserPage", () => {
  test("Should initiate with empty values", async () => {
    makeSut();
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");

    expect(screenErrorMessage).toBeNull();
    expect(loadingSpinner).toBeNull();
  });

  test("Should not call DeleteUserService on page render", async () => {
    const mockDeleteUserService = new DeleteUserServiceStub();
    const deleteUserServiceSpy = jest.spyOn(mockDeleteUserService, "execute");
    makeSut({ deleteUserService: mockDeleteUserService });

    await waitFor(() => {
      expect(deleteUserServiceSpy).toHaveBeenCalledTimes(0);
    });
  });

  test("Should call DeleteUserService on button click", async () => {
    const userData = { ...makeUserEntity(), id: "logged_user_id" };
    const mockDeleteUserService = new DeleteUserServiceStub();
    const deleteUserServiceSpy = jest.spyOn(mockDeleteUserService, "execute");
    makeSut({
      deleteUserService: mockDeleteUserService,
      getLoggedUser: () => userData,
    });

    await DomTestHelpers.clickButton("deleteuser-button");

    await waitFor(() => {
      expect(deleteUserServiceSpy).toHaveBeenCalledTimes(1);
      expect(deleteUserServiceSpy).toHaveBeenCalledWith({
        userId: userData.id,
      });
    });
  });

  test("Should show a default message if DeleteUserService throws", async () => {
    const mockDeleteUserService = new DeleteUserServiceStub();
    jest.spyOn(mockDeleteUserService, "execute").mockImplementationOnce(() => {
      throw new Error();
    });
    makeSut({ deleteUserService: mockDeleteUserService });

    await DomTestHelpers.clickButton("deleteuser-button");

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe("An error occurred");
    });
  });

  test("Should show the error message if DeleteUserService returns an error", async () => {
    const mockDeleteUserService = new DeleteUserServiceStub();
    jest
      .spyOn(mockDeleteUserService, "execute")
      .mockReturnValueOnce(Promise.resolve(new Error("any_error_message")));
    makeSut({ deleteUserService: mockDeleteUserService });

    await DomTestHelpers.clickButton("deleteuser-button");

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe("any_error_message");
    });
  });

  test("Should show loading spinner on button click", async () => {
    const mockDeleteUserService = new DeleteUserServiceStub();
    jest
      .spyOn(mockDeleteUserService, "execute")
      .mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return Promise.resolve(makeUserEntity());
      });
    makeSut({ deleteUserService: mockDeleteUserService });

    await DomTestHelpers.clickButton("deleteuser-button");

    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  test("Should remove the loading spinner after CreateUserService return", async () => {
    const mockDeleteUserService = new DeleteUserServiceStub();
    jest
      .spyOn(mockDeleteUserService, "execute")
      .mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return Promise.resolve(makeUserEntity());
      });
    makeSut({ deleteUserService: mockDeleteUserService });

    await DomTestHelpers.clickButton("deleteuser-button");

    await waitFor(() => {
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      expect(loadingSpinner).toBeFalsy();
    });
  });
});
