import { redirect } from "@solidjs/router";
import type { Session, User } from "lucia";
import type { RequestEvent } from "solid-js/web";
import type { H3EventContext } from "vinxi/server";
import { paths } from "~/utils/paths";

export type ProtectedH3EventContext = H3EventContext & {
  session: Session;
  user: User;
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
