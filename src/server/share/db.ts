import jwt from "jsonwebtoken";
import { createCookieSessionStorage, type FetchEvent } from "solid-start";
import { z } from "zod";

const createStorage = (env: Env) => {
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
  return z.object({
    boards: z.array(
      z.object({
        boardId: z.string(),
        username: z.string(),
      })
    ),
  });
};

export type BoardAccess = z.infer<ReturnType<typeof boardsAccessSchema>>;

const boardsKey = "boards";

const getBoardsAccessFromCookie = async (
  event: FetchEvent
): Promise<BoardAccess | null> => {
  const storage = createStorage(event.env);

  const session = await storage.getSession(event.request.headers.get("Cookie"));

  const parsed = boardsAccessSchema().safeParse({
    [boardsKey]: session.get(boardsKey),
  });

  if (parsed.success) {
    return parsed.data;
  }

  return null;
};

export const getBoardsAccess = (
  event: FetchEvent
): Promise<BoardAccess | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cachedBoards = event.locals.boards;

  if (cachedBoards) {
    return cachedBoards as ReturnType<typeof getBoardsAccessFromCookie>;
  }

  const boards = getBoardsAccessFromCookie(event);
  event.locals.boards = boards;

  return boards;
};

type SetSessionCookieArgs = {
  boardId: string;
  event: FetchEvent;
  name: string;
};

export const setBoardsAccessCookie = async ({
  boardId,
  event,
  name,
}: SetSessionCookieArgs) => {
  const boardsAccess = await getBoardsAccessFromCookie(event);
  const next = [...(boardsAccess?.boards || []), { boardId, name }];

  const storage = createStorage(event.env);
  const session = await storage.getSession(event.request.headers.get("Cookie"));
  session.set(boardsKey, next);

  return storage.commitSession(session);
};

type DestroyBoardsAccessCookieArgs = {
  env: Env;
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
  return z.object({
    boardId: z.string(),
  });
};

type IssueShareTokenArgs = {
  boardId: string;
  env: Env;
};

export const issueShareToken = ({ boardId, env }: IssueShareTokenArgs) => {
  return jwt.sign({ boardId }, env.SESSION_SECRET, { expiresIn: "1d" });
};

type ValidateShareTokenArgs = {
  env: Env;
  token: string;
};

export const validateShareToken = ({ env, token }: ValidateShareTokenArgs) => {
  const value = jwt.verify(token, env.SESSION_SECRET);
  const parsed = shareTokenSchema().parse(value);
  return parsed;
};
