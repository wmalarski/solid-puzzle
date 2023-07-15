import server$, {
  createServerAction$,
  redirect,
  useRequest,
} from "solid-start/server";
import type { z } from "zod";
import { paths } from "~/utils/paths";
import { getProtectedRequestContext, getRequestContext } from "../context";
import { zodFormParse } from "../utils";
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
    const parsed = await zodFormParse({
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
    const parsed = await zodFormParse({
      form,
      schema: updateBoardArgsSchema(),
    });

    const ctx = await getProtectedRequestContext(event);

    return updateBoard({ ...parsed, ctx });
  });
};

export const deleteBoardAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await zodFormParse({
      form,
      schema: deleteBoardArgsSchema(),
    });

    const ctx = await getProtectedRequestContext(event);

    deleteBoard({ ...parsed, ctx });

    throw redirect(paths.home);
  });
};

export const selectBoardQueryKey = (
  args: z.infer<ReturnType<typeof selectBoardArgsSchema>>
) => {
  return ["selectBoard", args] as const;
};

export const selectBoardServerQuery = server$(
  async ([, args]: ReturnType<typeof selectBoardQueryKey>) => {
    const parsed = selectBoardArgsSchema().parse(args);

    const event = useRequest();
    const ctx = await getRequestContext({
      env: event.env || server$.env,
      locals: event.locals || server$.locals,
      request: event.request || server$.request,
    });

    return selectBoard({ ...parsed, ctx });
  }
);

export const selectBoardsKey = (
  args: z.infer<ReturnType<typeof selectBoardsArgsSchema>>
) => {
  return ["selectBoards", args] as const;
};

export const selectBoardsServerQuery = server$(
  async ([, args]: ReturnType<typeof selectBoardsKey>) => {
    const parsed = selectBoardsArgsSchema().parse(args);

    const event = useRequest();
    const ctx = await getProtectedRequestContext({
      env: event.env || server$.env,
      locals: event.locals || server$.locals,
      request: event.request || server$.request,
    });

    return selectBoards({ ...parsed, ctx });
  }
);
