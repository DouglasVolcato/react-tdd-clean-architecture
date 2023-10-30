import React, { useEffect, useState } from "react";
import { TokenStorageInterface } from "../../data/protocols";
import { LoadingSpinner } from "../components";
import { useNavigate } from "react-router-dom";

type Props = {
  tokenStorage: TokenStorageInterface;
  privatePage: React.FC;
  loginPageRoute: string;
};

export const PrivatePageProxy: React.FC<Props> = ({
  tokenStorage,
  privatePage,
  loginPageRoute,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const checkIfTokenExists = async () => {
    const tokenExists = await tokenStorage.get("token");
    if (tokenExists) {
      setAuthenticated(true);
    } else {
      navigate(loginPageRoute);
    }
  };

  useEffect(() => {
    checkIfTokenExists();
  }, []);

  return <>{authenticated ? privatePage : <LoadingSpinner loading={true} />}</>;
};
