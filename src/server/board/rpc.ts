"use server";
import type { RequestEvent } from "solid-js/web";

import { redirect, reload } from "@solidjs/router";
import { decode } from "decode-formdata";
import {
  coerce,
  integer,
  maxLength,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  safeParseAsync,
  string
} from "valibot";
import { setCookie } from "vinxi/http";

import {
  generateCurves,
  getInitialFragmentState
} from "~/utils/getPuzzleFragments";
import { paths } from "~/utils/paths";

import {
  type CookieSerializeOptions,
  getParsedCookie,
  getRequestEventOrThrow,
  rpcErrorResult,
  rpcParseIssueResult
} from "../utils";
import {
  BOARD_MAX_NAME_LENGTH,
  BOARD_MAX_SIZE,
  BOARD_MIN_NAME_LENGTH,
  BOARD_MIN_SIZE,
  INSERT_BOARD_ARGS_CACHE_KEY,
  SELECT_BOARD_LOADER_CACHE_KEY,
  SELECT_BOARDS_LOADER_CACHE_KEY
} from "./const";

const boardDimension = () => {
  return coerce(
    number([integer(), minValue(BOARD_MIN_SIZE), maxValue(BOARD_MAX_SIZE)]),
    Number
  );
};

const insertBoardSchema = () => {
  return object({
    columns: boardDimension(),
    height: number(),
    image: string(),
    name: string([
      minLength(BOARD_MIN_NAME_LENGTH),
      maxLength(BOARD_MAX_NAME_LENGTH)
    ]),
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
  const initial = getInitialFragmentState({ columns, height, rows, width });
  return event.locals.supabase
    .from("puzzle")
    .insert(
      initial.map((fragment) => ({
        ...fragment,
        is_locked: false,
        room_id: boardId
      }))
    )
    .select();
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

  const id = result.data.id;

  const insertFragmentsResult = await insertPuzzleFragments({
    boardId: id,
    columns,
    event,
    height,
    rows,
    width
  });

  if (insertFragmentsResult.error) {
    return rpcErrorResult(insertFragmentsResult.error);
  }

  throw redirect(paths.board(id), {
    revalidate: [INSERT_BOARD_ARGS_CACHE_KEY, SELECT_BOARDS_LOADER_CACHE_KEY]
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

  const { columns, height, id, image, name, rows, width } = parsed.output;

  const deleteFragmentsResult = await event.locals.supabase
    .from("puzzle")
    .delete()
    .eq("room_id", id);

  if (deleteFragmentsResult.error) {
    return rpcErrorResult(deleteFragmentsResult.error);
  }

  const insertFragmentsResult = await insertPuzzleFragments({
    boardId: id,
    columns,
    event,
    height,
    rows,
    width
  });

  if (insertFragmentsResult.error) {
    return rpcErrorResult(insertFragmentsResult.error);
  }

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
    .eq("id", id);

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  throw reload({ revalidate: SELECT_BOARDS_LOADER_CACHE_KEY });
};

export const reloadBoardServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(object({ id: string() }), decode(form));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const { id } = parsed.output;

  const [fragmentsResult, boardResult] = await Promise.all([
    event.locals.supabase.from("puzzle").select().eq("room_id", id),
    event.locals.supabase.from("rooms").select().eq("id", id).single()
  ]);

  if (fragmentsResult.error) {
    return rpcErrorResult(fragmentsResult.error);
  }

  if (boardResult.error) {
    return rpcErrorResult(boardResult.error);
  }

  const { columns, height, rows, width } = boardResult.data;
  const initial = getInitialFragmentState({ columns, height, rows, width });

  const upsertFragmentsResult = await event.locals.supabase
    .from("puzzle")
    .upsert(
      fragmentsResult.data.map((fragment, index) => ({
        id: fragment.id,
        is_locked: false,
        room_id: id,
        ...initial[index]
      }))
    );

  if (upsertFragmentsResult.error) {
    return rpcErrorResult(upsertFragmentsResult.error);
  }

  throw reload({
    revalidate: [SELECT_BOARDS_LOADER_CACHE_KEY, SELECT_BOARD_LOADER_CACHE_KEY]
  });
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

  throw redirect(paths.boards(), {
    revalidate: SELECT_BOARDS_LOADER_CACHE_KEY
  });
};

export const getInsertBoardArgsServerLoader = () => {
  const event = getRequestEventOrThrow();
  return getParsedCookie(
    event,
    INSERT_BOARD_ARGS_COOKIE_NAME,
    insertBoardSchema()
  );
};
