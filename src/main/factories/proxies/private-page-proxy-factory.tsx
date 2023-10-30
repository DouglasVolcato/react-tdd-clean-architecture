import { StorageAdapter } from "../../../infra/adapters";
import { PrivatePageProxy } from "../../../presentation/proxies";

export const makePrivatePageProxyFactory = (
  privatePage: React.FC,
  loginPageRoute: string
): React.FC<any> => {
  const tokenStorage = new StorageAdapter();
  const page: React.FC<any> = () => (
    <PrivatePageProxy
      privatePage={privatePage}
      loginPageRoute={loginPageRoute}
      tokenStorage={tokenStorage}
    />
  );
  return page;
};
