import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { AcceptInviteForm } from "~/modules/invite/AcceptInviteForm";
import { selectBoardLoader } from "~/server/board/client";

export const route = {
  load: async (context) => {
    await selectBoardLoader({ id: context.params.boardId });
  },
} satisfies RouteDefinition;

export default function InviteSection() {
  const params = useParams();

  const boardResource = createAsync(() =>
    selectBoardLoader({ id: params.boardId }),
  );

  return (
    <Show when={boardResource()}>
      {(board) => <AcceptInviteForm board={board()} />}
    </Show>
  );
}
