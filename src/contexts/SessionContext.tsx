import type { Session } from "lucia";

import { type Component, type JSX, createContext, useContext } from "solid-js";

const SessionContext = createContext<() => Session | null>(() => null);

type SessionProviderProps = {
  children: JSX.Element;
  value: () => Session | null;
};

export const SessionProvider: Component<SessionProviderProps> = (props) => {
  return (
    <SessionContext.Provider
      // eslint-disable-next-line solid/reactivity
      value={() => props.value()}
    >
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};
