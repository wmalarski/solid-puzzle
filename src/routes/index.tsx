import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getDrizzle } from "~/db/db";
import { Board } from "~/modules/board/Board/Board";

export const routeData = () => {
  return createServerData$((_source, event) => {
    const { drizzle } = getDrizzle();

    console.log(drizzle);

    return { a: 4 };
  });
};

export default function Home() {
  const students = useRouteData<typeof routeData>();

  return (
    <main class="relative h-screen w-screen">
      <pre>{JSON.stringify(students(), null, 2)}</pre>
      <Board
        board={{ id: "1", title: "Title" }}
        room={{ id: "2", name: "Room" }}
      />
    </main>
  );
}
