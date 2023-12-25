import { createAsync, redirect, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Show, Suspense, type Component } from "solid-js";
import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import { selectBoardServerQuery } from "~/server/board/actions";
import { selectBoardServerQueryOptions } from "~/server/board/queries";
import type { BoardModel } from "~/server/board/types";
import { hasBoardAccessServerQuery } from "~/server/share/actions";
import { type BoardAccess } from "~/server/share/db";
import { getRequestEventOrThrow } from "~/server/utils";
import { paths } from "~/utils/paths";

export const selectProtectedBoardServerQuery = async (id: string) => {
  "use server";

  const [board, access] = await Promise.all([
    selectBoardServerQuery({ id }),
    hasBoardAccessServerQuery(id),
  ]);

  const event = getRequestEventOrThrow();
  const session = event.context.session;

  if (board.ownerId !== session?.userId) {
    throw redirect(paths.notFound);
  }

  return { access, board, session };
};

type BoardQueryProps = {
  boardAccess?: BoardAccess;
  initialBoard?: BoardModel;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const params = useParams();

  const boardQuery = createQuery(() =>
    selectBoardServerQueryOptions({ id: params.boardId }, props.initialBoard)(),
  );

  return (
    <Show when={boardQuery.data}>
      {(board) => <Board board={board()} boardAccess={props.boardAccess} />}
    </Show>
  );
};

export default function BoardSection() {
  const params = useParams();

  const data = createAsync(() =>
    selectProtectedBoardServerQuery(params.boardId),
  );

  return (
    <SessionProvider value={() => data()?.session || null}>
      <main class="relative h-screen w-screen">
        <Suspense>
          <BoardQuery
            boardAccess={data()?.access}
            initialBoard={data()?.board}
          />
        </Suspense>
      </main>
    </SessionProvider>
  );
}
