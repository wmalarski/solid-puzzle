"use server";
import { redirect } from "@solidjs/router";
import { getRequestEventOrThrow } from "~/server/utils";
import { paths } from "~/utils/paths";

export const serverLoad = () => {
  const event = getRequestEventOrThrow();
  const session = event.context.session;

  if (!session) {
    throw redirect(paths.notFound);
  }

  // await selectBoardsLoader({ limit: SELECT_BOARDS_DEFAULT_LIMIT, offset: 0 });

  return Promise.resolve(session);
};
