import { Show } from "solid-js";
import { useRouteData, type RouteDataArgs } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { FormLayout, PageFooter, PageTitle } from "~/modules/common/Layout";
import { AcceptInviteForm } from "~/modules/invite/AcceptInviteForm";
import { selectBoard } from "~/server/board/db";
import { getRequestContext } from "~/server/context";
import { paths } from "~/utils/paths";

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
    { key: ["board", args.params.boardId] }
  );
};

export default function InviteSection() {
  const boardResource = useRouteData<typeof routeData>();

  return (
    <FormLayout>
      <PageTitle />
      <Show when={boardResource()}>
        {(board) => <AcceptInviteForm board={board()} />}
      </Show>
      <PageFooter />
    </FormLayout>
  );
}
