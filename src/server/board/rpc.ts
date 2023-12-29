"use server";
import { redirect } from "@solidjs/router";
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
import { paths } from "~/utils/paths";
import { getProtectedRequestContext } from "../context";
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
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    insertBoardArgsSchema(),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  const ctx = getProtectedRequestContext(event);

  const boardId = insertBoard({ ...parsed, ctx });

  throw redirect(paths.board(boardId));
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

  throw redirect(paths.home);
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
    throw redirect(paths.notFound);
  }

  return board;
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

  console.log("selectBoardsServerLoader", args);

  const parsed = await parseAsync(selectBoardsArgsSchema(), args);

  const ctx = getProtectedRequestContext(event);

  return selectBoards({ ...parsed, ctx });
};
