/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import {
  appendHeader,
  getCookie,
  getHeader,
  type H3EventContext,
} from "@solidjs/start/server";
import type { FetchEvent } from "@solidjs/start/server/types";
import { Lucia, verifyRequestOrigin, type Session, type User } from "lucia";

export const getLucia = (context: H3EventContext) => {
  const adapter = new BetterSqlite3Adapter(context.instance, {
    session: "auth_session",
    user: "auth_user",
  });
  return new Lucia(adapter, {
    getUserAttributes: (user) => ({ username: user.username }),
    sessionCookie: { attributes: { secure: import.meta.env.PROD } },
  });
};

export type LuciaAuth = ReturnType<typeof getLucia>;

export const luciaMiddleware = async (event: FetchEvent) => {
  const lucia = getLucia(event.context);

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
  }
}

declare module "vinxi/server" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
