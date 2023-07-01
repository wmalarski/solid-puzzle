import { createServerAction$, redirect } from "solid-start/server";
import { z } from "zod";
import { paths } from "~/utils/paths";
import { zodFormParse } from "../utils";
import { setBoardsAccessCookie, validateShareToken } from "./db";

const acceptBoardInviteArgsSchema = () => {
  return z.object({
    name: z.string().min(3).max(50),
    token: z.string(),
  });
};

export const acceptBoardInviteAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await zodFormParse({
      form,
      schema: acceptBoardInviteArgsSchema(),
    });

    const result = validateShareToken({
      env: event.env,
      token: parsed.token,
    });

    const cookie = await setBoardsAccessCookie({
      boardId: result.boardId,
      env: event.env,
      name: parsed.name,
      request: event.request,
    });

    return redirect(paths.board(result.boardId), {
      headers: { "Set-Cookie": cookie },
    });
  });
};
