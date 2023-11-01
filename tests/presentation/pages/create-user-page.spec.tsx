import { ValidatorInterface } from "../../../src/presentation/protocols";
import { CreateUserPage } from "../../../src/presentation/pages";
import { CreateUserUseCase } from "../../../src/domain/protocols";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import {
  makeUserEntity,
  makeUserDto,
  DomTestHelpers,
  ValidatorStub,
  CreateUserServiceStub,
} from "../../test-utils";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

type SutMockTypes = {
  validator?: ValidatorInterface;
  createUserService?: CreateUserUseCase.Service;
};

const makeSut = (mocks?: SutMockTypes): void => {
  render(
    <>
      {DomTestHelpers.addRouter([
        {
          route: "/",
          element: (
            <CreateUserPage
              validator={mocks?.validator ?? new ValidatorStub()}
              createUserService={
                mocks?.createUserService ?? new CreateUserServiceStub()
              }
            />
          ),
        },
      ])}
    </>
  );
};

describe("CreateUserPage", () => {
  test("Should initiate with empty values", async () => {
    makeSut();
    const formTitle = DomTestHelpers.getElementById(
      "form-title-createanaccount"
    );
    const nameInput = DomTestHelpers.getInputElementById("name-input");
    const emailInput = DomTestHelpers.getInputElementById("email-input");
    const passwordInput = DomTestHelpers.getInputElementById("password-input");
    const submitButton = DomTestHelpers.getButtonElementById("submit-button");
    const loginAnchor = DomTestHelpers.getElementById("makelogin-anchor");
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");

    expect(formTitle?.innerHTML).toBe("Create an account");
    expect(nameInput.value).toBe("");
    expect(passwordInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(loginAnchor?.innerHTML).toBe("Make Login");
    expect(submitButton.disabled).toBeTruthy();
    expect(screenErrorMessage).toBeNull();
    expect(loadingSpinner).toBeNull();
  });

  test("Should show the validator error message", async () => {
    const mockErrorMessage = "Any error message";
    const mockValidator = new ValidatorStub();
    jest
      .spyOn(mockValidator, "validate")
      .mockReturnValueOnce(new Error(mockErrorMessage));
    makeSut({ validator: mockValidator });

    await DomTestHelpers.changeInputValue("name-input", "any_name");

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe(mockErrorMessage);
    });
  });

  test("Should disable button if validator does not return an error", async () => {
    const mockValidator = new ValidatorStub();
    jest.spyOn(mockValidator, "validate").mockReturnValueOnce(undefined);
    makeSut({ validator: mockValidator });

    await DomTestHelpers.changeInputValue("name-input", "any_name");

    const submitButton = DomTestHelpers.getButtonElementById("submit-button");
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeNull();
      expect(submitButton.disabled).toBeFalsy();
    });
  });

  test("Should call validator with correct values", async () => {
    const userData = makeUserDto();
    const mockValidator = new ValidatorStub();
    const validatorSpy = jest.spyOn(mockValidator, "validate");
    makeSut({ validator: mockValidator });

    await DomTestHelpers.changeInputValue("name-input", userData.name);
    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);

    await waitFor(() => {
      expect(validatorSpy).toHaveBeenCalledTimes(3);
      expect(validatorSpy).toHaveBeenLastCalledWith(userData);
    });
  });

  test("Should call CreateUserService with correct values", async () => {
    const userData = makeUserDto();
    const createUserServiceMock = new CreateUserServiceStub();
    const createUserServiceSpy = jest.spyOn(createUserServiceMock, "execute");
    jest
      .spyOn(createUserServiceMock, "execute")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    makeSut({ createUserService: createUserServiceMock });

    await DomTestHelpers.changeInputValue("name-input", userData.name);
    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      expect(createUserServiceSpy).toHaveBeenCalledTimes(1);
      expect(createUserServiceSpy).toHaveBeenCalledWith(userData);
    });
  });

  test("Should show a default message if Validator throws", async () => {
    const userData = makeUserDto();
    const validatorMock = new ValidatorStub();
    jest.spyOn(validatorMock, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    makeSut({ validator: validatorMock });

    await DomTestHelpers.changeInputValue("name-input", userData.name);

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe("An error occurred");
    });
  });

  test("Should show a default message if CreateUserService throws", async () => {
    const userData = makeUserDto();
    const createUserServiceMock = new CreateUserServiceStub();
    jest.spyOn(createUserServiceMock, "execute").mockImplementationOnce(() => {
      throw new Error();
    });
    makeSut({ createUserService: createUserServiceMock });

    await DomTestHelpers.changeInputValue("name-input", userData.name);
    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe("An error occurred");
    });
  });

  test("Should show the error message if CreateUserService returns an error", async () => {
    const mockErrorMessage = "any_error_message";
    const userData = makeUserDto();
    const createUserServiceMock = new CreateUserServiceStub();
    jest
      .spyOn(createUserServiceMock, "execute")
      .mockReturnValueOnce(Promise.resolve(new Error(mockErrorMessage)));
    makeSut({ createUserService: createUserServiceMock });

    await DomTestHelpers.changeInputValue("name-input", userData.name);
    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe(mockErrorMessage);
    });
  });

  test("Should show loading spinner on button click", async () => {
    const userData = makeUserDto();
    const createUserServiceMock = new CreateUserServiceStub();
    jest.spyOn(createUserServiceMock, "execute");
    jest
      .spyOn(createUserServiceMock, "execute")
      .mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return Promise.resolve(makeUserEntity());
      });
    makeSut({ createUserService: createUserServiceMock });

    await DomTestHelpers.changeInputValue("name-input", userData.name);
    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  test("Should remove the loading spinner after CreateUserService return", async () => {
    const userData = makeUserDto();
    const createUserServiceMock = new CreateUserServiceStub();
    jest.spyOn(createUserServiceMock, "execute");
    jest
      .spyOn(createUserServiceMock, "execute")
      .mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return Promise.resolve(makeUserEntity());
      });
    makeSut({ createUserService: createUserServiceMock });

    await DomTestHelpers.changeInputValue("name-input", userData.name);
    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      expect(loadingSpinner).toBeFalsy();
    });
  });

  test("Should redirect to login page on anchor click", async () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockImplementation(
      () => navigateMock
    );
    makeSut();
    await DomTestHelpers.clickButton("makelogin-anchor");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  test("Should redirect to login page if user was created on success", async () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockImplementation(
      () => navigateMock
    );
    const userData = makeUserDto();
    const createUserServiceMock = new CreateUserServiceStub();
    jest.spyOn(createUserServiceMock, "execute");
    jest
      .spyOn(createUserServiceMock, "execute")
      .mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return Promise.resolve(makeUserEntity());
      });
    makeSut({ createUserService: createUserServiceMock });

    await DomTestHelpers.changeInputValue("name-input", userData.name);
    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });
});
