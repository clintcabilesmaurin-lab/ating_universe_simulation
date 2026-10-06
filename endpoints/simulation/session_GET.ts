import superjson from "superjson";
import { nanoid } from "nanoid";
import { db } from "../../helpers/db";
import type { OutputType } from "./session_POST.schema";

export async function handle(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    let session = sessionId
      ? await db.sessions.get(sessionId)
      : await db.sessions.getLatest();

    if (!session) {
      const newId = sessionId || "sim_" + nanoid(16);
      session = await db.sessions.create({
        sessionId: newId,
        world: "living-room",
        clintMood: "reflective",
        maicaMood: "warm",
        currentActivity: "Observatory active · awaiting engine",
        activeMusic: null,
      });
    }

    const requestedLimit = url.searchParams.get("limit");
    const parsedLimit = requestedLimit ? Number(requestedLimit) : 50;
    const limit = Math.min(Math.max(Number.isFinite(parsedLimit) ? parsedLimit : 50, 10), 100);

    const messages = await db.messages.list({
      sessionId: session.sessionId,
      limit,
    });

    const page = [...messages].reverse();

    const output: OutputType = {
      sessionId: session.sessionId,
      world: session.world,
      clintMood: session.clintMood,
      maicaMood: session.maicaMood,
      currentActivity: session.currentActivity,
      activeMusic: session.activeMusic,
      messages: page.map((m) => ({
        messageId: m.messageId,
        speaker: m.speaker,
        text: m.text,
        source: m.source,
        interactionId: m.interactionId,
        createdAt: m.createdAt.toISOString(),
      })),
    };

    return new Response(superjson.stringify(output), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to retrieve simulation session:", error);
    return new Response(
      superjson.stringify({
        error: error instanceof Error ? error.message : "Failed to retrieve simulation session.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
