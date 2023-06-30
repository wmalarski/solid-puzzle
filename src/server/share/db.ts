import { LuciaTokenError, idToken } from "@lucia-auth/tokens";
import {
  ServerError,
  createCookieSessionStorage,
  type FetchEvent,
} from "solid-start";
import { z } from "zod";
import { getLuciaAuth, getSessionOrThrow } from "../lucia";

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

const boardsKey = "boards";

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
  env: Env;
  request: Request;
  boardId: string;
  name: string;
};

export const setBoardsAccessCookie = async ({
  boardId,
  env,
  name,
  request,
}: SetSessionCookieArgs) => {
  const storage = createStorage(env);

  const boardsSession = await storage.getSession(request.headers.get("Cookie"));

  const current = boardsSession.get(boardsKey);
  const next = [...current, { boardId, name }];
  boardsSession.set(boardsKey, next);

  return storage.commitSession(boardsSession);
};

type DestroyBoardsAccessCookieArgs = {
  env: Env;
  request: Request;
};

export const destroySessionCookie = async ({
  request,
  env,
}: DestroyBoardsAccessCookieArgs) => {
  const storage = createStorage(env);

  const session = await storage.getSession(request.headers.get("Cookie"));

  return storage.destroySession(session);
};

export const getShareTokenHandler = (event: FetchEvent) => {
  const cached = event.locals.shareHandler;
  if (cached) {
    return cached as ReturnType<typeof idToken>;
  }

  const auth = getLuciaAuth(event);

  const handler = idToken(auth, "shareHandler", {
    expiresIn: 60 * 60, // expiration in 1 hour,
  });

  event.locals.shareHandler = handler;

  return handler;
};

export const issueShareToken = async (event: FetchEvent) => {
  const { session } = await getSessionOrThrow(event);
  const handler = getShareTokenHandler(event);

  try {
    const token = await handler.issue(session.userId);
    const tokenValue = token.toString();
    return tokenValue;
  } catch (error) {
    if (error instanceof LuciaTokenError) {
      throw new ServerError(error.message, { status: 400 });
    }
    throw new ServerError("Invalid request", { status: 400 });
  }
};

type ValidateShareTokenArgs = {
  event: FetchEvent;
  token: string;
};

export const validateShareToken = async ({
  event,
  token,
}: ValidateShareTokenArgs) => {
  const handler = getShareTokenHandler(event);

  try {
    const validated = await handler.validate(token);
    return validated;
  } catch (error) {
    return null;
  }
};
