import type { H3EventContext } from "@solidjs/start/server";
import type { Session, User } from "lucia";
import type { RequestEvent } from "solid-js/web";

import { redirect } from "@solidjs/router";

import { paths } from "~/utils/paths";

export type WithH3EventContext<T> = T & {
  ctx: H3EventContext;
};

export type ProtectedH3EventContext = H3EventContext & {
  session: Session;
  user: User;
};

export type WithProtectedH3EventContext<T> = T & {
  ctx: ProtectedH3EventContext;
};

export const getProtectedRequestContext = (
  event: RequestEvent,
): ProtectedH3EventContext => {
  const session = event.context.session;
  const user = event.context.user;

  if (!session || !user) {
    throw redirect(paths.notFound);
  }

  return { ...event.context, session, user };
};
