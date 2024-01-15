/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { FetchEvent } from "@solidjs/start/server/types";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

import { deleteCookie, getCookie, setCookie } from "@solidjs/start/server";
import { createServerClient } from "@supabase/ssr";

export const supabaseMiddleware = async (event: FetchEvent) => {
  const supabase = createServerClient(
    event.context.env.SUPABASE_URL,
    event.context.env.SUPABASE_ANON_KEY,
    {
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

  event.context.supabaseSession = result.data.session;
};

declare module "vinxi/server" {
  interface H3EventContext {
    supabase: SupabaseClient;
    supabaseSession: Session | null;
  }
}
