import { ServerError } from "solid-start/server";
import {
  safeParseAsync,
  type BaseSchema,
  type BaseSchemaAsync,
  type Input,
} from "valibot";

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
    throw new ServerError(JSON.stringify(parsed.issues[0].message));
  }

  return parsed.output;
};
