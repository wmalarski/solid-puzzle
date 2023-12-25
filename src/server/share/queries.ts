import { queryOptions } from "@tanstack/solid-query";
import { generateBoardInviteServerQuery } from "./actions";

export const generateBoardInviteQueryOptions = (
  args: Awaited<Parameters<typeof generateBoardInviteServerQuery>[0]>,
) => {
  return queryOptions(() => ({
    queryFn: () => generateBoardInviteServerQuery(args),
    queryKey: ["generateBoardInvite", args] as const,
  }));
};
