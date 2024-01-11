import { createClient } from "@supabase/supabase-js";
import {
  type Component,
  type JSX,
  createContext,
  createMemo,
  useContext,
} from "solid-js";
import { object, parse, string } from "valibot";

const createSupabaseClient = () => {
  const schema = object({ key: string(), url: string() });
  const parsed = parse(schema, {
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
    url: import.meta.env.VITE_SUPABASE_URL,
  });

  const client = createClient(parsed.url, parsed.key);

  return client;
};

type SupabaseContextState = typeof createSupabaseClient;

const SupabaseContext = createContext<SupabaseContextState>(
  () => null as unknown as ReturnType<SupabaseContextState>,
);

type Props = {
  children: JSX.Element;
};

export const SupabaseProvider: Component<Props> = (props) => {
  const supabase = createMemo(() => createSupabaseClient());

  return (
    <SupabaseContext.Provider value={supabase}>
      {props.children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  return useContext(SupabaseContext);
};
