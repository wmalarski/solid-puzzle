import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { AcceptInviteForm } from "~/modules/invite/AcceptInviteForm";
import { selectBoardServerLoader } from "~/server/board/actions";

export const route = {
  load: async (context) => {
    await selectBoardServerLoader({ id: context.params.boardId });
  },
} satisfies RouteDefinition;

export default function InviteSection() {
  const params = useParams();

  const boardResource = createAsync(() =>
    selectBoardServerLoader({ id: params.boardId }),
  );

  return (
    <Show when={boardResource()}>
      {(board) => <AcceptInviteForm board={board()} />}
    </Show>
  );
}
