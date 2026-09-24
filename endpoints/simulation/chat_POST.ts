import superjson from "superjson";
import { nanoid } from "nanoid";
import { publish } from "@floot/realtime";
import { db } from "../../helpers/db";
import { simulationScriptedChatReply } from "../../helpers/simulationScriptedTurn";
import { simulationMemoryRetriever } from "../../helpers/simulationMemoryRetriever";
import { generateGeminiChatReply, isGeminiActive } from "../../helpers/geminiSimulation";
import { chatSchema } from "./chat_POST.schema";

export async function handle(request: Request): Promise<Response> {
  const json = (data: unknown, status = 200) =>
    new Response(superjson.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const parsed = chatSchema.safeParse(superjson.parse(await request.text()));
    if (!parsed.success) return json({ error: "Invalid simulation payload." }, 400);

    let session = parsed.data.sessionId
      ? await db.selectFrom("simulationSessions")
          .selectAll()
          .where("sessionId", "=", parsed.data.sessionId)
          .executeTakeFirst()
      : undefined;

    if (!session) {
      session = await db
        .insertInto("simulationSessions")
        .values({
          sessionId: "sim_" + nanoid(16),
          world: parsed.data.world,
          clintMood: "reflective",
          maicaMood: "warm",
          currentActivity: "listening",
          activeMusic: null,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    const userMessageId = "msg_" + nanoid(16);
    const responseMessageId = "msg_" + nanoid(16);
    const now = new Date();

    await db.insertInto("simulationMessages").values({
      messageId: userMessageId,
      sessionId: session.sessionId,
      speaker: parsed.data.speaker,
      text: parsed.data.message,
      source: "user",
      interactionId: null,
      createdAt: now,
    }).execute();

    let replyText: string | null = null;
    let interactionId = "scripted_" + nanoid(10);
    let source = "simulation";

    if (isGeminiActive()) {
      try {
        const memories = await simulationMemoryRetriever(parsed.data.message, 3);
        const history = await db
          .selectFrom("simulationMessages")
          .selectAll()
          .where("sessionId", "=", session.sessionId)
          .orderBy("createdAt", "desc")
          .limit(6)
          .execute();

        replyText = await generateGeminiChatReply({
          speaker: parsed.data.speaker,
          message: parsed.data.message,
          world: session.world,
          currentActivity: session.currentActivity,
          retrievedMemories: memories.map((m) => ({ title: m.title, description: m.description })),
          recentHistory: history.reverse().map((h) => ({ speaker: h.speaker, text: h.text })),
        });

        if (replyText) {
          interactionId = "gemini_" + nanoid(10);
          source = "gemini";
        }
      } catch (err) {
        console.warn("[Chat Endpoint] Gemini failed, falling back to scripted:", err);
      }
    }

    if (!replyText) {
      replyText = await simulationScriptedChatReply({
        speaker: parsed.data.speaker,
        message: parsed.data.message,
        now,
      });
    }

    const aiNow = new Date();
    await db.insertInto("simulationMessages").values({
      messageId: responseMessageId,
      sessionId: session.sessionId,
      speaker: parsed.data.speaker,
      text: replyText,
      source,
      interactionId,
      createdAt: aiNow,
    }).execute();

    const nextActivity =
      (parsed.data.speaker === "clint" ? "Clint" : "Maica") +
      " is speaking";

    await db.updateTable("simulationSessions").set({
      updatedAt: aiNow,
      currentActivity: nextActivity,
      ...(parsed.data.speaker === "clint"
        ? { clintInteractionId: interactionId }
        : { maicaInteractionId: interactionId }),
    }).where("sessionId", "=", session.sessionId).execute();

    const output = {
      configured: true,
      sessionId: session.sessionId,
      userMessageId,
      responseMessageId,
      message: replyText,
      speaker: parsed.data.speaker,
      interactionId,
    };

    await publish("simulation:main", {
      type: "simulation.chat",
      ...output,
    });

    return json(output);
  } catch (error) {
    console.error(
      "Simulation chat failed",
      error instanceof Error ? error.message : String(error),
    );
    return json({
      error: error instanceof Error ? error.message : "Simulation chat failed.",
    }, 502);
  }
}
