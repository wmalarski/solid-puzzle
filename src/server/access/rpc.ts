"use server";

import { redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import { object, safeParseAsync, string } from "valibot";
import { setCookie } from "vinxi/http";

import { paths } from "~/utils/paths";

import {
  type CookieSerializeOptions,
  getParsedCookie,
  getRequestEventOrThrow,
  rpcParseIssueResult
} from "../utils";
import { BOARDS_ACCESS_CACHE_KEY } from "./const";

const boardAccessSchema = () => {
  return object({
    boardId: string(),
    playerColor: string(),
    playerId: string(),
    userName: string()
  });
};

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
    event,
    getBoardAccessCookieName(parsed.output.boardId),
    JSON.stringify(parsed.output),
    BOARD_ACCESS_COOKIE_OPTIONS
  );

  throw redirect(paths.board(parsed.output.boardId), {
    revalidate: [BOARDS_ACCESS_CACHE_KEY]
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
