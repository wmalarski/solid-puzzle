/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { FetchEvent } from "@solidjs/start/server/types";

import { type Input, object, safeParseAsync, string } from "valibot";

if (typeof window !== "undefined") {
  throw new Error("SERVER ON CLIENT!");
}

const getEnvSchema = () => {
  return object({
    SUPABASE_ANON_KEY: string(),
    SUPABASE_URL: string()
  });
};

export type ServerEnv = Input<ReturnType<typeof getEnvSchema>>;

export const serverEnvMiddleware = async (event: FetchEvent) => {
  const envSchema = getEnvSchema();

  const parsed = await safeParseAsync(envSchema, {
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL
  });

  if (parsed.success) {
    event.locals.env = parsed.output;
  }
};

declare module "@solidjs/start/server" {
  interface RequestEventLocals {
    env: ServerEnv;
  }
}
