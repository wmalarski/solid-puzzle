"use server";
import { redirect } from "@solidjs/router";
import { setCookie } from "@solidjs/start/server";
import { decode } from "decode-formdata";
import { minLength, object, safeParseAsync, string } from "valibot";

import { generateCurves } from "~/utils/getPuzzleFragments";
import { paths } from "~/utils/paths";

import {
  type CookieSerializeOptions,
  boardDimension,
  getParsedCookie,
  getRequestEventOrThrow,
  rpcErrorResult,
  rpcParseIssueResult,
  rpcSuccessResult
} from "../utils";
import { BOARDS_ACCESS_CACHE_KEY, INSERT_BOARD_ARGS_CACHE_KEY } from "./const";

const insertBoardSchema = () => {
  return object({
    columns: boardDimension(),
    image: string(),
    name: string([minLength(3)]),
    rows: boardDimension()
  });
};

const INSERT_BOARD_ARGS_COOKIE_NAME = "InsertBoardArgs";
const INSERT_BOARD_ARGS_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 10000,
  sameSite: "lax"
};

export async function insertBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    insertBoardSchema(),
    decode(form, { numbers: ["rows", "columns"] })
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  setCookie(
    event,
    INSERT_BOARD_ARGS_COOKIE_NAME,
    JSON.stringify(parsed.output),
    INSERT_BOARD_ARGS_COOKIE_OPTIONS
  );

  if (!event.context.supabaseSession) {
    throw redirect(paths.signIn, {
      revalidate: INSERT_BOARD_ARGS_CACHE_KEY
    });
  }

  const config = generateCurves({
    columns: parsed.output.columns,
    rows: parsed.output.rows
  });

  const result = await event.context.supabase
    .from("rooms")
    .insert({
      config,
      media: parsed.output.image,
      name: parsed.output.name
    })
    .select()
    .single();

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  throw redirect(paths.board(result.data.id), {
    revalidate: INSERT_BOARD_ARGS_CACHE_KEY
  });
}

export async function updateBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      columns: boardDimension(),
      id: string(),
      image: string(),
      name: string([minLength(3)]),
      rows: boardDimension()
    }),
    decode(form, { numbers: ["rows", "columns"] })
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const config = generateCurves({
    columns: parsed.output.columns,
    rows: parsed.output.rows
  });

  const result = await event.context.supabase.from("rooms").update({
    config,
    id: parsed.output.id,
    media: parsed.output.image,
    name: parsed.output.name
  });

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  return rpcSuccessResult(result.data);
}

export async function deleteBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(object({ id: string() }), decode(form));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const result = await event.context.supabase
    .from("rooms")
    .delete()
    .eq("id", parsed.output.id);

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  throw redirect(paths.home);
}

export function getInsertBoardArgsServerLoader() {
  const event = getRequestEventOrThrow();
  return getParsedCookie(
    event,
    INSERT_BOARD_ARGS_COOKIE_NAME,
    insertBoardSchema()
  );
}

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

export async function setBoardAccessServerAction(form: FormData) {
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
}

export function getBoardAccessServerLoader(boardId: string) {
  const event = getRequestEventOrThrow();
  return getParsedCookie(
    event,
    getBoardAccessCookieName(boardId),
    boardAccessSchema()
  );
}
