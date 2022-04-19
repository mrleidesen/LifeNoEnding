import React, { createContext, useContext, useState } from 'react';

interface RouterProps {
  setRouter: (name: string) => void;
  routerName: string;
}

const RouterProvider = createContext<RouterProps>({} as RouterProps);

export const useRouter = (): RouterProps => useContext(RouterProvider);

export const Router: React.FC = ({ children }) => {
  const [routerName, setRouterName] = useState<string>('game');

  const setRouter = (name: string) => {
    setRouterName(name);
  };

  return (
    <RouterProvider.Provider
      value={{
        setRouter,
        routerName,
      }}
    >
      {children}
    </RouterProvider.Provider>
  );
};

export const Route: React.FC<{
  name: string;
}> = ({ name, children }) => {
  const { routerName } = useRouter();

  if (routerName === name) {
    return <>{children}</>;
  }

  return null;
};
