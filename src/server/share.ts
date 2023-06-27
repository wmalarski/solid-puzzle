import { LuciaTokenError, idToken } from "@lucia-auth/tokens";
import { ServerError, type FetchEvent } from "solid-start";
import { getLuciaAuth, getSessionOrThrow } from "./lucia";

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
