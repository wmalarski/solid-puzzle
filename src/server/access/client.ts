import { action, cache } from "@solidjs/router";

import { BOARDS_ACCESS_CACHE_KEY } from "./const";
import { getBoardAccessServerLoader, setBoardAccessServerAction } from "./rpc";

export const setBoardAccessAction = action(
  setBoardAccessServerAction,
  "setBoardAccessAction"
);

export const getBoardAccessLoader = cache(
  getBoardAccessServerLoader,
  BOARDS_ACCESS_CACHE_KEY
);

export type GetBoardAccessLoaderReturn = Awaited<
  ReturnType<typeof getBoardAccessLoader>
>;
