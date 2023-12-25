import jwt from "jsonwebtoken";
import type { RequestEvent } from "solid-js/web";
import {
  array,
  object,
  parseAsync,
  safeParseAsync,
  string,
  type Input,
} from "valibot";
import type { ServerEnv } from "../env";

const createStorage = (env: ServerEnv) => {
  return createCookieSessionStorage({
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      name: "boards",
      path: "/",
      sameSite: "lax",
      secrets: [env.SESSION_SECRET],
      secure: true,
    },
  });
};

const boardsAccessSchema = () => {
  return object({
    boards: array(
      object({
        boardId: string(),
        username: string(),
      }),
    ),
  });
};

export type BoardsAccess = Input<ReturnType<typeof boardsAccessSchema>>;
export type BoardAccess = BoardsAccess["boards"][0];

const boardsKey = "boards";

const getBoardsAccessFromCookie = async (
  event: RequestEvent,
): Promise<BoardsAccess | null> => {
  const storage = createStorage(event.context.env);

  const session = await storage.getSession(event.request.headers.get("Cookie"));

  const parsed = await safeParseAsync(boardsAccessSchema(), {
    [boardsKey]: session.get(boardsKey),
  });

  if (parsed.success) {
    return parsed.output;
  }

  return null;
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

  return boardAccesses?.boards.find((board) => board.boardId === boardId);
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
  const next = [...(boardsAccess?.boards || []), { boardId, name }];

  const storage = createStorage(event.context.env);
  const session = await storage.getSession(event.request.headers.get("Cookie"));
  session.set(boardsKey, next);

  return storage.commitSession(session);
};

type DestroyBoardsAccessCookieArgs = {
  env: ServerEnv;
  request: Request;
};

export const destroyBoardsAccessCookie = async ({
  request,
  env,
}: DestroyBoardsAccessCookieArgs) => {
  const storage = createStorage(env);

  const session = await storage.getSession(request.headers.get("Cookie"));

  return storage.destroySession(session);
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
  const parsed = await parseAsync(shareTokenSchema(), value);
  return parsed;
};
