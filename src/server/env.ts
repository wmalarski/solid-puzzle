/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { FetchEvent } from "@solidjs/start/server/types";

import { type Input, object, optional, safeParseAsync, string } from "valibot";

if (typeof window !== "undefined") {
  throw new Error("SERVER ON CLIENT!");
}

const getEnvSchema = () => {
  return object({
    DATABASE_URL: string(),
    NODE_ENV: optional(string(), "production"),
    SESSION_SECRET: string(),
  });
};

export type ServerEnv = Input<ReturnType<typeof getEnvSchema>>;

export const serverEnvMiddleware = async (event: FetchEvent) => {
  const envSchema = getEnvSchema();

  const parsed = await safeParseAsync(envSchema, {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: import.meta.env.MODE,
    SESSION_SECRET: process.env.SESSION_SECRET,
  });

  if (parsed.success) {
    event.context.env = parsed.output;
  }
};

declare module "vinxi/server" {
  interface H3EventContext {
    env: ServerEnv;
  }
}
