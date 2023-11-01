import { HeaderComponent } from "../../../src/presentation/components";
import { GetUserByTokenUseCase } from "../../../src/domain/protocols";
import { render, waitFor } from "@testing-library/react";
import { DomTestHelpers, makeUserEntity } from "../../test-utils";
import { GlobalContext } from "../../../src/presentation/contexts";
import React from "react";

type SutMockTypes = {
  getLoggedUser?: () => GetUserByTokenUseCase.Output | null;
};

const makeSut = (mocks?: SutMockTypes): void => {
  const getLoggedUser = mocks?.getLoggedUser ?? (() => makeUserEntity());
  render(
    <GlobalContext.Provider
      value={{ onUserLogin: (loggedUser: any) => {}, getLoggedUser }}
    >
      <HeaderComponent />
    </GlobalContext.Provider>
  );
};

describe("HeaderComponent", () => {
  test("Should show the logged user name if GlobalContext has a user", async () => {
    const mockGetLoggedUser = jest.fn().mockReturnValueOnce(makeUserEntity());
    makeSut({ getLoggedUser: mockGetLoggedUser });

    await waitFor(() => {
      const loggedUserName = DomTestHelpers.getElementById("logged-user-name");
      expect(loggedUserName).toBeTruthy();
      expect(loggedUserName?.innerHTML).toBe(
        `Logged as ${makeUserEntity().name}`
      );
      expect(mockGetLoggedUser).toHaveBeenCalledTimes(1);
      expect(mockGetLoggedUser).toHaveBeenCalledWith();
    });
  });

  test("Should not show the logged user name if GlobalContext has not a user", async () => {
    const mockGetLoggedUser = jest.fn().mockReturnValueOnce(null);
    makeSut({ getLoggedUser: mockGetLoggedUser });

    await waitFor(() => {
      const loggedUserName = DomTestHelpers.getElementById("logged-user-name");
      expect(loggedUserName).toBeNull();
    });
  });
});
