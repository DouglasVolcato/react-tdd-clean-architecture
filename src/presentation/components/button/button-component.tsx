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
  onClickCallback?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => any;
};

export const ButtonComponent: React.FC<SubmitButtonProps> = ({
  name,
  disabled,
  type,
  onClickCallback,
}: SubmitButtonProps) => {
  return (
    <button
      className="button"
      disabled={disabled}
      data-testid={`${name.toLowerCase().replace(/\s/g, "")}-button`}
      type={type}
      onClick={onClickCallback}
    >
      {name}
    </button>
  );
};
