"use server";
import type { RequestEvent } from "solid-js/web";

import { redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import { minLength, number, object, safeParseAsync, string } from "valibot";
import { setCookie } from "vinxi/http";

import {
  generateCurves,
  getInitialFragmentState
} from "~/utils/getPuzzleFragments";
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
import { INSERT_BOARD_ARGS_CACHE_KEY } from "./const";

const insertBoardSchema = () => {
  return object({
    columns: boardDimension(),
    height: number(),
    image: string(),
    name: string([minLength(3)]),
    rows: boardDimension(),
    width: number()
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
  height: number;
  rows: number;
  width: number;
};

const insertPuzzleFragments = ({
  boardId,
  columns,
  event,
  height,
  rows,
  width
}: InsertPuzzleFragmentsArgs) => {
  return event.locals.supabase
    .from("puzzle")
    .insert(
      getInitialFragmentState({ columns, height, rows, width }).map(
        (fragment) => ({ ...fragment, is_locked: false, room_id: boardId })
      )
    );
};

export const insertBoardServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    insertBoardSchema(),
    decode(form, { numbers: ["rows", "columns", "height", "width"] })
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

  const { columns, height, image, name, rows, width } = parsed.output;

  const config = generateCurves({ columns, rows });

  const result = await event.locals.supabase
    .from("rooms")
    .insert({ columns, config, height, media: image, name, rows, width })
    .select()
    .single();

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  await insertPuzzleFragments({
    boardId: result.data.id,
    columns,
    event,
    height,
    rows,
    width
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
      height: number(),
      id: string(),
      image: string(),
      name: string([minLength(3)]),
      rows: boardDimension(),
      width: number()
    }),
    decode(form, { numbers: ["rows", "columns", "height", "width"] })
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const { columns, height, image, name, rows, width } = parsed.output;

  const config = generateCurves({ columns, rows });

  const result = await event.locals.supabase
    .from("rooms")
    .update({
      columns,
      config,
      height,
      media: image,
      name: name,
      rows,
      width
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
    columns,
    event,
    height,
    rows,
    width
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
