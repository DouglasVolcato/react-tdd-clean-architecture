import React from "react";
import { HeaderComponent } from "../../../src/presentation/components";
import { GetUserByTokenUseCase } from "../../../src/domain/protocols";
import {
  DomTestHelpers,
  GetUserByTokenServiceStub,
  makeUserEntity,
} from "../../test-utils";
import { render, waitFor } from "@testing-library/react";

type SutMockTypes = {
  getUserByTokenService?: GetUserByTokenUseCase.Service;
};

const makeSut = (mocks?: SutMockTypes): void => {
  render(
    <div>
      <HeaderComponent
        getUserByTokenService={
          mocks?.getUserByTokenService ?? new GetUserByTokenServiceStub()
        }
      />
    </div>
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
});
