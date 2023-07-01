import server$, { createServerAction$, redirect } from "solid-start/server";
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

const generateBoardInviteArgsSchema = () => {
  return z.object({
    boardId: z.string(),
  });
};

export const generateBoardInviteQueryKey = (
  args: z.infer<ReturnType<typeof generateBoardInviteArgsSchema>>
) => {
  return ["generateBoardInvite", args] as const;
};

export const generateBoardInviteServerQuery = server$(
  async ([, args]: ReturnType<typeof generateBoardInviteQueryKey>) => {
    return await Promise.resolve({ token: args.boardId });
    // try {
    //   console.log({ args });

    //   const parsed = generateBoardInviteArgsSchema().parse(args);

    //   console.log({ parsed });

    //   const token = issueShareToken({
    //     boardId: parsed.boardId,
    //     env: server$.env,
    //   });

    //   console.log({ token });
    //   return await Promise.resolve({ token });
    // } catch (error) {
    //   console.log({ error });
    //   return { token: null };
    // }
  }
);
