"use server";
import { decode } from "decode-formdata";
import { minLength, object, safeParseAsync, string } from "valibot";

import { generateCurves } from "~/utils/getPuzzleFragments";

import {
  boardDimension,
  getRequestEventOrThrow,
  rpcParseIssueError,
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
    throw rpcParseIssueError(parsed.issues);
  }

  const config = generateCurves({
    columns: parsed.output.columns,
    rows: parsed.output.rows,
  });

  return event.context.supabase.from("rooms").insert({
    config,
    media: parsed.output.image,
    name: parsed.output.name,
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
    throw rpcParseIssueError(parsed.issues);
  }

  const config = generateCurves({
    columns: parsed.output.columns,
    rows: parsed.output.rows,
  });

  return event.context.supabase.from("rooms").update({
    config,
    id: parsed.output.id,
    media: parsed.output.image,
    name: parsed.output.name,
  });
}

export async function deleteBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(object({ id: string() }), decode(form));

  if (!parsed.success) {
    throw rpcParseIssueError(parsed.issues);
  }

  return event.context.supabase
    .from("rooms")
    .delete()
    .eq("id", parsed.output.id);
}
