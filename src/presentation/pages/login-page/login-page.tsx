import React, { useEffect, useState } from "react";
import { ValidatorInterface } from "../../protocols";
import { LoginUseCase } from "../../../domain/protocols";
import {
  InputComponent,
  ErrorMessageComponent,
  ButtonComponent,
  ButtonTypeEnum,
  LoadingSpinner,
} from "../../components";
import "./styles.scss";

type Props = {
  validator: ValidatorInterface;
  loginService: LoginUseCase.Service;
};

export const LoginPage: React.FC<Props> = ({
  validator,
  loginService,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [lockSubmit, setLockSubmit] = useState(true);
  const [formError, setFormError] = useState({
    message: "",
    show: false,
  });
  const [userData, setUserData] = useState<LoginUseCase.Input>({
    email: "",
    password: "",
  });

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const error = await loginService.execute(userData);
      if (error instanceof Error) {
        handleFormError(error.message);
      }
    } catch (error) {
      handleFormError("An error occurred");
    } finally {
      setLoading(false);
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
    <div className="login-page">
      <form onSubmit={onFormSubmit} className="form-container">
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
      <LoadingSpinner loading={loading} />
    </div>
  );
};
