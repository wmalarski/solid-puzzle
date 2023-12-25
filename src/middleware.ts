import {
  appendHeader,
  createMiddleware,
  getCookie,
  getHeader,
} from "@solidjs/start/server";
import { verifyRequestOrigin, type Session, type User } from "lucia";
import { lucia } from "./lib/auth";

export default createMiddleware({
  onRequest: async (event) => {
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
  },
});

declare module "vinxi/server" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
