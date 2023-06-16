import type { Session, User } from "lucia-auth";
import { createContext, useContext, type Component, type JSX } from "solid-js";

export type SessionContextState = {
  session: Session | null;
  user: User | null;
};

const sessionContextDefaultValue: SessionContextState = {
  session: null,
  user: null,
};

const SessionContext = createContext<() => SessionContextState>(() => ({
  session: null,
  user: null,
}));

type SessionProviderProps = {
  children: JSX.Element;
  value: () => SessionContextState | undefined;
};

export const SessionProvider: Component<SessionProviderProps> = (props) => {
  return (
    <SessionContext.Provider
      // eslint-disable-next-line solid/reactivity
      value={() => props.value() || sessionContextDefaultValue}
    >
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};
