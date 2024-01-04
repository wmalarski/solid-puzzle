"use server";
import { decode } from "decode-formdata";
import {
  coerce,
  maxValue,
  minLength,
  number,
  object,
  safeParseAsync,
  string,
} from "valibot";
import { getProtectedRequestContext } from "../context";
import { hasBoardAccess } from "../share/db";
import { issuesToRpcResponse, rpcParseIssueError } from "../types";
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
    return issuesToRpcResponse(parsed.issues);
  }

  const ctx = getProtectedRequestContext(event);

  const boardId = insertBoard({ ...parsed.output, ctx });

  return { id: boardId };
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
    return issuesToRpcResponse(parsed.issues);
  }

  const ctx = getProtectedRequestContext(event);

  const count = updateBoard({ ...parsed.output, ctx });

  return { count, success: true } as const;
}

export async function deleteBoardServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(object({ id: string() }), decode(form));

  if (!parsed.success) {
    return issuesToRpcResponse(parsed.issues);
  }

  const ctx = getProtectedRequestContext(event);

  deleteBoard({ ...parsed.output, ctx });

  return { success: true } as const;
}

type SelectBoardServerLoaderArgs = {
  id: string;
};

export async function selectBoardServerLoader(
  args: SelectBoardServerLoaderArgs,
) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(object({ id: string() }), args);

  if (!parsed.success) {
    throw rpcParseIssueError(parsed.issues);
  }

  const board = selectBoard({ ...parsed.output, ctx: event.context });

  if (!board) {
    throw new Error("Board not found");
  }

  return board;
}

export async function selectProtectedBoardServerLoader(
  args: SelectBoardServerLoaderArgs,
) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(object({ id: string() }), args);

  if (!parsed.success) {
    throw rpcParseIssueError(parsed.issues);
  }

  const board = selectBoard({ ...parsed.output, ctx: event.context });

  if (!board) {
    throw new Error("Board not found");
  }

  const access = await hasBoardAccess({ boardId: parsed.output.id, event });
  const user = event.context.user;
  const session = event.context.session;

  if (access) {
    return { access, board, session };
  }

  if (board.ownerId !== user?.id) {
    throw new Error("No access to board");
  }

  const ownerAccess = { boardId: parsed.output.id, username: user.username };
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

  const parsed = await safeParseAsync(
    object({
      limit: coerce(number([maxValue(20)]), Number),
      offset: coerce(number(), Number),
    }),
    args,
  );

  if (!parsed.success) {
    throw rpcParseIssueError(parsed.issues);
  }

  const ctx = getProtectedRequestContext(event);

  return selectBoards({ ...parsed.output, ctx });
}
