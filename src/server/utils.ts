import { redirect } from "@solidjs/router";
import { getCookie, type setCookie } from "@solidjs/start/server";
import { type RequestEvent, getRequestEvent } from "solid-js/web";
import {
  type BaseSchema,
  type BaseSchemaAsync,
  type Issues,
  coerce,
  integer,
  minValue,
  number,
  safeParseAsync,
} from "valibot";

import { paths } from "~/utils/paths";

export type CookieSerializeOptions = Parameters<typeof setCookie>[3];

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RpcResult<T = any> = {
  data?: T;
  error?: string;
  errors?: Record<string, string>;
  success: boolean;
};

export const rpcParseIssueResult = (issues: Issues): RpcResult => {
  return {
    errors: Object.fromEntries(
      issues.map((issue) => [
        issue.path?.map((item) => item.key).join(".") || "global",
        issue.message,
      ]),
    ),
    success: false,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rpcSuccessResult = <T = any>(data?: T): RpcResult => {
  return { data, success: true };
};

export const rpcErrorResult = <T extends { message: string }>(
  error: T,
): RpcResult => {
  return { error: error.message, success: false };
};

export const getParsedCookie = async <
  TSchema extends BaseSchema | BaseSchemaAsync,
>(
  event: RequestEvent,
  name: string,
  schema: TSchema,
) => {
  const cookie = getCookie(event, name);

  if (!cookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(cookie);
    const result = await safeParseAsync(schema, parsed);

    if (!result.success) {
      return null;
    }

    return result.output;
  } catch {
    return null;
  }
};
