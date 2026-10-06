import superjson from "superjson";
import { nanoid } from "nanoid";
import { db } from "../../helpers/db";
import type { OutputType } from "./session_POST.schema";

export async function handle(): Promise<Response> {
  try {
    const sessionId = "sim_" + nanoid(16);

    const result = await db.sessions.create({
      sessionId,
      world: "living-room",
      clintMood: "reflective",
      maicaMood: "warm",
      currentActivity: "Observatory active · awaiting engine",
      activeMusic: null,
    });

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
  } catch (error) {
    console.error("Failed to initialize simulation session:", error);
    return new Response(
      superjson.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to initialize simulation session.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
