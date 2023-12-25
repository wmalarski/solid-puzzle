"use server";
import { action, cache, redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import {
  maxLength,
  minLength,
  object,
  parseAsync,
  string,
  type Input,
} from "valibot";
import { paths } from "~/utils/paths";
import { getRequestEventOrThrow } from "../utils";
import {
  hasBoardAccess,
  issueShareToken,
  setBoardsAccessCookie,
  validateShareToken,
} from "./db";

const BOARD_INVITE_CACHE_NAME = "invite";
const HAS_BOARD_ACCESS_CACHE_NAME = "has_access";

const acceptBoardInviteArgsSchema = () => {
  return object({
    name: string([minLength(3), maxLength(50)]),
    token: string(),
  });
};

export const acceptBoardInviteAction = action(async (formData: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    acceptBoardInviteArgsSchema(),
    decode(formData),
  );

  const result = await validateShareToken({
    env: event.context.env,
    token: parsed.token,
  });

  const cookie = await setBoardsAccessCookie({
    boardId: result.boardId,
    event,
    name: parsed.name,
  });

  return redirect(paths.board(result.boardId), {
    headers: { "Set-Cookie": cookie },
  });
});

const generateBoardInviteArgsSchema = () => {
  return object({ id: string() });
};

export const generateBoardInviteServerQuery = cache(
  async (args: Input<ReturnType<typeof generateBoardInviteArgsSchema>>) => {
    const event = getRequestEventOrThrow();
    const parsed = await parseAsync(generateBoardInviteArgsSchema(), args);

    const token = issueShareToken({
      boardId: parsed.id,
      env: event.context.env,
    });

    return { token };
  },
  BOARD_INVITE_CACHE_NAME,
);

const hasBoardAccessArgsSchema = () => {
  return object({ id: string() });
};

export const hasBoardAccessServerQuery = cache(
  async (args: Input<ReturnType<typeof hasBoardAccessArgsSchema>>) => {
    const event = getRequestEventOrThrow();
    const parsed = await parseAsync(hasBoardAccessArgsSchema(), args);

    const access = hasBoardAccess({
      boardId: parsed.id,
      event,
    });

    if (!access) {
      throw redirect(paths.notFound);
    }

    return access;
  },
  HAS_BOARD_ACCESS_CACHE_NAME,
);
