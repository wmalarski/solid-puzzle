import { ServerError } from "solid-start/server";
import {
  safeParseAsync,
  type BaseSchema,
  type BaseSchemaAsync,
  type Input,
} from "valibot";

type ZodFormParse<TSchema extends BaseSchema | BaseSchemaAsync> = {
  form: FormData;
  schema: TSchema;
};

export const zodFormParse = async <
  TSchema extends BaseSchema | BaseSchemaAsync,
>({
  form,
  schema,
}: ZodFormParse<TSchema>): Promise<Input<TSchema>> => {
  const entries = Object.fromEntries(form.entries());

  const parsed = await safeParseAsync(schema, entries);

  if (!parsed.success) {
    throw new ServerError(JSON.stringify(parsed.issues[0].message));
  }

  return parsed.output;
};
