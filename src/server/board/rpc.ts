"use server";
import { redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import { minLength, object, safeParseAsync, string } from "valibot";

import { generateCurves } from "~/utils/getPuzzleFragments";
import { paths } from "~/utils/paths";

import {
  boardDimension,
  getRequestEventOrThrow,
  rpcErrorResult,
  rpcParseIssueResult,
  rpcSuccessResult,
} from "../utils";

export async function insertBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      columns: boardDimension(),
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

  throw redirect(paths.board(result.data.id));
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
