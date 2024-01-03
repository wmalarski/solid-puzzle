"use server";
import { decode } from "decode-formdata";
import { maxLength, minLength, object, parseAsync, string } from "valibot";
import { getRequestEventOrThrow } from "../utils";
import {
  issueShareToken,
  setBoardsAccessCookie,
  validateShareToken,
} from "./db";

export const acceptBoardInviteServerAction = async (formData: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await parseAsync(
    object({
      name: string([minLength(3), maxLength(50)]),
      token: string(),
    }),
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

  return true;
};

type GenerateBoardInviteServerLoaderArgs = {
  id: string;
};

export const generateBoardInviteServerLoader = async (
  args: GenerateBoardInviteServerLoaderArgs,
) => {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(object({ id: string() }), args);

  const token = issueShareToken({
    boardId: parsed.id,
    env: event.context.env,
  });

  return { token };
};
