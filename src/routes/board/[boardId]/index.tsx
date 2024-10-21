import { createAsync, type RouteDefinition, useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import {
  Component,
  createMemo,
  createSignal,
  ErrorBoundary,
  onMount,
  Show,
  Suspense
} from "solid-js";

import type { GetBoardAccessLoaderReturn } from "~/server/access/client";
import type { BoardAccess } from "~/server/access/rpc";

import { UserProvider, useUserContext } from "~/contexts/UserContext";
import { AcceptInviteForm } from "~/modules/board/AcceptInviteForm";
import { ErrorFallback } from "~/modules/common/ErrorFallback";
import { Head } from "~/modules/common/Head";
import { getBoardAccessLoader } from "~/server/access/client";
import { getUserLoader } from "~/server/auth/client";
import { selectBoardLoader } from "~/server/board/client";

const Board = clientOnly(() => import("~/modules/board/Board"));

type BoardQueryProps = {
  boardAccess?: GetBoardAccessLoaderReturn;
  boardId: string;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(() => {
    setIsMounted(true);
  });

  const user = useUserContext();

  const data = createAsync(() => selectBoardLoader(props.boardId));

  const access = createMemo<BoardAccess | null>(() => {
    const cookieAccess = props.boardAccess;
    if (cookieAccess) {
      return cookieAccess;
    }

    const userUntracked = user();
    const metadata = userUntracked?.user_metadata;
    if (!userUntracked || !metadata?.name || !metadata.color) {
      return null;
    }

    return {
      boardId: props.boardId,
      playerColor: metadata.color,
      playerId: userUntracked.id,
      userName: metadata.name
    };
  });

  return (
    <Show when={data()}>
      <Show
        fallback={<AcceptInviteForm board={data()!.board} />}
        when={access()}
      >
        <Show when={isMounted()}>
          <Board
            board={data()!.board}
            boardAccess={access()!}
            fragments={data()!.fragments}
          />
        </Show>
      </Show>
    </Show>
  );
};

export const route = {
  load: async ({ params }) => {
    await Promise.all([getUserLoader(), getBoardAccessLoader(params.boardId)]);
  }
} satisfies RouteDefinition;

export default function BoardSection() {
  const params = useParams();

  const user = createAsync(() => getUserLoader());

  const boardAccess = createAsync(() => getBoardAccessLoader(params.boardId));

  return (
    <>
      <Head />
      <UserProvider value={user()}>
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense>
            <BoardQuery boardAccess={boardAccess()} boardId={params.boardId} />
          </Suspense>
        </ErrorBoundary>
      </UserProvider>
    </>
  );
}
