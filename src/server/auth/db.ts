import { eq } from "drizzle-orm";

import type { WithH3EventContext } from "../context";

type InsertUserArgs = WithH3EventContext<{
  hashedPassword: string;
  id: string;
  username: string;
}>;

export const insertUser = (args: InsertUserArgs) => {
  return args.ctx.db
    .insert(args.ctx.schema.user)
    .values({
      id: args.id,
      password: args.hashedPassword,
      username: args.username,
    })
    .run();
};

type SelectUserByUsernameArgs = WithH3EventContext<{
  username: string;
}>;

export const selectUserByUsername = (args: SelectUserByUsernameArgs) => {
  return args.ctx.db
    .select()
    .from(args.ctx.schema.user)
    .where(eq(args.ctx.schema.user.username, args.username))
    .limit(0)
    .all()
    .at(0);
};
