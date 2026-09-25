import superjson from "superjson";
import { db } from "../../helpers/db";
import type { OutputType } from "./session_POST.schema";

export async function handle(request: Request): Promise<Response> {
  const sessionId = new URL(request.url).searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(superjson.stringify({ error: "sessionId is required." }), { status: 400 });
  }

  let session = await db.selectFrom("simulationSessions")
    .selectAll()
    .where("sessionId", "=", sessionId)
    .executeTakeFirst();
  if (!session) {
    // Graceful auto-recovery for serverless instances
    session = await db.insertInto("simulationSessions").values({
      sessionId,
      world: "living-room",
      clintMood: "reflective",
      maicaMood: "warm",
      currentActivity: "sitting together",
      activeMusic: null,
    }).returningAll().executeTakeFirstOrThrow();

    const starterPairs = [
      [
        { speaker: "maica" as const, text: "Skl lovey, para jud tayong compound interest ba 🌱" },
        { speaker: "clint" as const, text: "Solid ang growth araw-araw... tas pag ikaw ang kahati, mas dodoble pa hahahaha." },
        { speaker: "maica" as const, text: "Hehe basta nag-unongay ta sa tanan 🤍" },
      ],
    ];
    const starter = starterPairs[0];
    const now = Date.now();
    for (let i = 0; i < starter.length; i++) {
      const item = starter[i];
      await db.insertInto("simulationMessages").values({
        messageId: "msg_" + Math.random().toString(36).slice(2),
        sessionId,
        speaker: item.speaker,
        text: item.text,
        source: "simulation",
        interactionId: "starter_" + i,
        createdAt: new Date(now - (starter.length - i) * 60000),
      }).execute();
    }
  }

  const requestedLimit = new URL(request.url).searchParams.get("limit");
  const parsedLimit = requestedLimit ? Number(requestedLimit) : null;
  const paged = parsedLimit !== null && Number.isFinite(parsedLimit) && parsedLimit > 0;

  const messages = await db.selectFrom("simulationMessages")
    .selectAll()
    .where("sessionId", "=", sessionId)
    .orderBy("createdAt", "desc")
    .$if(paged, (builder) => builder.limit(Math.min(Math.max(parsedLimit ?? 50, 20), 50) + 1))
    .execute();

  const page = paged
    ? messages.slice(0, Math.min(Math.max(parsedLimit ?? 50, 20), 50)).reverse()
    : [...messages].reverse();

  const output: OutputType = {
    sessionId: session.sessionId,
    world: session.world,
    clintMood: session.clintMood,
    maicaMood: session.maicaMood,
    currentActivity: session.currentActivity,
    activeMusic: session.activeMusic,
    messages: page.map((message) => ({
      messageId: message.messageId,
      speaker: message.speaker,
      text: message.text,
      source: message.source,
      interactionId: message.interactionId,
      createdAt: message.createdAt.toISOString(),
    })),
  };

  return new Response(superjson.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
}