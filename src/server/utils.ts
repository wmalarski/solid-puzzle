import { redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { paths } from "~/utils/paths";

export const getRequestEventOrThrow = () => {
  const event = getRequestEvent();

  if (!event) {
    throw redirect(paths.notFound);
  }

  return event;
};
