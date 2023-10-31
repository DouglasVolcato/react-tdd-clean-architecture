import { ValidatorInterface } from "../../../src/presentation/protocols";
import { LoginPage } from "../../../src/presentation/pages";
import { LoginUseCase } from "../../../src/domain/protocols";
import { render, waitFor } from "@testing-library/react";
import {
  makeUserEntity,
  makeUserDto,
  DomTestHelpers,
  ValidatorStub,
  LoginServiceStub,
} from "../../test-utils";
import React from "react";

type SutMockTypes = {
  validator?: ValidatorInterface;
  loginService?: LoginUseCase.Service;
};

const makeSut = (mocks?: SutMockTypes): void => {
  render(
    <LoginPage
      validator={mocks?.validator ?? new ValidatorStub()}
      loginService={mocks?.loginService ?? new LoginServiceStub()}
    />
  );
};

describe("LoginPage", () => {
  test("Should initiate with empty values", async () => {
    makeSut();
    const formTitle = DomTestHelpers.getElementById("form-title-login");
    const emailInput = DomTestHelpers.getInputElementById("email-input");
    const passwordInput = DomTestHelpers.getInputElementById("password-input");
    const submitButton = DomTestHelpers.getButtonElementById("submit-button");
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");

    expect(formTitle?.innerHTML).toBe("Login");
    expect(passwordInput.value).toBe("");
    expect(emailInput.value).toBe("");
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

    await DomTestHelpers.changeInputValue("email-input", "any_email");

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

    await DomTestHelpers.changeInputValue("email-input", "any_email");

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

    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);

    await waitFor(() => {
      expect(validatorSpy).toHaveBeenCalledTimes(2);
      expect(validatorSpy).toHaveBeenLastCalledWith({
        email: userData.email,
        password: userData.password,
      });
    });
  });

  test("Should call LoginService with correct values", async () => {
    const userData = makeUserDto();
    const loginServiceMock = new LoginServiceStub();
    const loginServiceSpy = jest.spyOn(loginServiceMock, "execute");
    jest
      .spyOn(loginServiceMock, "execute")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      expect(loginServiceSpy).toHaveBeenCalledTimes(1);
      expect(loginServiceSpy).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
      });
    });
  });

  test("Should show a default message if Validator throws", async () => {
    const userData = makeUserDto();
    const validatorMock = new ValidatorStub();
    jest.spyOn(validatorMock, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    makeSut({ validator: validatorMock });

    await DomTestHelpers.changeInputValue("email-input", userData.email);

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe("An error occurred");
    });
  });

  test("Should show a default message if LoginService throws", async () => {
    const userData = makeUserDto();
    const loginServiceMock = new LoginServiceStub();
    jest.spyOn(loginServiceMock, "execute").mockImplementationOnce(() => {
      throw new Error();
    });
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe("An error occurred");
    });
  });

  test("Should the error message if LoginService returns an error", async () => {
    const mockErrorMessage = "Any error message";
    const userData = makeUserDto();
    const loginServiceMock = new LoginServiceStub();
    jest
      .spyOn(loginServiceMock, "execute")
      .mockReturnValueOnce(Promise.resolve(new Error(mockErrorMessage)));
    makeSut({ loginService: loginServiceMock });

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
    const loginServiceMock = new LoginServiceStub();
    jest.spyOn(loginServiceMock, "execute");
    jest.spyOn(loginServiceMock, "execute").mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Promise.resolve(makeUserEntity());
    });
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  test("Should remove the loading spinner after CreateUserService return", async () => {
    const userData = makeUserDto();
    const loginServiceMock = new LoginServiceStub();
    jest.spyOn(loginServiceMock, "execute");
    jest.spyOn(loginServiceMock, "execute").mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Promise.resolve(makeUserEntity());
    });
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue("email-input", userData.email);
    await DomTestHelpers.changeInputValue("password-input", userData.password);
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      expect(loadingSpinner).toBeFalsy();
    });
  });
});
