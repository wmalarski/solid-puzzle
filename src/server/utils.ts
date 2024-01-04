import { redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { coerce, integer, minValue, number, type Issues } from "valibot";
import { paths } from "~/utils/paths";

export const getRequestEventOrThrow = () => {
  const event = getRequestEvent();

  if (!event) {
    throw redirect(paths.notFound, { status: 500 });
  }

  return event;
};

export const boardDimension = () => {
  return coerce(number([integer(), minValue(3)]), Number);
};

export const rpcParseIssueError = (issues: Issues) => {
  return new Error(issues[0].message);
};
