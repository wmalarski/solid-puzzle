import { redirect } from "@solidjs/router";
import type { Session, User } from "lucia";
import type { RequestEvent } from "solid-js/web";
import { paths } from "~/utils/paths";
import { getDrizzle, type DrizzleDB } from "./db";

export type RequestContext = DrizzleDB & {
  session: Session | null;
  user: User | null;
};

export type ProtectedRequestContext = DrizzleDB & {
  session: Session;
  user: User;
};

export const getRequestContext = (event: RequestEvent): RequestContext => {
  const session = event.context.session;
  const user = event.context.user;
  const drizzle = getDrizzle(event);
  return { ...drizzle, session, user };
};

export const getProtectedRequestContext = (
  event: RequestEvent,
): ProtectedRequestContext => {
  const session = event.context.session;
  const user = event.context.user;

  if (!session || !user) {
    throw redirect(paths.notFound);
  }

  const drizzle = getDrizzle(event);
  return { ...drizzle, session, user };
};
