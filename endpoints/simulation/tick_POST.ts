import superjson from "superjson";
import { nanoid } from "nanoid";
import { publish } from "@floot/realtime";
import { db } from "../../helpers/db";
import { musicLibrary } from "../../helpers/musicLibrary";
import { simulationScriptedAmbientTurn } from "../../helpers/simulationScriptedTurn";
import { generateGeminiAmbientTurn, isGeminiActive } from "../../helpers/geminiSimulation";
import type { InputType, OutputType } from "./tick_POST.schema";

export async function handle(request: Request): Promise<Response> {
  try {
    const input = superjson.parse<InputType>(await request.text());
    if (!input.sessionId) return new Response(superjson.stringify({ error: "sessionId is required." }), { status: 400 });

    const session = await db.selectFrom("simulationSessions").selectAll()
      .where("sessionId", "=", input.sessionId).executeTakeFirst();
    if (!session) return new Response(superjson.stringify({ error: "Simulation session not found." }), { status: 404 });

    const history = await db.selectFrom("simulationMessages").selectAll()
      .where("sessionId", "=", input.sessionId).orderBy("createdAt", "desc").limit(1).execute();
    const lastSpeaker = history[0]?.speaker;

    if (session.world === "music-room" && musicLibrary.length > 0 && (Math.random() < 0.55 || !session.activeMusic)) {
      const candidates = musicLibrary.filter((track) => track.id !== session.activeMusic);
      const track = candidates[Math.floor(Math.random() * candidates.length)] ?? musicLibrary[0];
      const currentActivity = "Listening to " + track.title;
      const interactionId = "music_" + track.id + "_" + Date.now();
      const preferredSpeaker = input.speaker ?? (lastSpeaker === "clint" ? "maica" : "clint");
      const marker = preferredSpeaker === "clint" ? "**Clint:**" : "**Maica:**";
      const fallbackMarker = preferredSpeaker === "clint" ? "**Maica:**" : "**Clint:**";
      const markerMatch = track.description.split(marker)[1]?.split(fallbackMarker)[0]?.trim();
      const reaction = markerMatch || track.description.replace(/\*\*(Clint|Maica):\*\*/g, "").trim();
      const messageId = "msg_" + nanoid(16);
      const createdAt = new Date();

      await db.insertInto("simulationMessages").values({
        messageId,
        sessionId: input.sessionId,
        speaker: preferredSpeaker,
        text: reaction,
        source: "simulation",
        interactionId,
        createdAt,
      }).execute();

      await db.updateTable("simulationSessions")
        .set({
          activeMusic: track.id,
          updatedAt: createdAt,
          currentActivity,
          ...(preferredSpeaker === "clint" ? { clintInteractionId: interactionId } : { maicaInteractionId: interactionId }),
        })
        .where("sessionId", "=", input.sessionId)
        .execute();

      await publish("simulation:main", {
        type: "simulation.music",
        sessionId: input.sessionId,
        trackId: track.id,
        currentActivity,
        messages: [{
          messageId,
          speaker: preferredSpeaker,
          text: reaction,
          source: "simulation",
          interactionId,
          createdAt: createdAt.toISOString(),
        }],
      });

      const output: OutputType = {
        sessionId: input.sessionId,
        message: {
          messageId,
          speaker: preferredSpeaker,
          text: reaction,
          source: "simulation",
          interactionId,
          createdAt: createdAt.toISOString(),
        },
        world: session.world,
        currentActivity,
        nextDelayMs: 45000 + Math.floor(Math.random() * 75000),
      };

      return new Response(superjson.stringify(output), { headers: { "Content-Type": "application/json" } });
    }

    const turn = simulationScriptedAmbientTurn({
      lastSpeaker,
      desiredSpeaker: input.speaker,
      state: {
        activeEvent: session.activeEvent,
        eventExpiresAt: session.eventExpiresAt ? new Date(session.eventExpiresAt) : null,
        eventCooldowns: (session.eventCooldowns as Record<string, string>) ?? {},
      },
    });

    let messageText = turn.text;
    let interactionId = "scripted_" + nanoid(10);
    let source = "simulation";

    if (isGeminiActive() && Math.random() < 0.65) {
      try {
        const activeTrack = session.activeMusic ? musicLibrary.find((m) => m.id === session.activeMusic) : null;
        const geminiTurn = await generateGeminiAmbientTurn({
          speaker: turn.speaker,
          world: session.world,
          currentActivity: session.currentActivity || turn.activity,
          activeMusicTitle: activeTrack?.title,
          activeMusicArtist: activeTrack?.artist,
          recentHistory: history.map((h) => ({ speaker: h.speaker, text: h.text })),
        });
        if (geminiTurn) {
          messageText = geminiTurn;
          interactionId = "gemini_" + nanoid(10);
          source = "gemini";
        }
      } catch (err) {
        console.warn("[Tick Endpoint] Gemini turn failed, using scripted:", err);
      }
    }

    const messageId = "msg_" + nanoid(16);
    const createdAt = new Date();

    await db.insertInto("simulationMessages").values({
      messageId,
      sessionId: input.sessionId,
      speaker: turn.speaker,
      text: messageText,
      source,
      interactionId,
      createdAt,
    }).execute();

    const nextActivity = (turn.speaker === "clint" ? "Clint" : "Maica") + " is speaking · " + turn.activity;

    await db.updateTable("simulationSessions")
      .set({
        updatedAt: createdAt,
        currentActivity: nextActivity,
        activeEvent: turn.nextState.activeEvent,
        eventExpiresAt: turn.nextState.eventExpiresAt,
        eventCooldowns: turn.nextState.eventCooldowns,
        ...(turn.speaker === "clint" ? { clintInteractionId: interactionId } : { maicaInteractionId: interactionId }),
      })
      .where("sessionId", "=", input.sessionId)
      .execute();

    const output: OutputType = {
      sessionId: input.sessionId,
      message: {
        messageId,
        speaker: turn.speaker,
        text: messageText,
        source,
        interactionId,
        createdAt: createdAt.toISOString(),
      },
      world: session.world,
      currentActivity: nextActivity,
      nextDelayMs: turn.nextDelayMs,
    };

    await publish("simulation:main", { type: "simulation.message", ...output });
    return new Response(superjson.stringify(output), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(superjson.stringify({ error: error instanceof Error ? error.message : "Simulation turn failed." }), { status: 502 });
  }
}
