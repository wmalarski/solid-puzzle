import server$, { createServerAction$, redirect } from "solid-start/server";
import { parseAsync, type Input } from "valibot";
import { paths } from "~/utils/paths";
import { getProtectedRequestContext, getRequestContext } from "../context";
import { formParse } from "../utils";
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

export const insertBoardAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await formParse({
      form,
      schema: insertBoardArgsSchema(),
    });

    const ctx = await getProtectedRequestContext(event);

    const boardId = insertBoard({ ...parsed, ctx });

    throw redirect(paths.board(boardId));
  });
};

export const updateBoardAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await formParse({
      form,
      schema: updateBoardArgsSchema(),
    });

    const ctx = await getProtectedRequestContext(event);

    return updateBoard({ ...parsed, ctx });
  });
};

export const deleteBoardAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await formParse({
      form,
      schema: deleteBoardArgsSchema(),
    });

    const ctx = await getProtectedRequestContext(event);

    deleteBoard({ ...parsed, ctx });

    throw redirect(paths.home);
  });
};

export const selectBoardQueryKey = (
  args: Input<ReturnType<typeof selectBoardArgsSchema>>,
) => {
  return ["selectBoard", args] as const;
};

export const selectBoardServerQuery = server$(
  async ([, args]: ReturnType<typeof selectBoardQueryKey>) => {
    const parsed = await parseAsync(selectBoardArgsSchema(), args);

    const event = {
      clientAddress: server$.clientAddress,
      env: server$.env,
      fetch: server$.fetch,
      locals: server$.locals,
      request: server$.request,
    };

    const ctx = await getRequestContext(event);

    return selectBoard({ ...parsed, ctx });
  },
);

export const selectBoardsKey = (
  args: Input<ReturnType<typeof selectBoardsArgsSchema>>,
) => {
  return ["selectBoards", args] as const;
};

export const selectBoardsServerQuery = server$(
  async ([, args]: ReturnType<typeof selectBoardsKey>) => {
    const parsed = await parseAsync(selectBoardsArgsSchema(), args);

    const event = {
      clientAddress: server$.clientAddress,
      env: server$.env,
      fetch: server$.fetch,
      locals: server$.locals,
      request: server$.request,
    };

    const ctx = await getProtectedRequestContext(event);

    return selectBoards({ ...parsed, ctx });
  },
);
