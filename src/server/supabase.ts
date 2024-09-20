 
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
          return getCookie(event.nativeEvent, key);
        },
        remove: (key, options) => {
          deleteCookie(event.nativeEvent, key, options);
        },
        set: (key, value, options) => {
          setCookie(event.nativeEvent, key, value, options);
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
    supabaseSession: null | Session;
  }
}

declare module "@supabase/supabase-js" {
  interface UserMetadata {
    color?: string;
    name?: string;
  }
}
