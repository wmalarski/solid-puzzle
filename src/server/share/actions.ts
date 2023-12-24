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
  issueShareToken,
  setBoardsAccessCookie,
  validateShareToken,
} from "./db";

const BOARD_INVITE_CACHE_NAME = "invite";

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
    env: event.env,
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
  return object({
    boardId: string(),
  });
};

export const generateBoardInviteQueryKey = (
  args: Input<ReturnType<typeof generateBoardInviteArgsSchema>>,
) => {
  return ["generateBoardInvite", args] as const;
};

export const generateBoardInviteServerQuery = cache((boardId: string) => {
  const event = getRequestEventOrThrow();

  const token = issueShareToken({
    boardId,
    env: event.env,
  });

  return { token };
}, BOARD_INVITE_CACHE_NAME);
