import { GetUserByTokenUseCase } from "../../../src/domain/protocols";
import { PrivatePageProxy } from "../../../src/presentation/proxies";
import { render, waitFor } from "@testing-library/react";
import { GlobalContext } from "../../../src/presentation/contexts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  DomTestHelpers,
  GetUserByTokenServiceStub,
  makeUserEntity,
} from "../../test-utils";
import React from "react";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

type SutMockTypes = {
  getUserByTokenService?: GetUserByTokenUseCase.Service;
  loginPageRoute?: string;
  privatePage?: React.FC<any>;
  onUserLogin?: (loggedUser: GetUserByTokenUseCase.Output) => void;
  getLoggedUser?: () => GetUserByTokenUseCase.Output | null;
};

const makeSut = (mocks?: SutMockTypes): void => {
  const onUserLogin = mocks?.onUserLogin ?? ((loggedUser: any) => {});
  const getLoggedUser = mocks?.getLoggedUser ?? (() => makeUserEntity());

  const PrivatePageProxyComponent = () => (
    <PrivatePageProxy
      getUserByTokenService={
        mocks?.getUserByTokenService ?? new GetUserByTokenServiceStub()
      }
      PrivatePage={mocks?.privatePage ?? (() => <></>)}
      loginPageRoute={mocks?.loginPageRoute ?? "/login"}
    />
  );

  render(
    <BrowserRouter>
      <GlobalContext.Provider value={{ onUserLogin, getLoggedUser }}>
        <Routes>
          <Route path="/" element={<PrivatePageProxyComponent />} />
        </Routes>
      </GlobalContext.Provider>
    </BrowserRouter>
  );
};

describe("PrivatePageProxy", () => {
  test("Should show the load spinner", async () => {
    makeSut();
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");

    await waitFor(() => {
      expect(loadingSpinner).toBeTruthy();
    });
  });

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

  test("Should set GlobalContext user on user login", async () => {
    const mockOnUserLogin = jest.fn();
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    jest
      .spyOn(mockGetUserByTokenService, "execute")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    makeSut({
      getUserByTokenService: mockGetUserByTokenService,
      onUserLogin: mockOnUserLogin,
    });

    await waitFor(() => {
      expect(mockOnUserLogin).toHaveBeenCalledTimes(1);
      expect(mockOnUserLogin).toHaveBeenCalledWith(makeUserEntity());
    });
  });

  test("Should show privatePage if GetUserByTokenService returns a user", async () => {
    const mockPrivatePage: React.FC<any> = () => (
      <div data-testid="private-page"></div>
    );
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    jest
      .spyOn(mockGetUserByTokenService, "execute")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    makeSut({
      getUserByTokenService: mockGetUserByTokenService,
      privatePage: mockPrivatePage,
    });

    await waitFor(() => {
      const privatePage = DomTestHelpers.getElementById("private-page");

      expect(privatePage).toBeTruthy();
    });
  });

  test("Should navigate to login if GetUserByTokenService returns an error", async () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockImplementation(
      () => navigateMock
    );
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    jest
      .spyOn(mockGetUserByTokenService, "execute")
      .mockReturnValueOnce(Promise.resolve(new Error()));
    makeSut({ getUserByTokenService: mockGetUserByTokenService });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  test("Should navigate to login if GetUserByTokenService throws", async () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockImplementation(
      () => navigateMock
    );
    const mockGetUserByTokenService = new GetUserByTokenServiceStub();
    jest
      .spyOn(mockGetUserByTokenService, "execute")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    makeSut({ getUserByTokenService: mockGetUserByTokenService });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });
});
