"use server";
import { decode } from "decode-formdata";
import {
  coerce,
  integer,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  parseAsync,
  string,
  type Input,
} from "valibot";
import { getProtectedRequestContext } from "../context";
import { hasBoardAccess } from "../share/db";
import { getRequestEventOrThrow } from "../utils";
import {
  deleteBoard,
  insertBoard,
  selectBoard,
  selectBoards,
  updateBoard,
} from "./db";

const boardDimension = () => {
  return coerce(number([integer(), minValue(3)]), Number);
};

const insertBoardArgsSchema = () => {
  return object({
    columns: boardDimension(),
    image: string(),
    name: string([minLength(3)]),
    rows: boardDimension(),
  });
};

export const insertBoardServerAction = async (form: FormData) => {
  console.log("insertBoardServerAction", Object.fromEntries(form.entries()));

  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    insertBoardArgsSchema(),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  const ctx = getProtectedRequestContext(event);

  const boardId = insertBoard({ ...parsed, ctx });

  return { id: boardId };
};

const updateBoardArgsSchema = () => {
  return object({
    columns: boardDimension(),
    id: string(),
    image: string(),
    name: string([minLength(3)]),
    rows: boardDimension(),
  });
};

export const updateBoardServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    updateBoardArgsSchema(),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  const ctx = getProtectedRequestContext(event);

  return updateBoard({ ...parsed, ctx });
};

const deleteBoardArgsSchema = () => {
  return object({ id: string() });
};

export const deleteBoardServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(deleteBoardArgsSchema(), decode(form));

  const ctx = getProtectedRequestContext(event);

  deleteBoard({ ...parsed, ctx });

  return true;
};

const selectBoardArgsSchema = () => {
  return object({ id: string() });
};

export const selectBoardServerLoader = async (
  args: Input<ReturnType<typeof selectBoardArgsSchema>>,
) => {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(selectBoardArgsSchema(), args);

  const board = selectBoard({ ...parsed, ctx: event.context });

  if (!board) {
    throw new Error("Board not found");
  }

  return board;
};

export const selectProtectedBoardServerLoader = async (
  args: Input<ReturnType<typeof selectBoardArgsSchema>>,
) => {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(selectBoardArgsSchema(), args);

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
};

const selectBoardsArgsSchema = () => {
  return object({
    limit: coerce(number([maxValue(20)]), Number),
    offset: coerce(number(), Number),
  });
};

export const selectBoardsServerLoader = async (
  args: Input<ReturnType<typeof selectBoardsArgsSchema>>,
) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(selectBoardsArgsSchema(), args);

  const ctx = getProtectedRequestContext(event);

  return selectBoards({ ...parsed, ctx });
};
