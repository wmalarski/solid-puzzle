/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { FetchEvent } from "@solidjs/start/server";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

import { createServerClient } from "@supabase/ssr";
import { deleteCookie, getCookie, setCookie } from "vinxi/http";

import type { Database } from "../types/supabase";

export const supabaseMiddleware = async (event: FetchEvent) => {
  const supabase = createServerClient<Database>(
    event.locals.env.SUPABASE_URL,
    event.locals.env.SUPABASE_ANON_KEY,
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
        }
      }
    }
  );

  const result = await supabase.auth.getSession();

  event.locals.supabase = supabase;
  event.locals.supabaseSession = result.data.session;
};

declare module "@solidjs/start/server" {
  interface RequestEventLocals {
    supabase: SupabaseClient<Database>;
    supabaseSession: Session | null;
  }
}

declare module "@supabase/supabase-js" {
  interface UserAppMetadata {
    color?: string;
    name?: string;
  }
}
