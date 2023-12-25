/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { FetchEvent } from "@solidjs/start/server/types";
import { object, optional, parseAsync, string, type Input } from "valibot";

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

type ServerEnv = Input<ReturnType<typeof getEnvSchema>>;

export const serverEnvMiddleware = async (event: FetchEvent) => {
  const envSchema = getEnvSchema();

  const parsed = await parseAsync(envSchema, {
    DATABASE_URL: import.meta.env.DATABASE_URL,
    NODE_ENV: import.meta.env.NODE_ENV,
    SESSION_SECRET: import.meta.env.SESSION_SECRET,
  });

  event.locals.env = parsed;
};

declare module "vinxi/server" {
  interface H3EventContext {
    env: ServerEnv;
  }
}
