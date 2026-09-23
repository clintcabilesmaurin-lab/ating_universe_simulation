import superjson from "superjson";
import { publish } from "@floot/realtime";
import { db } from "../../helpers/db";
import { musicLibrary } from "../../helpers/musicLibrary";
import type { InputType, OutputType } from "./music_POST.schema";

export async function handle(request: Request): Promise<Response> {
  try {
    const input = superjson.parse<InputType>(await request.text());

    if (!input.sessionId || !input.trackId) {
      return new Response(superjson.stringify({ error: "sessionId and trackId are required." }), { status: 400 });
    }

    const track = musicLibrary.find((item) => item.id === input.trackId);
    if (!track) {
      return new Response(superjson.stringify({ error: "Music track not found." }), { status: 404 });
    }

    const session = await db.selectFrom("simulationSessions")
      .select(["sessionId"])
      .where("sessionId", "=", input.sessionId)
      .executeTakeFirst();

    if (!session) {
      return new Response(superjson.stringify({ error: "Simulation session not found." }), { status: 404 });
    }

    const currentActivity = "Listening to " + track.title;
    const interactionId = "music_" + track.id + "_" + Date.now();

    const clintMatch = track.description.match(/\*\*Clint:\*\*\n([\s\S]*?)(?:\n\n|$)/);
    const maicaMatch = track.description.match(/\*\*Maica:\*\*\n([\s\S]*)$/);
    const trackMessages = [
      clintMatch?.[1]?.trim() ? { speaker: "clint" as const, text: clintMatch[1].trim() } : null,
      maicaMatch?.[1]?.trim() ? { speaker: "maica" as const, text: maicaMatch[1].trim() } : null,
    ].filter((item): item is { speaker: "clint" | "maica"; text: string } => Boolean(item));

    const messages = trackMessages.map((message, index) => ({
      messageId: "msg_" + interactionId + "_" + index,
      speaker: message.speaker,
      text: message.text,
      interactionId,
      createdAt: new Date(Date.now() + index),
    }));

    if (messages.length > 0) {
      await db.insertInto("simulationMessages").values(
        messages.map((message) => ({
          messageId: message.messageId,
          sessionId: input.sessionId,
          speaker: message.speaker,
          text: message.text,
          source: "simulation",
          interactionId: message.interactionId,
          createdAt: message.createdAt,
        })),
      ).execute();
    }

    await db.updateTable("simulationSessions")
      .set({
        activeMusic: track.id,
        currentActivity,
        updatedAt: new Date(),
      })
      .where("sessionId", "=", input.sessionId)
      .execute();

    const output: OutputType = {
      sessionId: input.sessionId,
      trackId: track.id,
      currentActivity,
      messages: messages.map((message) => ({
        messageId: message.messageId,
        speaker: message.speaker,
        text: message.text,
        interactionId: message.interactionId,
        createdAt: message.createdAt.toISOString(),
      })),
    };

    await publish("simulation:main", {
      type: "simulation.music",
      ...output,
    });

    return new Response(superjson.stringify(output), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(superjson.stringify({
      error: error instanceof Error ? error.message : "Music selection failed.",
    }), { status: 502 });
  }
}
