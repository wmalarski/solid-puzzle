/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { appendHeader, getCookie, getHeader } from "@solidjs/start/server";
import type { FetchEvent } from "@solidjs/start/server/types";
import { Lucia, verifyRequestOrigin, type Session, type User } from "lucia";
import type { RequestEvent } from "solid-js/web";
import type { DrizzleDB } from "../db";

const getLucia = (database: DrizzleDB["instance"]) => {
  const adapter = new BetterSqlite3Adapter(database, {
    session: "auth_session",
    user: "auth_user",
  });
  return new Lucia(adapter, {
    getUserAttributes: (user) => ({ username: user.username }),
    sessionCookie: { attributes: { secure: import.meta.env.PROD } },
  });
};

export type LuciaAuth = ReturnType<typeof getLucia>;

export const getLuciaAuth = (event: RequestEvent) => {
  return event.locals.auth as LuciaAuth;
};

export const luciaMiddleware = async (event: FetchEvent) => {
  const lucia = getLucia(event.context.db.instance);

  if (event.node.req.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      event.node.res.writeHead(403).end();
      return;
    }
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  }
  if (!session) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
  }
  event.context.session = session;
  event.context.user = user;
};

declare module "lucia" {
  interface Register {
    Lucia: LuciaAuth;
  }
  interface DatabaseUserAttributes {
    username: string;
    github_id: number;
  }
}

declare module "vinxi/server" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
