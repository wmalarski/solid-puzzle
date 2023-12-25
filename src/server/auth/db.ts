"use server";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import type { WithH3EventContext } from "../context";

type InsertUserArgs = WithH3EventContext<{
  hashedPassword: string;
  username: string;
}>;

export const insertUser = (args: InsertUserArgs) => {
  const userId = generateId(15);

  return args.ctx.db.insert(args.ctx.schema.user).values({
    id: userId,
    password: args.hashedPassword,
    username: args.username,
  });
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
