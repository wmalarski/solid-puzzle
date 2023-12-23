import type { RequestEvent } from "solid-js/web";
import type { Middleware } from "solid-start/entry-server";
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

export const serverEnv = (event: RequestEvent) => {
  return event.locals.env as ServerEnv;
};

export const serverEnvMiddleware: Middleware = ({ forward }) => {
  return async (event) => {
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
