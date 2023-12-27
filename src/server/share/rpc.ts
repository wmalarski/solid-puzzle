"use server";
import { redirect } from "@solidjs/router";
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

const acceptBoardInviteArgsSchema = () => {
  return object({
    name: string([minLength(3), maxLength(50)]),
    token: string(),
  });
};

export const acceptBoardInviteServerAction = async (formData: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    acceptBoardInviteArgsSchema(),
    decode(formData),
  );

  const result = await validateShareToken({
    env: event.context.env,
    token: parsed.token,
  });

  await setBoardsAccessCookie({
    boardId: result.boardId,
    event,
    name: parsed.name,
  });

  return redirect(paths.board(result.boardId));
};

const generateBoardInviteArgsSchema = () => {
  return object({ id: string() });
};

export const generateBoardInviteServerLoader = async (
  args: Input<ReturnType<typeof generateBoardInviteArgsSchema>>,
) => {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(generateBoardInviteArgsSchema(), args);

  const token = issueShareToken({
    boardId: parsed.id,
    env: event.context.env,
  });

  return { token };
};

const hasBoardAccessArgsSchema = () => {
  return object({ id: string() });
};

export const hasBoardAccessServerLoader = async (
  args: Input<ReturnType<typeof hasBoardAccessArgsSchema>>,
) => {
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
};
