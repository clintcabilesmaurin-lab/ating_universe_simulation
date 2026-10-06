import superjson from "superjson";
import { db } from "../../helpers/db";
import type { OutputType } from "./session_POST.schema";

export async function handle(request: Request): Promise<Response> {
  const sessionId = new URL(request.url).searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(superjson.stringify({ error: "sessionId is required." }), { status: 400 });
  }

  let session = await db.sessions.get(sessionId);
  if (!session) {
    session = await db.sessions.create({
      sessionId,
      world: "living-room",
      clintMood: "reflective",
      maicaMood: "warm",
      currentActivity: "sitting together",
      activeMusic: null,
    });

    const starter = [
      { speaker: "maica" as const, text: "Skl lovey, para jud tayong compound interest ba 🌱" },
      { speaker: "clint" as const, text: "Solid ang growth araw-araw... tas pag ikaw ang kahati, mas dodoble pa hahahaha." },
      { speaker: "maica" as const, text: "Hehe basta nag-unongay ta sa tanan 🤍" },
    ];
    const now = Date.now();
    for (let i = 0; i < starter.length; i++) {
      const item = starter[i];
      await db.messages.insert({
        messageId: "msg_" + Math.random().toString(36).slice(2),
        sessionId,
        speaker: item.speaker,
        text: item.text,
        source: "simulation",
        interactionId: "starter_" + i,
        createdAt: new Date(now - (starter.length - i) * 60000),
      });
    }
  }

  const requestedLimit = new URL(request.url).searchParams.get("limit");
  const parsedLimit = requestedLimit ? Number(requestedLimit) : null;
  const paged = parsedLimit !== null && Number.isFinite(parsedLimit) && parsedLimit > 0;
  const limit = paged ? Math.min(Math.max(parsedLimit ?? 50, 20), 50) : 50;

  const messages = await db.messages.list({
    sessionId,
    limit: limit + 1,
  });

  const page = messages.slice(0, limit).reverse();

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
