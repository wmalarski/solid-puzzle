import type { Session } from "@supabase/supabase-js";

import { Navigate, useLocation } from "@solidjs/router";
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
  unauthorizedFallback?: JSX.Element;
  value: Session | null | undefined;
};

export const SessionProvider: Component<SessionProviderProps> = (props) => {
  const location = useLocation();

  return (
    <Show
      fallback={props.loadingFallback}
      when={props.value !== undefined ? { session: props.value } : null}
    >
      {(accessor) => (
        <SessionContext.Provider value={() => accessor().session}>
          <Show
            fallback={props.unauthorizedFallback || props.children}
            when={accessor().session}
          >
            <AuthorizedSessionContext.Provider
              value={() => accessor().session!}
            >
              <Show
                fallback={<Navigate href={paths.intro} />}
                when={
                  accessor().session?.user.app_metadata.name ||
                  location.pathname === paths.intro
                }
              >
                {props.children}
              </Show>
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

type AuthorizedSessionProviderProps = {
  children: JSX.Element;
  loadingFallback?: JSX.Element;
  value: Session | null | undefined;
};

export const AuthorizedSessionProvider: Component<
  AuthorizedSessionProviderProps
> = (props) => {
  return (
    <SessionProvider
      loadingFallback={props.loadingFallback}
      unauthorizedFallback={<Navigate href={paths.signIn} />}
      // eslint-disable-next-line solid/reactivity
      value={props.value}
    >
      {props.children}
    </SessionProvider>
  );
};

export const useAuthorizedSessionContext = () => {
  return useContext(AuthorizedSessionContext);
};
