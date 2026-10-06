import { getSupabaseClient } from "./supabase";
import type {
  SimulationSession,
  SimulationMessage,
  SimulationMemory,
  SupabaseSessionRow,
  SupabaseMessageRow,
  SupabaseMemoryRow,
} from "./schema";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      "[Supabase] Database client unavailable. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) are configured."
    );
  }
  return client;
}

function toSession(row: SupabaseSessionRow): SimulationSession {
  return {
    sessionId: row.session_id,
    world: row.world ?? "living-room",
    clintMood: row.clint_mood ?? "reflective",
    maicaMood: row.maica_mood ?? "warm",
    currentActivity: row.current_activity ?? "sitting together",
    activeMusic: row.active_music,
    activeEvent: row.active_event,
    eventExpiresAt: row.event_expires_at,
    eventCooldowns: row.event_cooldowns ?? {},
    clintInteractionId: row.clint_interaction_id,
    maicaInteractionId: row.maica_interaction_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function toMessage(row: SupabaseMessageRow): SimulationMessage {
  return {
    messageId: row.message_id,
    sessionId: row.session_id,
    speaker: (row.speaker as "clint" | "maica") ?? "clint",
    text: row.text,
    source: row.source ?? "user",
    interactionId: row.interaction_id,
    createdAt: new Date(row.created_at),
  };
}

function toMemory(row: SupabaseMemoryRow): SimulationMemory {
  return {
    memoryId: row.memory_id,
    memoryCategory: row.memory_category as any,
    title: row.title,
    description: row.description,
    keywords: row.keywords ?? [],
    createdAt: new Date(row.created_at),
  };
}

/**
 * Thin Supabase Data Access Layer:
 * Direct connection to Supabase tables. No local/in-memory fallback persistence.
 */
export const db = {
  sessions: {
    async get(sessionId: string): Promise<SimulationSession | null> {
      const client = requireClient();
      const { data, error } = await client
        .from("simulation_sessions")
        .select("*")
        .eq("session_id", sessionId)
        .maybeSingle();
      if (error) throw error;
      return data ? toSession(data as SupabaseSessionRow) : null;
    },

    async getLatest(): Promise<SimulationSession | null> {
      const client = requireClient();
      const { data, error } = await client
        .from("simulation_sessions")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ? toSession(data as SupabaseSessionRow) : null;
    },

    async create(
      input: Partial<SimulationSession> & { sessionId: string }
    ): Promise<SimulationSession> {
      const client = requireClient();
      const now = new Date();
      const row: SupabaseSessionRow = {
        session_id: input.sessionId,
        world: input.world ?? "living-room",
        clint_mood: input.clintMood ?? "reflective",
        maica_mood: input.maicaMood ?? "warm",
        current_activity: input.currentActivity ?? "Observatory active",
        active_music: input.activeMusic ?? null,
        active_event: input.activeEvent ?? null,
        event_expires_at: input.eventExpiresAt ?? null,
        event_cooldowns: input.eventCooldowns ?? {},
        clint_interaction_id: input.clintInteractionId ?? null,
        maica_interaction_id: input.maicaInteractionId ?? null,
        created_at: (input.createdAt ?? now).toISOString(),
        updated_at: (input.updatedAt ?? now).toISOString(),
      };

      const { data, error } = await client
        .from("simulation_sessions")
        .upsert(row, { onConflict: "session_id" })
        .select("*")
        .single();
      if (error) throw error;
      return toSession(data as SupabaseSessionRow);
    },

    async update(
      sessionId: string,
      updates: Partial<SimulationSession>
    ): Promise<SimulationSession | null> {
      const client = requireClient();
      const now = new Date();
      const rowUpdates: Partial<SupabaseSessionRow> = {
        updated_at: now.toISOString(),
      };
      if (updates.world !== undefined) rowUpdates.world = updates.world;
      if (updates.clintMood !== undefined) rowUpdates.clint_mood = updates.clintMood;
      if (updates.maicaMood !== undefined) rowUpdates.maica_mood = updates.maicaMood;
      if (updates.currentActivity !== undefined)
        rowUpdates.current_activity = updates.currentActivity;
      if (updates.activeMusic !== undefined) rowUpdates.active_music = updates.activeMusic;
      if (updates.activeEvent !== undefined) rowUpdates.active_event = updates.activeEvent;
      if (updates.eventExpiresAt !== undefined)
        rowUpdates.event_expires_at = updates.eventExpiresAt;
      if (updates.eventCooldowns !== undefined)
        rowUpdates.event_cooldowns = updates.eventCooldowns;
      if (updates.clintInteractionId !== undefined)
        rowUpdates.clint_interaction_id = updates.clintInteractionId;
      if (updates.maicaInteractionId !== undefined)
        rowUpdates.maica_interaction_id = updates.maicaInteractionId;

      const { data, error } = await client
        .from("simulation_sessions")
        .update(rowUpdates)
        .eq("session_id", sessionId)
        .select("*")
        .single();
      if (error) throw error;
      return toSession(data as SupabaseSessionRow);
    },
  },

  messages: {
    async list(params: {
      sessionId: string;
      before?: string | null;
      limit?: number;
    }): Promise<SimulationMessage[]> {
      const client = requireClient();
      const limit = params.limit ?? 50;
      let query = client
        .from("simulation_messages")
        .select("*")
        .eq("session_id", params.sessionId)
        .order("created_at", { ascending: false });

      if (params.before) {
        query = query.lt("created_at", params.before);
      }
      query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data as SupabaseMessageRow[]).map(toMessage);
    },

    async insert(
      items:
        | Array<{
            messageId: string;
            sessionId: string;
            speaker: "clint" | "maica";
            text: string;
            source?: string;
            interactionId?: string | null;
            createdAt?: Date;
          }>
        | {
            messageId: string;
            sessionId: string;
            speaker: "clint" | "maica";
            text: string;
            source?: string;
            interactionId?: string | null;
            createdAt?: Date;
          }
    ): Promise<void> {
      const client = requireClient();
      const rawList = Array.isArray(items) ? items : [items];
      if (rawList.length === 0) return;

      const rows: SupabaseMessageRow[] = rawList.map((item) => ({
        message_id: item.messageId,
        session_id: item.sessionId,
        speaker: item.speaker,
        text: item.text,
        source: item.source ?? "user",
        interaction_id: item.interactionId ?? null,
        created_at: (item.createdAt ?? new Date()).toISOString(),
      }));

      const { error } = await client.from("simulation_messages").insert(rows);
      if (error) throw error;
    },
  },

  memories: {
    async list(): Promise<SimulationMemory[]> {
      const client = requireClient();
      const { data, error } = await client
        .from("simulation_memories")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as SupabaseMemoryRow[]).map(toMemory);
    },
  },
};
