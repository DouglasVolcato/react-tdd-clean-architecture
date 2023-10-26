import React, { useEffect, useState } from "react";
import { ValidatorInterface } from "../../protocols";
import { CreateUserUseCase } from "../../../domain/protocols";
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

  useEffect(() => {
    if (formError.show) {
      try {
        const error = validator.validate(userData);
        if (error) {
          setFormError((old) => ({ ...old, message: error.message }));
          setLockSubmit(true);
        } else {
          setFormError((old) => ({ ...old, show: false, message: "" }));
          setLockSubmit(false);
        }
      } catch (error) {
        setFormError((old) => ({
          ...old,
          show: true,
          message: "An error ocurred",
        }));
      }
    }
  }, [userData.name, userData.email, userData.password]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((old) => ({ ...old, [name]: value }));
    setFormError((old) => ({ ...old, show: true }));
  };

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const error = await createUserService.execute(userData);
      if (error instanceof Error) {
        setFormError((old) => ({
          ...old,
          show: true,
          message: error.message,
        }));
      }
    } catch (error) {
      setFormError((old) => ({
        ...old,
        show: true,
        message: "An error ocurred",
      }));
    }
  };

  return (
    <>
      <form onSubmit={onFormSubmit}>
        <label htmlFor="name">Name</label>
        <input
          data-testid="name-input"
          onChange={onInputChange}
          type="text"
          name="name"
        />

        <label htmlFor="email">Email</label>
        <input
          data-testid="email-input"
          onChange={onInputChange}
          type="email"
          name="email"
        />

        <label htmlFor="password">Password</label>
        <input
          data-testid="password-input"
          onChange={onInputChange}
          type="text"
          name="password"
        />

        {formError.show ? (
          <p data-testid="error-message">{formError.message}</p>
        ) : (
          <></>
        )}

        <button disabled={lockSubmit} data-testid="submit-button" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};
