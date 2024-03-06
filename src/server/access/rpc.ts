"use server";

import type { Output } from "valibot";

import { redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import { hexColor, minLength, object, safeParseAsync, string } from "valibot";
import { setCookie } from "vinxi/http";

import { paths } from "~/utils/paths";

import {
  type CookieSerializeOptions,
  getParsedCookie,
  getRequestEventOrThrow,
  rpcParseIssueResult
} from "../utils";
import { ACCESS_USERNAME_MIN_LENGTH, BOARDS_ACCESS_CACHE_KEY } from "./const";

const boardAccessSchema = () => {
  return object({
    boardId: string(),
    playerColor: string([hexColor()]),
    playerId: string(),
    userName: string([minLength(ACCESS_USERNAME_MIN_LENGTH)])
  });
};

export type BoardAccess = Output<ReturnType<typeof boardAccessSchema>>;

const getBoardAccessCookieName = (boardId: string) => {
  return `BoardAccess-${boardId}`;
};

const BOARD_ACCESS_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 1000000,
  sameSite: "lax"
};

export const setBoardAccessServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(boardAccessSchema(), decode(form));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  setCookie(
    event.nativeEvent,
    getBoardAccessCookieName(parsed.output.boardId),
    JSON.stringify(parsed.output),
    BOARD_ACCESS_COOKIE_OPTIONS
  );

  throw redirect(paths.board(parsed.output.boardId), {
    revalidate: BOARDS_ACCESS_CACHE_KEY
  });
};

export const getBoardAccessServerLoader = (boardId: string) => {
  const event = getRequestEventOrThrow();
  return getParsedCookie(
    event,
    getBoardAccessCookieName(boardId),
    boardAccessSchema()
  );
};
