import superjson from "superjson";
import { db } from "../../helpers/db";
import type { OutputType } from "./session_POST.schema";

export async function handle(request: Request): Promise<Response> {
  const sessionId = new URL(request.url).searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(superjson.stringify({ error: "sessionId is required." }), { status: 400 });
  }

  const session = await db.selectFrom("simulationSessions")
    .selectAll()
    .where("sessionId", "=", sessionId)
    .executeTakeFirst();
  if (!session) {
    return new Response(superjson.stringify({ error: "Simulation session not found." }), { status: 404 });
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