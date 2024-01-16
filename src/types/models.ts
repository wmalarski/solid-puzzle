import type { Database } from "~/types/supabase";

export type BoardModel = Database["public"]["Tables"]["rooms"]["Row"];

export type BoardAccess = {
  boardId: string;
  playerColor: string;
  playerId: string;
  userName: string;
};
