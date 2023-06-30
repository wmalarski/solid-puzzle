import { ServerError, createServerAction$ } from "solid-start/server";
import { z } from "zod";
import { zodFormParse } from "../utils";
import { validateShareToken } from "./db";

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

    const result = await validateShareToken({
      event,
      token: parsed.token,
    });

    if (!result) {
      throw new ServerError("Invalid token", { status: 400 });
    }
  });
};
