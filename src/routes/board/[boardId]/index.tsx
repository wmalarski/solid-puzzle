import { useRouteData } from "solid-start";
import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import { createServerSession } from "~/server/auth";

export const routeData = () => {
  return createServerSession();
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
