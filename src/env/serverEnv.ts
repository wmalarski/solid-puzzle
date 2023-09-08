import type { FetchEvent } from "solid-start";
import { object, parse, string, withDefault, type Input } from "valibot";

if (typeof window !== "undefined") {
  throw new Error("SERVER ON CLIENT!");
}

const getEnvSchema = () => {
  return object({
    DATABASE_URL: string(),
    NODE_ENV: withDefault(string(), "production"),
    SESSION_SECRET: string(),
  });
};

type ServerEnv = Input<ReturnType<typeof getEnvSchema>>;

type ServerEnvArgs = Pick<FetchEvent, "env" | "locals">;

export const serverEnv = ({ env, locals }: ServerEnvArgs): ServerEnv => {
  const cached = locals.env;
  if (cached) {
    return cached as ServerEnv;
  }

  const envSchema = getEnvSchema();

  const parsed = parse(envSchema, {
    DATABASE_URL: env.DATABASE_URL,
    NODE_ENV: env.NODE_ENV,
    SESSION_SECRET: env.SESSION_SECRET,
  });

  locals.env = parsed;

  return parsed;
};
