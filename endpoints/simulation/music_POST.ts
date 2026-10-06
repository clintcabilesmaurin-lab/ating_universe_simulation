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

    let session = await db.sessions.get(input.sessionId);
    const currentActivity = "Listening to " + track.title;

    if (!session) {
      session = await db.sessions.create({
        sessionId: input.sessionId,
        world: "music-room",
        clintMood: "reflective",
        maicaMood: "warm",
        currentActivity,
        activeMusic: track.id,
      });
    } else {
      await db.sessions.update(input.sessionId, {
        activeMusic: track.id,
        currentActivity,
        updatedAt: new Date(),
      });
    }

    const output: OutputType = {
      sessionId: input.sessionId,
      trackId: track.id,
      currentActivity,
    };

    await publish("simulation:main", {
      type: "simulation.music",
      ...output,
    });

    return new Response(superjson.stringify(output), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      superjson.stringify({
        error: error instanceof Error ? error.message : "Music selection failed.",
      }),
      { status: 500 }
    );
  }
}
