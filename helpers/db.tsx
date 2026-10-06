import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import type {
  SimulationSession,
  SimulationMessage,
  SimulationMemory,
  SupabaseSessionRow,
  SupabaseMessageRow,
  SupabaseMemoryRow,
} from "./schema";

// Default seed memories representing Clint & Maica's shared lore
export const defaultMemories: Array<{
  memoryId: string;
  memoryCategory: any;
  title: string;
  description: string;
  keywords: string[];
  createdAt: Date;
}> = [
  {
    memoryId: "mem_narra",
    memoryCategory: "relational_concept",
    title: "NARRA ko diri",
    description:
      "The comfort phrase and shelter promise Clint gives when Maica needs someone steady to listen.",
    keywords: ["narra", "shelter", "listen", "paminaw", "steady", "diri"],
    createdAt: new Date("2024-03-10T10:00:00Z"),
  },
  {
    memoryId: "mem_2nay",
    memoryCategory: "joke_riddle_banter",
    title: "2 Nay = Tunay",
    description:
      "The recurring playful wordplay between Clint and Maica that became their signature inside joke.",
    keywords: ["2 nay", "tunay", "basta", "joke", "banter", "katawa"],
    createdAt: new Date("2024-04-12T14:30:00Z"),
  },
  {
    memoryId: "mem_motorcycle",
    memoryCategory: "foundational_milestone",
    title: "Motorcycle Ride Home After Rain",
    description:
      "Quiet ride home through the cool evening breeze after school hours.",
    keywords: ["motorcycle", "motor", "ride", "hatod", "byahe", "rain", "school"],
    createdAt: new Date("2024-05-18T17:45:00Z"),
  },
  {
    memoryId: "mem_piano_river",
    memoryCategory: "digital_landmark",
    title: "River Flows in You Piano Practice",
    description:
      "Clint playing piano pieces and worship tunes while Maica listens quietly.",
    keywords: ["piano", "river flows", "canon in d", "music", "tukar", "practice"],
    createdAt: new Date("2024-06-01T16:00:00Z"),
  },
  {
    memoryId: "mem_ukulele_thousand",
    memoryCategory: "digital_landmark",
    title: "A Thousand Years on Ukulele",
    description:
      "Maica strumming chords in the afternoon breeze between garden chores.",
    keywords: ["ukulele", "a thousand years", "music", "strum", "garden"],
    createdAt: new Date("2024-06-15T15:20:00Z"),
  },
  {
    memoryId: "mem_chess_board",
    memoryCategory: "relational_concept",
    title: "Late Afternoon Chess & Tactics",
    description:
      "Clint explaining tactical ideas and playful moves while Maica smiles and teases.",
    keywords: ["chess", "checkers", "tactics", "dula", "tudlo"],
    createdAt: new Date("2024-07-02T16:30:00Z"),
  },
  {
    memoryId: "mem_church_quiet",
    memoryCategory: "scriptural_bedrock",
    title: "Quiet Sunday Service & Worship",
    description:
      "Shared moments of peace, worship music, and gratitude at church.",
    keywords: ["church", "worship", "faith", "sunday", "quiet", "service"],
    createdAt: new Date("2024-08-11T11:00:00Z"),
  },
  {
    memoryId: "mem_garden_balay",
    memoryCategory: "family_personal_life",
    title: "Afternoon Watering Plants & Garden",
    description:
      "Maica checking on green plants and orchids at home, sending quick updates and skl.",
    keywords: ["garden", "plants", "balay", "tanom", "water", "skl"],
    createdAt: new Date("2024-08-25T16:15:00Z"),
  },
  {
    memoryId: "mem_coding_project",
    memoryCategory: "foundational_milestone",
    title: "Grade 12 Tech Leadership & Coding",
    description:
      "Clint carrying technical projects, writing C and web systems with pride and dedication.",
    keywords: ["coding", "c programming", "systems", "project", "school", "mathlete"],
    createdAt: new Date("2024-09-05T19:00:00Z"),
  },
  {
    memoryId: "mem_basta_habit",
    memoryCategory: "joke_riddle_banter",
    title: "Basta — The Unspoken Agreement",
    description:
      "Saying 'Basta' whenever words run out but both know exactly what was meant.",
    keywords: ["basta", "wakoy paki", "wakoy labot", "tease"],
    createdAt: new Date("2024-09-18T21:00:00Z"),
  },
  {
    memoryId: "mem_julies_bakery",
    memoryCategory: "foundational_milestone",
    title: "Julie's Bakeshop Tungkop Meeting — May 31, 2026",
    description:
      "The post-church turning point where pity was distinguished from genuine love, affirming that what they had was worth fighting for, followed by kan-on ug gatas and matching profile pictures.",
    keywords: ["julie", "tungkop", "bakeshop", "bakery", "may 31", "gatas", "kan-on", "pity", "love", "profile picture"],
    createdAt: new Date("2026-05-31T12:30:00Z"),
  },
  {
    memoryId: "mem_dalaguete_run",
    memoryCategory: "family_personal_life",
    title: "5:21 AM Dalaguete Vegetable Run with Papa",
    description:
      "Early morning father-and-son motorcycle journey through Osmeña Peak fog to purchase wholesale vegetables; learning resilience and discovering deep empathy for his father's sacrifices.",
    keywords: ["dalaguete", "osmena", "fog", "papa", "utan", "vegetables", "motorcycle", "ride", "training"],
    createdAt: new Date("2024-10-04T05:21:00Z"),
  },
  {
    memoryId: "mem_compound_interest",
    memoryCategory: "relational_concept",
    title: "Compound Interest of Love and Memories",
    description:
      "Maica and Clint's shared understanding that their love, trust, and memories grow exponentially each day like compound interest.",
    keywords: ["compound interest", "growth", "exponential", "tiwala", "pagmamahal", "memories", "future"],
    createdAt: new Date("2024-11-12T20:15:00Z"),
  },
  {
    memoryId: "mem_t9_ciphers",
    memoryCategory: "digital_landmark",
    title: "T9 Keypad Ciphers & Meta AI C Code",
    description:
      "Clint's creative codes: 222-88-8-33 6-66 ('CUTE MO'), 555-666-888-33-999 ('I LOVE YOU'), and bool loveBaAkoniLovey Meta AI tests.",
    keywords: ["cipher", "binary", "t9", "nokia", "cute mo", "meta ai", "c code", "programming"],
    createdAt: new Date("2024-11-28T22:00:00Z"),
  },
  {
    memoryId: "mem_maica_laundry_soup",
    memoryCategory: "family_personal_life",
    title: "Eldest Sister Care & Kamunggay Chicken Soup",
    description:
      "Maica putting younger siblings to sleep in her arms, enduring Zonrox laundry mornings, and lovingly cooking chicken tinola with fresh kamunggay for her mother.",
    keywords: ["laundry", "zonrox", "kamunggay", "tinola", "ate", "siblings", "mama", "caring", "laba"],
    createdAt: new Date("2024-12-05T18:30:00Z"),
  },
  {
    memoryId: "mem_romans_faith",
    memoryCategory: "scriptural_bedrock",
    title: "Romans 8:1 Freedom & Ministry of God",
    description:
      "Clint reassuring Maica through Romans 8:1, dispelling superstitious gossip and standing firm in the one True God.",
    keywords: ["romans", "romans 8:1", "faith", "gaba", "superstition", "god", "minister", "peace"],
    createdAt: new Date("2025-01-14T19:45:00Z"),
  },
  {
    memoryId: "mem_homestead_vision",
    memoryCategory: "future_homestead",
    title: "Countryside Homestead & Stargazing Telescope",
    description:
      "Their shared peaceful future: a cool mountain homestead with automated systems, telescope for stargazing, vegetable garden of tomatoes and eggplants, and domestic warmth.",
    keywords: ["homestead", "countryside", "telescope", "stargazing", "bukid", "garden", "future", "solar"],
    createdAt: new Date("2025-02-20T21:10:00Z"),
  },
  {
    memoryId: "mem_digital_vault",
    memoryCategory: "digital_landmark",
    title: "Memory Case & The Digital Memory Vault",
    description:
      "Clint's web projects including the Canva Mansion, Memory Case web game, 3D Memory Gallery Walk, and Secret Letter portal.",
    keywords: ["memory case", "canva mansion", "gallery walk", "secret letter", "great before", "game", "code"],
    createdAt: new Date("2025-03-01T20:00:00Z"),
  },
];

