import { createBrowserClient } from "@supabase/ssr";
import * as v from "valibot";

import type { Database } from "~/types/supabase";

const createSupabaseClient = () => {
  const schema = v.object({ key: v.string(), url: v.string() });
  const parsed = v.parse(schema, {
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
    url: import.meta.env.VITE_SUPABASE_URL
  });

  const client = createBrowserClient<Database>(parsed.url, parsed.key);

  return client;
};

const supabase = createSupabaseClient();

export const getClientSupabase = () => {
  return supabase;
};
