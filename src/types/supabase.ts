export type Json =
  | { [key: string]: Json | undefined }
  | Json[]
  | boolean
  | null
  | number
  | string;

export type Database = {
  public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Tables: {
      puzzle: {
        Insert: {
          created_at?: string;
          id?: number;
          is_locked?: boolean | null;
          room_id?: null | string;
          rotation?: null | number;
          x?: null | number;
          y?: null | number;
        };
        Relationships: [
          {
            columns: ["room_id"];
            foreignKeyName: "puzzle_room_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "rooms";
          }
        ];
        Row: {
          created_at: string;
          id: number;
          is_locked: boolean | null;
          room_id: null | string;
          rotation: null | number;
          x: null | number;
          y: null | number;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_locked?: boolean | null;
          room_id?: null | string;
          rotation?: null | number;
          x?: null | number;
          y?: null | number;
        };
      };
      rooms: {
        Insert: {
          config: Json;
          created_at?: string;
          id?: string;
          media: string;
          name: string;
          owner_id?: string;
        };
        Relationships: [
          {
            columns: ["owner_id"];
            foreignKeyName: "rooms_owner_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "users";
          }
        ];
        Row: {
          config: Json;
          created_at: string;
          id: string;
          media: string;
          name: string;
          owner_id: string;
        };
        Update: {
          config?: Json;
          created_at?: string;
          id?: string;
          media?: string;
          name?: string;
          owner_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | { schema: keyof Database }
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"]),
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | { schema: keyof Database }
    | keyof Database["public"]["Tables"],
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | { schema: keyof Database }
    | keyof Database["public"]["Tables"],
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | { schema: keyof Database }
    | keyof Database["public"]["Enums"],
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