// Helper mappers between Supabase snake_case rows and application objects
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
    source: row.source ?? "simulation",
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

// Fallback in-memory transient store (only active if Supabase env vars are not set)
const transientSessions = new Map<string, SimulationSession>();
const transientMessages: SimulationMessage[] = [];
let memoriesSeeded = false;

/**
 * Supabase Database Repository:
 * Persistent source of truth for the Ating Universe Simulation.
 */
export const db = {
  sessions: {
    async get(sessionId: string): Promise<SimulationSession | null> {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data, error } = await client
            .from("simulation_sessions")
            .select("*")
            .eq("session_id", sessionId)
            .maybeSingle();
          if (error) {
            console.warn("[Supabase] Error loading session:", error.message);
          } else if (data) {
            return toSession(data as SupabaseSessionRow);
          }
        } catch (err) {
          console.warn("[Supabase] Unexpected error loading session:", err);
        }
      }
      return transientSessions.get(sessionId) ?? null;
    },

    async create(
      input: Partial<SimulationSession> & { sessionId: string }
    ): Promise<SimulationSession> {
      const now = new Date();
      const session: SimulationSession = {
        sessionId: input.sessionId,
        world: input.world ?? "living-room",
        clintMood: input.clintMood ?? "reflective",
        maicaMood: input.maicaMood ?? "warm",
        currentActivity: input.currentActivity ?? "sitting together",
        activeMusic: input.activeMusic ?? null,
        activeEvent: input.activeEvent ?? null,
        eventExpiresAt: input.eventExpiresAt ?? null,
        eventCooldowns: input.eventCooldowns ?? {},
        clintInteractionId: input.clintInteractionId ?? null,
        maicaInteractionId: input.maicaInteractionId ?? null,
        createdAt: input.createdAt ?? now,
        updatedAt: input.updatedAt ?? now,
      };

      const client = getSupabaseClient();
      if (client) {
        try {
          const row: SupabaseSessionRow = {
            session_id: session.sessionId,
            world: session.world,
            clint_mood: session.clintMood,
            maica_mood: session.maicaMood,
            current_activity: session.currentActivity,
            active_music: session.activeMusic,
            active_event: session.activeEvent,
            event_expires_at: session.eventExpiresAt,
            event_cooldowns: session.eventCooldowns,
            clint_interaction_id: session.clintInteractionId,
            maica_interaction_id: session.maicaInteractionId,
            created_at: session.createdAt.toISOString(),
            updated_at: session.updatedAt.toISOString(),
          };

          const { data, error } = await client
            .from("simulation_sessions")
            .upsert(row, { onConflict: "session_id" })
            .select("*")
            .single();

          if (error) {
            console.warn("[Supabase] Error creating session:", error.message);
          } else if (data) {
            return toSession(data as SupabaseSessionRow);
          }
        } catch (err) {
          console.warn("[Supabase] Unexpected error creating session:", err);
        }
      }

      transientSessions.set(session.sessionId, session);
      return session;
    },

    async update(
      sessionId: string,
      updates: Partial<SimulationSession>
    ): Promise<SimulationSession | null> {
      const now = new Date();
      const client = getSupabaseClient();
      if (client) {
        try {
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

          if (error) {
            console.warn("[Supabase] Error updating session:", error.message);
          } else if (data) {
            return toSession(data as SupabaseSessionRow);
          }
        } catch (err) {
          console.warn("[Supabase] Unexpected error updating session:", err);
        }
      }

      const existing = transientSessions.get(sessionId);
      if (existing) {
        Object.assign(existing, updates, { updatedAt: now });
        return existing;
      }
      return null;
    },
  },

  messages: {
    async list(params: {
      sessionId: string;
      before?: string | null;
      limit?: number;
    }): Promise<SimulationMessage[]> {
      const limit = params.limit ?? 50;
      const client = getSupabaseClient();
      if (client) {
        try {
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
          if (error) {
            console.warn("[Supabase] Error listing messages:", error.message);
          } else if (data) {
            return (data as SupabaseMessageRow[]).map(toMessage);
          }
        } catch (err) {
          console.warn("[Supabase] Unexpected error listing messages:", err);
        }
      }

      // Transient in-memory fallback
      let list = transientMessages.filter((m) => m.sessionId === params.sessionId);
      if (params.before) {
        const beforeTime = new Date(params.before).getTime();
        list = list.filter((m) => m.createdAt.getTime() < beforeTime);
      }
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return list.slice(0, limit);
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
      const rawList = Array.isArray(items) ? items : [items];
      if (rawList.length === 0) return;

      const client = getSupabaseClient();
      if (client) {
        try {
          const rows: SupabaseMessageRow[] = rawList.map((item) => ({
            message_id: item.messageId,
            session_id: item.sessionId,
            speaker: item.speaker,
            text: item.text,
            source: item.source ?? "simulation",
            interaction_id: item.interactionId ?? null,
            created_at: (item.createdAt ?? new Date()).toISOString(),
          }));

          const { error } = await client.from("simulation_messages").insert(rows);
          if (error) {
            console.warn("[Supabase] Error inserting messages:", error.message);
          }
        } catch (err) {
          console.warn("[Supabase] Unexpected error inserting messages:", err);
        }
      }

      // Keep transient in-memory sync
      for (const item of rawList) {
        transientMessages.push({
          messageId: item.messageId,
          sessionId: item.sessionId,
          speaker: item.speaker,
          text: item.text,
          source: item.source ?? "simulation",
          interactionId: item.interactionId ?? null,
          createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(),
        });
      }
    },
  },

  memories: {
    async list(): Promise<SimulationMemory[]> {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data, error } = await client
            .from("simulation_memories")
            .select("*")
            .order("created_at", { ascending: true });

          if (error) {
            console.warn("[Supabase] Error listing memories:", error.message);
          } else if (data && data.length > 0) {
            return (data as SupabaseMemoryRow[]).map(toMemory);
          } else if (data && data.length === 0 && !memoriesSeeded) {
            // Seed memories to Supabase
            memoriesSeeded = true;
            await this.seed();
            return defaultMemories.map((m) => ({
              ...m,
              createdAt: m.createdAt,
            }));
          }
        } catch (err) {
          console.warn("[Supabase] Unexpected error listing memories:", err);
        }
      }

      return defaultMemories.map((m) => ({
        ...m,
        createdAt: m.createdAt,
      }));
    },

    async seed(): Promise<void> {
      const client = getSupabaseClient();
      if (!client) return;
      try {
        const rows: SupabaseMemoryRow[] = defaultMemories.map((m) => ({
          memory_id: m.memoryId,
          memory_category: m.memoryCategory,
          title: m.title,
          description: m.description,
          keywords: m.keywords,
          created_at: m.createdAt.toISOString(),
        }));
        await client.from("simulation_memories").upsert(rows, { onConflict: "memory_id" });
      } catch (err) {
        console.warn("[Supabase] Error seeding memories:", err);
      }
    },
  },
};
