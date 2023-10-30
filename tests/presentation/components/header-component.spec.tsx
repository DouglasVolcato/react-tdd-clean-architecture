import { HeaderComponent } from "../../../src/presentation/components";
import { GetUserByTokenUseCase } from "../../../src/domain/protocols";
import { render, waitFor } from "@testing-library/react";
import {
  DomTestHelpers,
  GetUserByTokenServiceStub,
  makeUserEntity,
} from "../../test-utils";
import React from "react";
import { GlobalContext } from "../../../src/presentation/contexts";

type SutMockTypes = {
  getUserByTokenService?: GetUserByTokenUseCase.Service;
  onUserLogin?: (loggedUser: GetUserByTokenUseCase.Output) => void;
  getLoggedUser?: () => GetUserByTokenUseCase.Output | null;
};

const makeSut = (mocks?: SutMockTypes): void => {
  const onUserLogin = mocks?.onUserLogin ?? ((loggedUser: any) => {});
  const getLoggedUser = mocks?.getLoggedUser ?? (() => makeUserEntity());
  render(
    <GlobalContext.Provider value={{ onUserLogin, getLoggedUser }}>
      <HeaderComponent
        getUserByTokenService={
          mocks?.getUserByTokenService ?? new GetUserByTokenServiceStub()
        }
      />
    </GlobalContext.Provider>
  );
};

describe("HeaderComponent", () => {
  test("Should call GetUserByTokenService", async () => {
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    const getUserByTokenServiceSpy = jest.spyOn(
      mockGetUserByTokenService,
      "execute"
    );
    makeSut({ getUserByTokenService: mockGetUserByTokenService });

    await waitFor(() => {
      expect(getUserByTokenServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  test("Should show the logged user name if GetUserByTokenService returns a user", async () => {
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    jest
      .spyOn(mockGetUserByTokenService, "execute")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    makeSut({ getUserByTokenService: mockGetUserByTokenService });

    await waitFor(() => {
      const loggedUserName = DomTestHelpers.getElementById("logged-user-name");

      expect(loggedUserName).toBeTruthy();
      expect(loggedUserName?.innerHTML).toBe(makeUserEntity().name);
    });
  });

  test("Should not show the logged user name if GetUserByTokenService returns an error", async () => {
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    jest
      .spyOn(mockGetUserByTokenService, "execute")
      .mockReturnValueOnce(Promise.resolve(new Error()));
    makeSut({ getUserByTokenService: mockGetUserByTokenService });

    await waitFor(() => {
      const loggedUserName = DomTestHelpers.getElementById("logged-user-name");

      expect(loggedUserName).toBeNull();
    });
  });

  test("Should not show the logged user name if GetUserByTokenService throws", async () => {
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    jest
      .spyOn(mockGetUserByTokenService, "execute")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    makeSut({ getUserByTokenService: mockGetUserByTokenService });

    await waitFor(() => {
      const loggedUserName = DomTestHelpers.getElementById("logged-user-name");

      expect(loggedUserName).toBeNull();
    });
  });

  test("Should set GlobalContext user on user login", async () => {
    const mockOnUserLogin = jest.fn()
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    jest
      .spyOn(mockGetUserByTokenService, "execute")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    makeSut({ getUserByTokenService: mockGetUserByTokenService, onUserLogin: mockOnUserLogin });

    await waitFor(() => {
      expect(mockOnUserLogin).toHaveBeenCalledTimes(1);
      expect(mockOnUserLogin).toHaveBeenCalledWith(makeUserEntity());
    });
  });
});
