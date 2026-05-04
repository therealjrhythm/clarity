export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          subscription_tier: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          type: string;
          description: string | null;
          status: Database["public"]["Enums"]["project_status"];
          thumbnail_path: string | null;
          current_design_system_version_id: string | null;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          type: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          thumbnail_path?: string | null;
          current_design_system_version_id?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          name?: string;
          type?: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          thumbnail_path?: string | null;
          current_design_system_version_id?: string | null;
          updated_at?: string;
          archived_at?: string | null;
        };
        Relationships: [];
      };
      usage_ledger: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          event_type: string;
          credits_delta: number;
          model: string | null;
          input_tokens: number | null;
          output_tokens: number | null;
          cost_estimate: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          event_type: string;
          credits_delta?: number;
          model?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          cost_estimate?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          event_type?: string;
          credits_delta?: number;
          model?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          cost_estimate?: number | null;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      project_status:
        | "draft"
        | "briefing"
        | "visual_direction"
        | "palette"
        | "references"
        | "design_system"
        | "generating"
        | "ready"
        | "exported"
        | "archived";
    };
    CompositeTypes: Record<string, never>;
  };
};
