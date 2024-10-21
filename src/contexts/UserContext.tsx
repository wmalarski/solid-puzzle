import type { User } from "@supabase/supabase-js";

import { Navigate, useLocation } from "@solidjs/router";
import {
  Accessor,
  createContext,
  type JSX,
  ParentProps,
  Show,
  useContext
} from "solid-js";

import { paths } from "~/utils/paths";

const UserContext = createContext<Accessor<null | User>>(() => {
  throw new Error("SessionContext not defined");
});

const AuthorizedUserContext = createContext<Accessor<User>>(() => {
  throw new Error("AuthorizedSessionContext not defined");
});

type UserProviderProps = ParentProps<{
  loadingFallback?: JSX.Element;
  unauthorizedFallback?: JSX.Element;
  value: null | undefined | User;
}>;

export function UserProvider(props: UserProviderProps) {
  const location = useLocation();

  return (
    <Show
      fallback={props.loadingFallback}
      when={props.value !== undefined ? { user: props.value } : null}
    >
      {(accessor) => (
        <UserContext.Provider value={() => accessor().user}>
          <Show
            fallback={props.unauthorizedFallback || props.children}
            when={accessor().user}
          >
            <AuthorizedUserContext.Provider value={() => accessor().user!}>
              <Show
                fallback={<Navigate href={paths.intro} />}
                when={
                  accessor().user?.user_metadata.name ||
                  location.pathname === paths.intro
                }
              >
                {props.children}
              </Show>
            </AuthorizedUserContext.Provider>
          </Show>
        </UserContext.Provider>
      )}
    </Show>
  );
}

export const useUserContext = () => {
  return useContext(UserContext);
};

type AuthorizedUserProviderProps = ParentProps<{
  loadingFallback?: JSX.Element;
  value: null | undefined | User;
}>;

export function AuthorizedUserProvider(props: AuthorizedUserProviderProps) {
  return (
    <UserProvider
      loadingFallback={props.loadingFallback}
      unauthorizedFallback={<Navigate href={paths.signIn} />}
      // eslint-disable-next-line solid/reactivity
      value={props.value}
    >
      {props.children}
    </UserProvider>
  );
}

export const useAuthorizedUserContext = () => {
  return useContext(AuthorizedUserContext);
};
