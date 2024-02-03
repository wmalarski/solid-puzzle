"use server";
import type { RequestEvent } from "solid-js/web";

import { redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import { minLength, object, safeParseAsync, string } from "valibot";
import { setCookie } from "vinxi/http";

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

type InsertPuzzleFragmentsArgs = {
  boardId: string;
  columns: number;
  event: RequestEvent;
  rows: number;
};

const insertPuzzleFragments = ({
  boardId,
  columns,
  event,
  rows
}: InsertPuzzleFragmentsArgs) => {
  return event.locals.supabase.from("puzzle").insert(
    Array.from({ length: columns * rows }, (_, index) => ({
      index,
      is_locked: false,
      room_id: boardId,
      rotation: 0,
      x: 0,
      y: 0
    }))
  );
};

export const insertBoardServerAction = async (form: FormData) => {
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

  if (!event.locals.supabaseSession) {
    throw redirect(paths.signIn, {
      revalidate: INSERT_BOARD_ARGS_CACHE_KEY
    });
  }

  const config = generateCurves({
    columns: parsed.output.columns,
    rows: parsed.output.rows
  });

  const result = await event.locals.supabase
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

  await insertPuzzleFragments({
    boardId: result.data.id,
    columns: parsed.output.columns,
    event,
    rows: parsed.output.rows
  });

  throw redirect(paths.board(result.data.id), {
    revalidate: INSERT_BOARD_ARGS_CACHE_KEY
  });
};

export const updateBoardServerAction = async (form: FormData) => {
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

  const result = await event.locals.supabase
    .from("rooms")
    .update({
      config,
      media: parsed.output.image,
      name: parsed.output.name
    })
    .eq("id", parsed.output.id);

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  await event.locals.supabase
    .from("puzzle")
    .delete()
    .eq("room_id", parsed.output.id);

  await insertPuzzleFragments({
    boardId: parsed.output.id,
    columns: parsed.output.columns,
    event,
    rows: parsed.output.rows
  });

  return rpcSuccessResult(result.data);
};

export const deleteBoardServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(object({ id: string() }), decode(form));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const result = await event.locals.supabase
    .from("rooms")
    .delete()
    .eq("id", parsed.output.id);

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  throw redirect(paths.home);
};

export const getInsertBoardArgsServerLoader = () => {
  const event = getRequestEventOrThrow();
  return getParsedCookie(
    event,
    INSERT_BOARD_ARGS_COOKIE_NAME,
    insertBoardSchema()
  );
};

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
