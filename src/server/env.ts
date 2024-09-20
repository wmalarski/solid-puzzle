 
import type { FetchEvent } from "@solidjs/start/server/types";

import * as v from "valibot";

if (typeof window !== "undefined") {
  throw new Error("SERVER ON CLIENT!");
}

const getEnvSchema = () => {
  return v.object({
    SUPABASE_ANON_KEY: v.string(),
    SUPABASE_URL: v.string()
  });
};

export type ServerEnv = v.InferOutput<ReturnType<typeof getEnvSchema>>;

export const serverEnvMiddleware = async (event: FetchEvent) => {
  const envSchema = getEnvSchema();

  const parsed = await v.safeParseAsync(envSchema, {
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
