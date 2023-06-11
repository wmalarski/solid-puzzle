import { Board } from "~/modules/board/Board/Board";

export default function Home() {
  return (
    <main class="relative h-screen w-screen">
      <Board
        board={{ id: "1", title: "Title" }}
        room={{ id: "2", name: "Room" }}
      />
    </main>
  );
}
