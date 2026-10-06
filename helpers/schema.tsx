/**
 * Supabase Data Model & Schema Types for Ating Universe Simulation
 */

export type MemoryCategory =
  | "digital_landmark"
  | "family_personal_life"
  | "foundational_milestone"
  | "joke_riddle_banter"
  | "relational_concept"
  | "scriptural_bedrock"
  | "future_homestead";

export type SimulationSpeaker = "clint" | "maica";
export type Speaker = SimulationSpeaker;

export interface SimulationSession {
  sessionId: string;
  world: string;
  clintMood: string;
  maicaMood: string;
  currentActivity: string;
  activeMusic: string | null;
  activeEvent: string | null;
  eventExpiresAt: string | null;
  eventCooldowns: Record<string, any>;
  clintInteractionId: string | null;
  maicaInteractionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationMessage {
  messageId: string;
  sessionId: string;
  speaker: SimulationSpeaker;
  text: string;
  source: string;
  interactionId: string | null;
  createdAt: Date;
}

export interface SimulationMemory {
  memoryId: string;
  memoryCategory: MemoryCategory;
  title: string;
  description: string;
  keywords: string[];
  createdAt: Date;
}

// Supabase Database Row Types (snake_case in PostgreSQL)
export interface SupabaseSessionRow {
  session_id: string;
  world: string;
  clint_mood: string;
  maica_mood: string;
  current_activity: string;
  active_music: string | null;
  active_event: string | null;
  event_expires_at: string | null;
  event_cooldowns: Record<string, any>;
  clint_interaction_id: string | null;
  maica_interaction_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseMessageRow {
  message_id: string;
  session_id: string;
  speaker: string;
  text: string;
  source: string;
  interaction_id: string | null;
  created_at: string;
}

export interface SupabaseMemoryRow {
  memory_id: string;
  memory_category: string;
  title: string;
  description: string;
  keywords: string[];
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      simulation_sessions: {
        Row: SupabaseSessionRow;
        Insert: Partial<SupabaseSessionRow> & { session_id: string };
        Update: Partial<SupabaseSessionRow>;
      };
      simulation_messages: {
        Row: SupabaseMessageRow;
        Insert: Partial<SupabaseMessageRow> & {
          message_id: string;
          session_id: string;
          speaker: string;
          text: string;
        };
        Update: Partial<SupabaseMessageRow>;
      };
      simulation_memories: {
        Row: SupabaseMemoryRow;
        Insert: Partial<SupabaseMemoryRow> & {
          memory_id: string;
          title: string;
          description: string;
        };
        Update: Partial<SupabaseMemoryRow>;
      };
    };
  };
}

export const MemoryCategoryArrayValues: [MemoryCategory, ...MemoryCategory[]] = [
  "digital_landmark",
  "family_personal_life",
  "foundational_milestone",
  "joke_riddle_banter",
  "relational_concept",
  "scriptural_bedrock",
  "future_homestead",
];

export const SimulationSpeakerArrayValues: [SimulationSpeaker, ...SimulationSpeaker[]] = [
  "clint",
  "maica",
];
