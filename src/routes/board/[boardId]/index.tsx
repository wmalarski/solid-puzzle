import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import {
  type Component,
  ErrorBoundary,
  Show,
  Suspense,
  createMemo
} from "solid-js";

import type { GetBoardAccessLoaderReturn } from "~/server/access/client";
import type { SelectBoardLoaderReturn } from "~/server/board/client";
import type { BoardAccess } from "~/types/models";

import { SessionProvider, useSessionContext } from "~/contexts/SessionContext";
import { AcceptInviteForm } from "~/modules/board/AcceptInviteForm";
import { BoardPlaceholder } from "~/modules/board/BoardPlaceholder";
import { ErrorFallback } from "~/modules/common/ErrorFallback";
import { getBoardAccessLoader } from "~/server/access/client";
import { getSessionLoader } from "~/server/auth/client";
import { selectBoardLoader } from "~/server/board/client";
import { randomHexColor } from "~/utils/colors";

const Board = clientOnly(() => import("~/modules/board/Board"));

type BoardQueryProps = {
  boardAccess?: GetBoardAccessLoaderReturn;
  data: SelectBoardLoaderReturn;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const session = useSessionContext();

  const access = createMemo<BoardAccess | null>(() => {
    const cookieAccess = props.boardAccess;
    if (cookieAccess) {
      return cookieAccess;
    }

    const user = session()?.user;
    if (!user) {
      return null;
    }

    return {
      boardId: props.data.board.id,
      playerColor: randomHexColor(),
      playerId: user.id,
      userName: user.email || user.id
    };
  });

  return (
    <Show
      fallback={<AcceptInviteForm board={props.data.board} />}
      when={access()}
    >
      {(access) => <Board {...props.data} boardAccess={access()} />}
    </Show>
  );
};

export const route = {
  load: async ({ params }) => {
    await Promise.all([
      getSessionLoader(),
      getBoardAccessLoader(params.boardId)
    ]);
  }
} satisfies RouteDefinition;

export default function BoardSection() {
  const params = useParams();

  const session = createAsync(() => getSessionLoader());

  const boardAccess = createAsync(() => getBoardAccessLoader(params.boardId));

  const data = createAsync(() => selectBoardLoader(params.boardId));

  return (
    <SessionProvider value={session()}>
      <main class="size-screen relative">
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense fallback={<BoardPlaceholder />}>
            <Show fallback={<BoardPlaceholder />} when={data()}>
              {(data) => (
                <BoardQuery boardAccess={boardAccess()} data={data()} />
              )}
            </Show>
          </Suspense>
        </ErrorBoundary>
      </main>
    </SessionProvider>
  );
}
