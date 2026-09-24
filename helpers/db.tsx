import fs from "node:fs";
import path from "node:path";
import { type Kysely } from "kysely";
import { DB } from "./schema";

// Local persistent database store. No external database or connection strings required.
const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "simulation_store.json");

const defaultMemories = [
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

const sessionStore = new Map<string, any>();
let messageStore: any[] = [];
let memoryStore: any[] = [...defaultMemories];

function initPersistence() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (data.sessions && typeof data.sessions === "object") {
        for (const [k, v] of Object.entries(data.sessions as Record<string, any>)) {
          const sessionVal = (v && typeof v === "object" ? v : {}) as Record<string, any>;
          sessionStore.set(k, {
            ...sessionVal,
            createdAt: sessionVal.createdAt ? new Date(sessionVal.createdAt) : new Date(),
            updatedAt: sessionVal.updatedAt ? new Date(sessionVal.updatedAt) : new Date(),
          });
        }
      }
      if (Array.isArray(data.messages)) {
        messageStore = data.messages.map((m: any) => ({
          ...m,
          createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
        }));
      }
      if (Array.isArray(data.memories) && data.memories.length > 0) {
        memoryStore = data.memories.map((mem: any) => ({
          ...mem,
          createdAt: mem.createdAt ? new Date(mem.createdAt) : new Date(),
        }));
      }
      const existingIds = new Set(memoryStore.map((m) => m.memoryId));
      for (const def of defaultMemories) {
        if (!existingIds.has(def.memoryId)) {
          memoryStore.push(def);
        }
      }
    } else {
      savePersistence();
    }
  } catch (err) {
    console.warn("Could not read persistence file, initializing memory store:", err);
  }
}

let saveTimer: NodeJS.Timeout | null = null;
function savePersistence() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = {
        sessions: Object.fromEntries(sessionStore.entries()),
        messages: messageStore,
        memories: memoryStore,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing to persistent store:", err);
    }
  }, 40);
}

initPersistence();

function createDatabaseDriver() {
  return {
    selectFrom(table: string) {
      const filters: Array<{ field: string; op: string; value: any }> = [];
      let sortField: string | null = null;
      let sortDirection: "asc" | "desc" = "asc";
      let limitCount: number | null = null;

      const queryBuilder: any = {
        selectAll() {
          return queryBuilder;
        },
        select(fields: string[]) {
          return queryBuilder;
        },
        where(field: string, op: string, value: any) {
          filters.push({ field, op, value });
          return queryBuilder;
        },
        orderBy(field: string, direction: "asc" | "desc" = "asc") {
          sortField = field;
          sortDirection = direction;
          return queryBuilder;
        },
        limit(n: number) {
          limitCount = n;
          return queryBuilder;
        },
        $if(condition: boolean, fn: (builder: any) => any) {
          if (condition) fn(queryBuilder);
          return queryBuilder;
        },
        async execute(): Promise<any[]> {
          let rows: any[] = [];
          if (table === "simulationSessions") {
            rows = Array.from(sessionStore.values());
          } else if (table === "simulationMessages") {
            rows = [...messageStore];
          } else if (table === "simulationMemories") {
            rows = [...memoryStore];
          }

          for (const f of filters) {
            rows = rows.filter((r) => {
              if (f.op === "=") return r[f.field] === f.value;
              if (f.op === "<") {
                const val = r[f.field] instanceof Date ? r[f.field].getTime() : new Date(r[f.field]).getTime();
                const target = f.value instanceof Date ? f.value.getTime() : new Date(f.value).getTime();
                return val < target;
              }
              return true;
            });
          }

          if (sortField) {
            rows.sort((a, b) => {
              const valA = a[sortField!] instanceof Date ? a[sortField!].getTime() : a[sortField!];
              const valB = b[sortField!] instanceof Date ? b[sortField!].getTime() : b[sortField!];
              if (valA < valB) return sortDirection === "desc" ? 1 : -1;
              if (valA > valB) return sortDirection === "desc" ? -1 : 1;
              return 0;
            });
          }

          if (limitCount !== null) {
            rows = rows.slice(0, limitCount);
          }

          return rows;
        },
        async executeTakeFirst(): Promise<any | undefined> {
          const res = await queryBuilder.execute();
          return res[0];
        },
      };

      return queryBuilder;
    },

    insertInto(table: string) {
      let insertValues: any = null;

      const insertBuilder: any = {
        values(vals: any) {
          insertValues = vals;
          return insertBuilder;
        },
        returningAll() {
          return insertBuilder;
        },
        returning(fields: string[]) {
          return insertBuilder;
        },
        async execute(): Promise<void> {
          if (table === "simulationMessages") {
            const items = Array.isArray(insertValues) ? insertValues : [insertValues];
            for (const item of items) {
              messageStore.push({
                ...item,
                createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt || Date.now()),
              });
            }
            savePersistence();
          }
        },
        async executeTakeFirst(): Promise<any> {
          if (table === "simulationSessions") {
            const record = {
              sessionId: insertValues.sessionId,
              world: insertValues.world ?? "living-room",
              clintMood: insertValues.clintMood ?? "reflective",
              maicaMood: insertValues.maicaMood ?? "warm",
              currentActivity: insertValues.currentActivity ?? "sitting together",
              activeMusic: insertValues.activeMusic ?? null,
              activeEvent: insertValues.activeEvent ?? null,
              eventExpiresAt: insertValues.eventExpiresAt ?? null,
              eventCooldowns: insertValues.eventCooldowns ?? {},
              clintInteractionId: insertValues.clintInteractionId ?? null,
              maicaInteractionId: insertValues.maicaInteractionId ?? null,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            sessionStore.set(record.sessionId, record);
            savePersistence();
            return record;
          }
          return insertValues;
        },
        async executeTakeFirstOrThrow(): Promise<any> {
          return insertBuilder.executeTakeFirst();
        },
      };

      return insertBuilder;
    },

    updateTable(table: string) {
      let updateValues: any = {};
      const filters: Array<{ field: string; op: string; value: any }> = [];

      const updateBuilder: any = {
        set(vals: any) {
          updateValues = { ...updateValues, ...vals };
          return updateBuilder;
        },
        where(field: string, op: string, value: any) {
          filters.push({ field, op, value });
          return updateBuilder;
        },
        returning(fields: string[]) {
          return updateBuilder;
        },
        async execute(): Promise<void> {
          if (table === "simulationSessions") {
            for (const f of filters) {
              if (f.field === "sessionId" && f.op === "=") {
                const existing = sessionStore.get(f.value);
                if (existing) {
                  Object.assign(existing, updateValues);
                  savePersistence();
                }
              }
            }
          }
        },
        async executeTakeFirst(): Promise<any> {
          if (table === "simulationSessions") {
            for (const f of filters) {
              if (f.field === "sessionId" && f.op === "=") {
                const existing = sessionStore.get(f.value);
                if (existing) {
                  Object.assign(existing, updateValues);
                  savePersistence();
                  return existing;
                }
              }
            }
          }
          return undefined;
        },
      };

      return updateBuilder;
    },
  };
}

export const db: Kysely<DB> = createDatabaseDriver() as unknown as Kysely<DB>;
