/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { FetchEvent } from "@solidjs/start/server/types";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

import { deleteCookie, getCookie, setCookie } from "@solidjs/start/server";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "../types/supabase";

export const supabaseMiddleware = async (event: FetchEvent) => {
  const supabase = createServerClient<Database>(
    event.context.env.SUPABASE_URL,
    event.context.env.SUPABASE_ANON_KEY,
    {
      auth: { flowType: "pkce" },
      cookies: {
        get: (key) => {
          return getCookie(event, key);
        },
        remove: (key, options) => {
          deleteCookie(event, key, options);
        },
        set: (key, value, options) => {
          setCookie(event, key, value, options);
        },
      },
    },
  );

  const result = await supabase.auth.getSession();

  event.context.supabase = supabase;
  event.context.supabaseSession = result.data.session;
};

declare module "vinxi/server" {
  interface H3EventContext {
    supabase: SupabaseClient<Database>;
    supabaseSession: Session | null;
  }
}
