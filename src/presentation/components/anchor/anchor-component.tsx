import React from "react";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

type AnchorProps = {
  name: string;
  redirectLink: string;
};

export const AnchorComponent: React.FC<AnchorProps> = ({
  name,
  redirectLink,
}: AnchorProps) => {
  const navigate = useNavigate();
  const onAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    navigate(redirectLink);
  };

  return (
    <a
      className="anchor"
      data-testid={`${name.toLowerCase().replace(/\s/g, "")}-anchor`}
      onClick={onAnchorClick}
    >
      {name}
    </a>
  );
};
