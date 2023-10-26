import { makeUserEntity, makeUserDto, DomTestHelpers } from "../../test-utils";
import { ValidatorInterface } from "../../../src/presentation/protocols";
import { CreateUserPage } from "../../../src/presentation/pages";
import { CreateUserUseCase } from "../../../src/domain/protocols";
import { render, waitFor } from "@testing-library/react";
import React from "react";

class ValidatorStub implements ValidatorInterface {
  public validate(data: any): Error | undefined {
    return;
  }
}

class CreateUserServiceStub implements CreateUserUseCase.Service {
  public execute(
    input: CreateUserUseCase.Input
  ): Promise<CreateUserUseCase.Output | Error> {
    return Promise.resolve(makeUserEntity());
  }
}

type SutMockTypes = {
  validator?: ValidatorInterface;
  createUserService?: CreateUserUseCase.Service;
};

const makeSut = (mocks?: SutMockTypes): void => {
  render(
    <CreateUserPage
      validator={mocks?.validator ?? new ValidatorStub()}
      createUserService={
        mocks?.createUserService ?? new CreateUserServiceStub()
      }
    />
  );
};

describe("CreateUserPage", () => {
  test("Should initiate with empty values", async () => {
    makeSut();
    const nameInput = DomTestHelpers.getInputElementById("name-input");
    const emailInput = DomTestHelpers.getInputElementById("email-input");
    const passwordInput = DomTestHelpers.getInputElementById("password-input");
    const submitButton = DomTestHelpers.getButtonElementById("submit-button");
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    expect(nameInput.value).toBe("");
    expect(passwordInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(submitButton.disabled).toBeTruthy();
    expect(screenErrorMessage).toBeNull();
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
      expect(screenErrorMessage?.innerHTML).toBe("An error ocurred");
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
      expect(screenErrorMessage?.innerHTML).toBe("An error ocurred");
    });
  });

  test("Should the error message if CreateUserService returns an error", async () => {
    const mockErrorMessage = "Any error message";
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
});
