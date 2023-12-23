import { redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import {
  safeParseAsync,
  type BaseSchema,
  type BaseSchemaAsync,
  type Input,
} from "valibot";
import { paths } from "~/utils/paths";

type FormParse<TSchema extends BaseSchema | BaseSchemaAsync> = {
  form: FormData;
  schema: TSchema;
};

export const formParse = async <TSchema extends BaseSchema | BaseSchemaAsync>({
  form,
  schema,
}: FormParse<TSchema>): Promise<Input<TSchema>> => {
  const entries = Object.fromEntries(form.entries());

  const parsed = await safeParseAsync(schema, entries);

  if (!parsed.success) {
    throw new Error(JSON.stringify(parsed.issues[0].message));
  }

  return parsed.output;
};

export const getRequestEventOrThrow = () => {
  const event = getRequestEvent();

  if (!event) {
    throw redirect(paths.notFound);
  }

  return event;
};
