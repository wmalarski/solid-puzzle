import type { Database } from "~/types/supabase";

export type BoardModel = Database["public"]["Tables"]["rooms"]["Row"];
