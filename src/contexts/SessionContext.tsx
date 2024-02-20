import type { Session } from "@supabase/supabase-js";

import { Navigate } from "@solidjs/router";
import {
  type Component,
  type JSX,
  Show,
  createContext,
  useContext
} from "solid-js";

import { paths } from "~/utils/paths";

const SessionContext = createContext<() => Session | null>(() => {
  throw new Error("SessionContext not defined");
});

const AuthorizedSessionContext = createContext<() => Session>(() => {
  throw new Error("AuthorizedSessionContext not defined");
});

type SessionProviderProps = {
  children: JSX.Element;
  loadingFallback?: JSX.Element;
  value: Session | null | undefined;
};

export const SessionProvider: Component<SessionProviderProps> = (props) => {
  return (
    <Show
      fallback={props.loadingFallback}
      when={props.value !== undefined ? { session: props.value } : null}
    >
      {(accessor) => (
        <SessionContext.Provider value={() => accessor().session}>
          <Show fallback={props.children} when={accessor().session}>
            <AuthorizedSessionContext.Provider
              value={() => accessor().session!}
            >
              {props.children}
            </AuthorizedSessionContext.Provider>
          </Show>
        </SessionContext.Provider>
      )}
    </Show>
  );
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};

export const useAuthorizedSessionContext = () => {
  return useContext(AuthorizedSessionContext);
};

export const AuthorizedSessionProvider: Component<SessionProviderProps> = (
  props
) => {
  return (
    <Show
      fallback={props.loadingFallback}
      when={props.value !== undefined ? { session: props.value } : null}
    >
      {(accessor) => (
        <SessionContext.Provider value={() => accessor().session}>
          <Show
            fallback={<Navigate href={paths.signIn} />}
            when={accessor().session}
          >
            <AuthorizedSessionContext.Provider
              value={() => accessor().session!}
            >
              {props.children}
            </AuthorizedSessionContext.Provider>
          </Show>
        </SessionContext.Provider>
      )}
    </Show>
  );
};
