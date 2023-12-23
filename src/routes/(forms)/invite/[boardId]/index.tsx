import { Show } from "solid-js";
import { AcceptInviteForm } from "~/modules/invite/AcceptInviteForm";
import { selectBoard } from "~/server/board/db";
import { getRequestContext } from "~/server/context";
import { paths } from "~/utils/paths";

export const route = {
  load: () => {
    getServerSession();
  },
};

export const routeData = (args: RouteDataArgs) => {
  return createServerData$(
    async ([, boardId], event) => {
      const ctx = await getRequestContext(event);

      const board = selectBoard({ ctx, id: boardId });

      if (!board) {
        throw redirect(paths.notFound);
      }

      return board;
    },
    { key: ["board", args.params.boardId] },
  );
};

export default function InviteSection() {
  const boardResource = useRouteData<typeof routeData>();

  return (
    <Show when={boardResource()}>
      {(board) => <AcceptInviteForm board={board()} />}
    </Show>
  );
}
