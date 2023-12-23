import type { Session } from "lucia";
import type { RequestEvent } from "solid-js/web";
import { getSession, getSessionOrThrow } from "./auth/lucia";
import { getDrizzle, type DrizzleDB } from "./db";

export type RequestContext = DrizzleDB & {
  session: Session | null;
};

export type ProtectedRequestContext = DrizzleDB & {
  session: Session;
};

export const getRequestContext = async (
  args: RequestEvent,
): Promise<RequestContext> => {
  const drizzle = getDrizzle(args);
  const session = await getSession(args);
  return { ...drizzle, session };
};

export const getProtectedRequestContext = async (
  args: RequestEvent,
): Promise<ProtectedRequestContext> => {
  const drizzle = getDrizzle(args);
  const session = await getSessionOrThrow(args);
  return { ...drizzle, session };
};
