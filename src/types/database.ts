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
          display_name: string | null;
          language_subject: "hindi" | "french";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          language_subject?: "hindi" | "french";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          language_subject?: "hindi" | "french";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          sort_order: number;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          chapter_number: number | null;
          official_textbook_url: string | null;
          sort_order: number;
        };
        Insert: {
          id: string;
          subject_id: string;
          title: string;
          chapter_number?: number | null;
          official_textbook_url?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          subject_id?: string;
          title?: string;
          chapter_number?: number | null;
          official_textbook_url?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          chapter_id: string;
          title: string;
          sort_order: number;
        };
        Insert: {
          id: string;
          chapter_id: string;
          title: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          title?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          item_type: "chapter" | "exercise";
          item_id: string;
          status: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: "chapter" | "exercise";
          item_id: string;
          status?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: "chapter" | "exercise";
          item_id?: string;
          status?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          chapter_id: string;
          content: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chapter_id: string;
          content?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chapter_id?: string;
          content?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          mode: string;
          duration_minutes: number;
          break_minutes: number;
          goal: string | null;
          reflection: string | null;
          completed: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mode: string;
          duration_minutes: number;
          break_minutes: number;
          goal?: string | null;
          reflection?: string | null;
          completed?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mode?: string;
          duration_minutes?: number;
          break_minutes?: number;
          goal?: string | null;
          reflection?: string | null;
          completed?: boolean | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
