import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getDrizzle } from "~/db/db";
import { user } from "~/db/schema";
import { Board } from "~/modules/board/Board/Board";

export const routeData = () => {
  return createServerData$((_source, event) => {
    console.log("board");
    const { drizzle } = getDrizzle(event);

    const result = drizzle.select().from(user).run();

    console.log({ drizzle, result });

    return { a: 4 };
  });
};

export default function BoardSection() {
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