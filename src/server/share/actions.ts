import server$, { createServerAction$, redirect } from "solid-start/server";
import {
  maxLength,
  minLength,
  object,
  parseAsync,
  string,
  type Input,
} from "valibot";
import { paths } from "~/utils/paths";
import { formParse } from "../utils";
import {
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

export const acceptBoardInviteAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await formParse({
      form,
      schema: acceptBoardInviteArgsSchema(),
    });

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
};

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

export const generateBoardInviteServerQuery = server$(
  async ([, args]: ReturnType<typeof generateBoardInviteQueryKey>) => {
    const parsed = await parseAsync(generateBoardInviteArgsSchema(), args);

    const token = issueShareToken({
      boardId: parsed.boardId,
      env: server$.env,
    });

    return { token };
  },
);
