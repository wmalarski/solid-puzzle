import { action, cache } from "@solidjs/router";
import { queryOptions } from "@tanstack/solid-query";
import {
  acceptBoardInviteServerAction,
  generateBoardInviteServerLoader,
  hasBoardAccessServerLoader,
} from "./rpc";

const BOARD_INVITE_CACHE_NAME = "invite";
const HAS_BOARD_ACCESS_CACHE_NAME = "has_access";

export const acceptBoardInviteAction = action(
  acceptBoardInviteServerAction,
  "acceptBoardInviteAction",
);

export const generateBoardInviteLoader = cache(
  generateBoardInviteServerLoader,
  BOARD_INVITE_CACHE_NAME,
);

export const hasBoardAccessLoader = cache(
  hasBoardAccessServerLoader,
  HAS_BOARD_ACCESS_CACHE_NAME,
);

export const generateBoardInviteQueryOptions = (
  args: Awaited<Parameters<typeof generateBoardInviteLoader>[0]>,
) => {
  return queryOptions(() => ({
    queryFn: () => generateBoardInviteLoader(args),
    queryKey: ["generateBoardInvite", args] as const,
  }));
};
