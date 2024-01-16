"use server";
import { redirect } from "@solidjs/router";
import { getCookie, setCookie } from "@solidjs/start/server";
import { decode } from "decode-formdata";
import { minLength, object, safeParseAsync, string } from "valibot";

import { generateCurves } from "~/utils/getPuzzleFragments";
import { paths } from "~/utils/paths";

import {
  type CookieSerializeOptions,
  boardDimension,
  getRequestEventOrThrow,
  rpcErrorResult,
  rpcParseIssueResult,
  rpcSuccessResult,
} from "../utils";
import { INSERT_BOARD_ARGS_CACHE_KEY } from "./const";

const insertBoardSchema = () => {
  return object({
    columns: boardDimension(),
    image: string(),
    name: string([minLength(3)]),
    rows: boardDimension(),
  });
};

const INSERT_BOARD_ARGS_COOKIE_NAME = "InsertBoardArgs";
const INSERT_BOARD_ARGS_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 10000,
  sameSite: "lax",
};

export async function insertBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    insertBoardSchema(),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  setCookie(
    event,
    INSERT_BOARD_ARGS_COOKIE_NAME,
    JSON.stringify(parsed.output),
    INSERT_BOARD_ARGS_COOKIE_OPTIONS,
  );

  if (!event.context.supabaseSession) {
    throw redirect(paths.signIn, {
      revalidate: INSERT_BOARD_ARGS_CACHE_KEY,
    });
  }

  const config = generateCurves({
    columns: parsed.output.columns,
    rows: parsed.output.rows,
  });

  const result = await event.context.supabase
    .from("rooms")
    .insert({
      config,
      media: parsed.output.image,
      name: parsed.output.name,
    })
    .select()
    .single();

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  throw redirect(paths.board(result.data.id), {
    revalidate: INSERT_BOARD_ARGS_CACHE_KEY,
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
      rows: boardDimension(),
    }),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const config = generateCurves({
    columns: parsed.output.columns,
    rows: parsed.output.rows,
  });

  const result = await event.context.supabase.from("rooms").update({
    config,
    id: parsed.output.id,
    media: parsed.output.image,
    name: parsed.output.name,
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

export async function getInsertBoardArgsServerLoader() {
  const event = getRequestEventOrThrow();
  const cookie = getCookie(event, INSERT_BOARD_ARGS_COOKIE_NAME);

  if (!cookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(cookie);
    const result = await safeParseAsync(insertBoardSchema(), parsed);

    if (!result.success) {
      return null;
    }

    return result.output;
  } catch {
    return null;
  }
}
