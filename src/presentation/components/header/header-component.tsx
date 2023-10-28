import { GetUserByTokenUseCase } from "../../../domain/protocols";
import React from "react";
import "./styles.scss";

type HeaderProps = {
  getUserByTokenService: GetUserByTokenUseCase.Service;
};

export const HeaderComponent: React.FC<HeaderProps> = ({
  getUserByTokenService,
}: HeaderProps) => {
  return (
    <div className="header" data-testid="header">
      <h2>Page Header</h2>
    </div>
  );
};
