import { queryOptions } from "@tanstack/solid-query";
import { generateBoardInviteServerQuery } from "./actions";

export const generateBoardInviteQueryOptions = (boardId: string) => {
  return queryOptions(() => ({
    queryFn: () => generateBoardInviteServerQuery(boardId),
    queryKey: ["generateBoardInvite", boardId] as const,
  }));
};
