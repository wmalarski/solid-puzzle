import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import { getSession } from "~/server/auth";

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    const { session, user } = await getSession(event);
    return { session, user };
  });
};

export default function BoardSection() {
  const session = useRouteData<typeof routeData>();

  return (
    <SessionProvider value={() => session()}>
      <main class="relative h-screen w-screen">
        <pre>{JSON.stringify(session(), null, 2)}</pre>
        <Board
          board={{ id: "1", title: "Title" }}
          room={{ id: "2", name: "Room" }}
        />
      </main>
    </SessionProvider>
  );
}
