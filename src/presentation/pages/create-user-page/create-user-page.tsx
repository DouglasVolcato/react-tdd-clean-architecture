import React, { useEffect, useState } from "react";
import { ValidatorInterface } from "../../protocols";
import { CreateUserUseCase } from "../../../domain/protocols";
import {
  InputComponent,
  ErrorMessageComponent,
  ButtonComponent,
  ButtonTypeEnum,
} from "../../components";
import "./styles.scss";

type Props = {
  validator: ValidatorInterface;
  createUserService: CreateUserUseCase.Service;
};

export const CreateUserPage: React.FC<Props> = ({
  validator,
  createUserService,
}: Props) => {
  const [lockSubmit, setLockSubmit] = useState(true);
  const [formError, setFormError] = useState({
    message: "",
    show: false,
  });
  const [userData, setUserData] = useState<CreateUserUseCase.Input>({
    name: "",
    email: "",
    password: "",
  });

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const error = await createUserService.execute(userData);
      if (error instanceof Error) {
        handleFormError(error.message);
      }
    } catch (error) {
      handleFormError("An error occurred");
    }
  };

  const handleFormError = (message: string) => {
    setFormError((old) => ({
      ...old,
      show: true,
      message,
    }));
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((old) => ({ ...old, [name]: value }));
    setFormError((old) => ({ ...old, show: true }));
  };

  useEffect(() => {
    if (formError.show) {
      try {
        const error = validator.validate(userData);
        if (error) {
          handleFormError(error.message);
          setLockSubmit(true);
        } else {
          setFormError((old) => ({ ...old, show: false, message: "" }));
          setLockSubmit(false);
        }
      } catch (error) {
        handleFormError("An error occurred");
      }
    }
  }, [userData]);

  return (
    <div className="create-user-page">
      <form onSubmit={onFormSubmit} className="form-container">
        <InputComponent
          label="Name"
          type="text"
          name="name"
          value={userData.name}
          onChange={onInputChange}
        />

        <InputComponent
          label="Email"
          type="email"
          name="email"
          value={userData.email}
          onChange={onInputChange}
        />

        <InputComponent
          label="Password"
          type="password"
          name="password"
          value={userData.password}
          onChange={onInputChange}
        />

        {formError.show && (
          <ErrorMessageComponent message={formError.message} />
        )}

        <ButtonComponent
          disabled={lockSubmit}
          name="Submit"
          type={ButtonTypeEnum.SUBMIT}
        />
      </form>
    </div>
  );
};
