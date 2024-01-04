"use server";
import { decode } from "decode-formdata";
import { maxLength, minLength, object, safeParseAsync, string } from "valibot";
import { issuesToRpcResponse, rpcParseIssueError } from "../types";
import { getRequestEventOrThrow } from "../utils";
import {
  issueShareToken,
  setBoardsAccessCookie,
  validateShareToken,
} from "./db";

export async function acceptBoardInviteServerAction(formData: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      name: string([minLength(3), maxLength(50)]),
      token: string(),
    }),
    decode(formData),
  );

  if (!parsed.success) {
    return issuesToRpcResponse(parsed.issues);
  }

  const result = await validateShareToken({
    env: event.context.env,
    token: parsed.output.token,
  });

  if (!result.success) {
    return issuesToRpcResponse(result.issues);
  }

  await setBoardsAccessCookie({
    boardId: result.output.boardId,
    event,
    name: parsed.output.name,
  });

  return true;
}

type GenerateBoardInviteServerLoaderArgs = {
  id: string;
};

export async function generateBoardInviteServerLoader(
  args: GenerateBoardInviteServerLoaderArgs,
) {
  const event = getRequestEventOrThrow();
  const parsed = await safeParseAsync(object({ id: string() }), args);

  if (!parsed.success) {
    throw rpcParseIssueError(parsed.issues);
  }

  const token = issueShareToken({
    boardId: parsed.output.id,
    env: event.context.env,
  });

  return { token };
}
