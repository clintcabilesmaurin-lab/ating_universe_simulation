import superjson from "superjson";
import { nanoid } from "nanoid";
import { db } from "../../helpers/db";
import type { OutputType } from "./session_POST.schema";

export async function handle(): Promise<Response> {
  const sessionId = "sim_" + nanoid(16);
  const result = await db.insertInto("simulationSessions").values({
    sessionId,
    world: "living-room",
    clintMood: "reflective",
    maicaMood: "warm",
    currentActivity: "sitting together",
    activeMusic: null,
  }).returningAll().executeTakeFirstOrThrow();

  const output: OutputType = {
    sessionId: result.sessionId,
    world: result.world,
    clintMood: result.clintMood,
    maicaMood: result.maicaMood,
    currentActivity: result.currentActivity,
    activeMusic: result.activeMusic,
    messages: [],
  };

  return new Response(superjson.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
}