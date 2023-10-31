import React from "react";
import "./styles.scss";

type FormTitleProps = {
  title: string;
};

export const FormTitleComponent: React.FC<FormTitleProps> = ({
  title,
}: FormTitleProps) => {
  return (
    <h2
      className="form-title"
      data-testid={`form-title-${title.toLowerCase().replace(/\s/g, "")}`}
    >
      {title}
    </h2>
  );
};
