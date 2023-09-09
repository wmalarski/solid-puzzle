import type { FetchEvent } from "solid-start";
import type { Middleware } from "solid-start/entry-server";
import { object, parseAsync, string, withDefault, type Input } from "valibot";

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

export const serverEnv = (event: FetchEvent) => {
  return event.locals.env as ServerEnv;
};

export const serverEnvMiddleware: Middleware = ({ forward }) => {
  return async (event: FetchEvent) => {
    const envSchema = getEnvSchema();

    const parsed = await parseAsync(envSchema, {
      DATABASE_URL: event.env.DATABASE_URL,
      NODE_ENV: event.env.NODE_ENV,
      SESSION_SECRET: event.env.SESSION_SECRET,
    });

    event.locals.env = parsed;

    return forward(event);
  };
};
