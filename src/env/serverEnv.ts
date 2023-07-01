import type { FetchEvent } from "solid-start";
import { z } from "zod";

if (typeof window !== "undefined") {
  throw new Error("SERVER ON CLIENT!");
}

const getEnvSchema = () => {
  return z.object({
    DATABASE_URL: z.string(),
    NODE_ENV: z.string().default("production"),
    SESSION_SECRET: z.string(),
  });
};

type ServerEnv = z.infer<ReturnType<typeof getEnvSchema>>;

type ServerEnvArgs = Pick<FetchEvent, "env" | "locals">;

export const serverEnv = ({ env, locals }: ServerEnvArgs): ServerEnv => {
  const cached = locals.env;
  if (cached) {
    return cached as ServerEnv;
  }

  const envSchema = getEnvSchema();

  const parsed = envSchema.parse({
    DATABASE_URL: env.DATABASE_URL,
    NODE_ENV: env.NODE_ENV,
    SESSION_SECRET: env.SESSION_SECRET,
  });

  locals.env = parsed;

  return parsed;
};
