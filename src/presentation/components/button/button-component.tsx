import React from "react";
import "./styles.scss";

export enum ButtonTypeEnum {
  BUTTON = "button",
  SUBMIT = "submit",
}

type SubmitButtonProps = {
  name: string;
  type: ButtonTypeEnum;
  disabled: boolean;
};

export const ButtonComponent: React.FC<SubmitButtonProps> = ({
  name,
  disabled,
  type,
}: SubmitButtonProps) => {
  return (
    <button
      className="button"
      disabled={disabled}
      data-testid={`${name.toLowerCase().replace(" ", "")}-button`}
      type={type}
    >
      {name}
    </button>
  );
};
