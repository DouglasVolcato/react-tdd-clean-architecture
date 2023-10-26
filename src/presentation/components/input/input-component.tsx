import React from "react";
import './styles.scss'

type InputFieldProps = {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputComponent: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="input-field">
      <label htmlFor={name}>{label}</label>
      <input
        data-testid={`${name.toLowerCase()}-input`}
        onChange={onChange}
        type={type}
        name={name}
        value={value}
      />
    </div>
  );
};
