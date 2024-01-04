import { deleteCookie, getCookie, setCookie } from "@solidjs/start/server";
import jwt from "jsonwebtoken";
import type { RequestEvent } from "solid-js/web";
import { array, object, safeParseAsync, string, type Output } from "valibot";
import type { ServerEnv } from "../env";

const options = (env: ServerEnv) => {
  return {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: true,
  } as const;
};

const boardsAccessSchema = () => {
  return array(
    object({
      boardId: string(),
      username: string(),
    }),
  );
};

export type BoardsAccess = Output<ReturnType<typeof boardsAccessSchema>>;
export type BoardAccess = BoardsAccess[0];

const boardsKey = "boards";

const getBoardsAccessFromCookie = async (
  event: RequestEvent,
): Promise<BoardsAccess | null> => {
  const value = getCookie(event, boardsKey);

  if (!value) {
    return null;
  }

  const parsed = await safeParseAsync(boardsAccessSchema(), JSON.parse(value));

  if (!parsed.success) {
    return null;
  }

  return parsed.output;
};

export const getBoardsAccess = (
  event: RequestEvent,
): Promise<BoardsAccess | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cachedBoards = event.locals.boards;

  if (cachedBoards) {
    return cachedBoards as ReturnType<typeof getBoardsAccessFromCookie>;
  }

  const boards = getBoardsAccessFromCookie(event);
  event.locals.boards = boards;

  return boards;
};

type HasBoardAccessArgs = {
  event: RequestEvent;
  boardId: string;
};

export const hasBoardAccess = async ({
  event,
  boardId,
}: HasBoardAccessArgs): Promise<BoardAccess | undefined> => {
  const boardAccesses = await getBoardsAccess(event);

  return boardAccesses?.find((board) => board.boardId === boardId);
};

type SetSessionCookieArgs = {
  boardId: string;
  event: RequestEvent;
  name: string;
};

export const setBoardsAccessCookie = async ({
  boardId,
  event,
  name,
}: SetSessionCookieArgs) => {
  const boardsAccess = await getBoardsAccessFromCookie(event);
  const next = [...(boardsAccess || []), { boardId, name }];
  event.locals.boards = next;
  setCookie(event, boardsKey, JSON.stringify(next), options(event.context.env));
};

type DestroyBoardsAccessCookieArgs = {
  event: RequestEvent;
};

export const destroyBoardsAccessCookie = ({
  event,
}: DestroyBoardsAccessCookieArgs) => {
  deleteCookie(event, boardsKey, options(event.context.env));
};

const shareTokenSchema = () => {
  return object({
    boardId: string(),
  });
};

type IssueShareTokenArgs = {
  boardId: string;
  env: ServerEnv;
};

export const issueShareToken = ({ boardId, env }: IssueShareTokenArgs) => {
  return jwt.sign({ boardId }, env.SESSION_SECRET, { expiresIn: "1d" });
};

type ValidateShareTokenArgs = {
  env: ServerEnv;
  token: string;
};

export const validateShareToken = async ({
  env,
  token,
}: ValidateShareTokenArgs) => {
  const value = jwt.verify(token, env.SESSION_SECRET);
  const parsed = await safeParseAsync(shareTokenSchema(), value);
  return parsed;
};
