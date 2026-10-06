import superjson from "superjson";
import { nanoid } from "nanoid";
import { publish } from "@floot/realtime";
import { db } from "../../helpers/db";
import { chatSchema } from "./chat_POST.schema";

export async function handle(request: Request): Promise<Response> {
  const json = (data: unknown, status = 200) =>
    new Response(superjson.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const parsed = chatSchema.safeParse(superjson.parse(await request.text()));
    if (!parsed.success) return json({ error: "Invalid transmission payload." }, 400);

    let session = parsed.data.sessionId
      ? await db.sessions.get(parsed.data.sessionId)
      : await db.sessions.getLatest();

    if (!session) {
      session = await db.sessions.create({
        sessionId: parsed.data.sessionId || "sim_" + nanoid(16),
        world: parsed.data.world,
        clintMood: "reflective",
        maicaMood: "warm",
        currentActivity: "Observatory active",
        activeMusic: null,
      });
    }

    const messageId = "msg_" + nanoid(16);
    const now = new Date();

    // Persist user transmission to Supabase
    await db.messages.insert({
      messageId,
      sessionId: session.sessionId,
      speaker: parsed.data.speaker,
      text: parsed.data.message,
      source: "user",
      interactionId: null,
      createdAt: now,
    });

    const nextActivity =
      (parsed.data.speaker === "clint" ? "Clint" : "Maica") + " transmitted a message";

    await db.sessions.update(session.sessionId, {
      updatedAt: now,
      currentActivity: nextActivity,
    });

    const createdMessage = {
      messageId,
      sessionId: session.sessionId,
      speaker: parsed.data.speaker,
      text: parsed.data.message,
      source: "user",
      interactionId: null,
      createdAt: now.toISOString(),
    };

    // Broadcast over realtime so observatory clients update
    await publish("simulation:main", {
      type: "simulation.message",
      sessionId: session.sessionId,
      message: createdMessage,
      currentActivity: nextActivity,
    });

    return json({
      success: true,
      sessionId: session.sessionId,
      message: createdMessage,
    });
  } catch (error) {
    console.error("Transmission persistence failed:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Transmission persistence failed.",
      },
      500
    );
  }
}
