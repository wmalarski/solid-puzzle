import { cache } from "@solidjs/router";
import { queryOptions } from "@tanstack/solid-query";
import { generateBoardInviteServerLoader } from "./rpc";

const BOARD_INVITE_CACHE_NAME = "invite";

export const generateBoardInviteLoader = cache(
  generateBoardInviteServerLoader,
  BOARD_INVITE_CACHE_NAME,
);

export const generateBoardInviteQueryOptions = (
  args: Parameters<typeof generateBoardInviteLoader>[0],
) => {
  return queryOptions(() => ({
    queryFn: () => generateBoardInviteLoader(args),
    queryKey: ["generateBoardInvite", args] as const,
  }));
};
