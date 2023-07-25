import type { Session, User } from "lucia-auth";
import type { FetchEvent } from "solid-start";
import { getSession, getSessionOrThrow } from "./auth/lucia";
import { getDrizzle, type DrizzleDB } from "./db";

export type RequestContext = DrizzleDB & {
  session: Session | null;
  user: User | null;
};

export type ProtectedRequestContext = DrizzleDB & {
  session: Session;
  user: User;
};

type GetRequestContext = Pick<FetchEvent, "env" | "locals" | "request">;

export const getRequestContext = async (
  args: GetRequestContext,
): Promise<RequestContext> => {
  const drizzle = getDrizzle(args);
  const session = await getSession(args);
  return { ...drizzle, ...session };
};

export const getProtectedRequestContext = async (
  args: GetRequestContext,
): Promise<ProtectedRequestContext> => {
  const drizzle = getDrizzle(args);
  const session = await getSessionOrThrow(args);
  return { ...drizzle, ...session };
};
