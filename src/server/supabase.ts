import type { FetchEvent } from "@solidjs/start/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { getHeader, setCookie } from "vinxi/http";

import type { Database } from "../types/supabase";

export const supabaseMiddleware = async (event: FetchEvent) => {
  const supabase = createServerClient<Database>(
    event.locals.env.SUPABASE_URL,
    event.locals.env.SUPABASE_ANON_KEY,
    {
      auth: { flowType: "pkce" },
      cookies: {
        getAll: () => {
          return parseCookieHeader(
            getHeader(event.nativeEvent, "Cookie") ?? ""
          );
        },
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, options, value }) =>
            setCookie(event.nativeEvent, name, value, options)
          );
        }
      }
    }
  );

  const user = await supabase.auth.getUser();

  event.locals.supabase = supabase;
  event.locals.supabaseUser = user.data.user;
};

declare module "@solidjs/start/server" {
  interface RequestEventLocals {
    supabase: SupabaseClient<Database>;
    supabaseUser: null | User;
  }
}

declare module "@supabase/supabase-js" {
  interface UserMetadata {
    color?: string;
    name?: string;
  }
}
