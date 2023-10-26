import React from "react";
import "./styles.scss";

type ErrorMessageProps = {
  message: string;
};

export const ErrorMessageComponent: React.FC<ErrorMessageProps> = ({
  message,
}: ErrorMessageProps) => {
  return (
    <p className="error-message" data-testid="error-message">
      {message}
    </p>
  );
};
