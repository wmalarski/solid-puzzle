import { action, cache, redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import { parseAsync, type Input } from "valibot";
import { paths } from "~/utils/paths";
import { getProtectedRequestContext, getRequestContext } from "../context";
import { getRequestEventOrThrow } from "../utils";
import {
  deleteBoard,
  deleteBoardArgsSchema,
  insertBoard,
  insertBoardArgsSchema,
  selectBoard,
  selectBoardArgsSchema,
  selectBoards,
  selectBoardsArgsSchema,
  updateBoard,
  updateBoardArgsSchema,
} from "./db";

const SELECT_BOARD_CACHE_NAME = "board";
const SELECT_BOARDS_CACHE_NAME = "boards";

export const insertBoardAction = action(async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    insertBoardArgsSchema(),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  const ctx = await getProtectedRequestContext(event);

  const boardId = insertBoard({ ...parsed, ctx });

  throw redirect(paths.board(boardId));
});

export const updateBoardAction = action(async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    updateBoardArgsSchema(),
    decode(form, { numbers: ["rows", "columns"] }),
  );

  const ctx = await getProtectedRequestContext(event);

  return updateBoard({ ...parsed, ctx });
});

export const deleteBoardAction = action(async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(deleteBoardArgsSchema(), decode(form));

  const ctx = await getProtectedRequestContext(event);

  deleteBoard({ ...parsed, ctx });

  throw redirect(paths.home);
});

export const selectBoardServerQuery = cache(
  async (args: Input<ReturnType<typeof selectBoardArgsSchema>>) => {
    const event = getRequestEventOrThrow();
    const parsed = await parseAsync(selectBoardArgsSchema(), args);

    const ctx = await getRequestContext(event);

    return selectBoard({ ...parsed, ctx });
  },
  SELECT_BOARD_CACHE_NAME,
);

export const selectBoardsServerQuery = cache(
  async (args: Input<ReturnType<typeof selectBoardsArgsSchema>>) => {
    const event = getRequestEventOrThrow();
    const parsed = await parseAsync(selectBoardsArgsSchema(), args);

    const ctx = await getProtectedRequestContext(event);

    return selectBoards({ ...parsed, ctx });
  },
  SELECT_BOARDS_CACHE_NAME,
);
