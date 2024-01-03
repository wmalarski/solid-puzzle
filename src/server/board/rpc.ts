"use server";
import { decode } from "decode-formdata";
import {
  coerce,
  maxValue,
  minLength,
  number,
  object,
  parseAsync,
  string,
} from "valibot";
import { getProtectedRequestContext } from "../context";
import { hasBoardAccess } from "../share/db";
import { boardDimension, getRequestEventOrThrow } from "../utils";
import {
  deleteBoard,
  insertBoard,
  selectBoard,
  selectBoards,
  updateBoard,
} from "./db";

export async function insertBoardServerAction(form: FormData) {
  console.log("insertBoardServerAction", Object.fromEntries(form.entries()));

  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    object({
      columns: boardDimension(),
      image: string(),
      name: string([minLength(3)]),
      rows: boardDimension(),
    }),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  const ctx = getProtectedRequestContext(event);

  const boardId = insertBoard({ ...parsed, ctx });

  return { id: boardId };
}

export async function updateBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    object({
      columns: boardDimension(),
      id: string(),
      image: string(),
      name: string([minLength(3)]),
      rows: boardDimension(),
    }),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  const ctx = getProtectedRequestContext(event);

  return updateBoard({ ...parsed, ctx });
}

export async function deleteBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(object({ id: string() }), decode(form));

  const ctx = getProtectedRequestContext(event);

  deleteBoard({ ...parsed, ctx });

  return true;
}

type SelectBoardServerLoaderArgs = {
  id: string;
};

export async function selectBoardServerLoader(
  args: SelectBoardServerLoaderArgs,
) {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(object({ id: string() }), args);

  const board = selectBoard({ ...parsed, ctx: event.context });

  if (!board) {
    throw new Error("Board not found");
  }

  return board;
}

export async function selectProtectedBoardServerLoader(
  args: SelectBoardServerLoaderArgs,
) {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(object({ id: string() }), args);

  const board = selectBoard({ ...parsed, ctx: event.context });

  if (!board) {
    throw new Error("Board not found");
  }

  const access = await hasBoardAccess({ boardId: parsed.id, event });
  const user = event.context.user;
  const session = event.context.session;

  if (access) {
    return { access, board, session };
  }

  if (board.ownerId !== user?.id) {
    throw new Error("No access to board");
  }

  const ownerAccess = { boardId: parsed.id, username: user.username };
  return { access: ownerAccess, board, session };
}

type SelectBoardsServerLoaderArgs = {
  limit: number;
  offset: number;
};

export async function selectBoardsServerLoader(
  args: SelectBoardsServerLoaderArgs,
) {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    object({
      limit: coerce(number([maxValue(20)]), Number),
      offset: coerce(number(), Number),
    }),
    args,
  );

  const ctx = getProtectedRequestContext(event);

  return selectBoards({ ...parsed, ctx });
}
