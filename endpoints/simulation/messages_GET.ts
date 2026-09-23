import superjson from "superjson";
import { db } from "../../helpers/db";
import type { OutputType } from "./messages_GET.schema";

export async function handle(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");
    const before = url.searchParams.get("before");
    const rawLimit = Number(url.searchParams.get("limit") ?? "50");
    const limit = Math.min(Math.max(Number.isFinite(rawLimit) ? rawLimit : 50, 20), 50);

    if (!sessionId) {
      return new Response(superjson.stringify({ error: "sessionId is required." }), { status: 400 });
    }

    const query = db
      .selectFrom("simulationMessages")
      .selectAll()
      .where("sessionId", "=", sessionId)
      .$if(Boolean(before), (builder) => builder.where("createdAt", "<", new Date(before!)))
      .orderBy("createdAt", "desc")
      .limit(limit + 1);

    const rows = await query.execute();
    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit).reverse();

    const output: OutputType = {
      messages: page.map((message) => ({
        messageId: message.messageId,
        speaker: message.speaker,
        text: message.text,
        source: message.source,
        interactionId: message.interactionId,
        createdAt: message.createdAt.toISOString(),
      })),
      hasMore,
      nextBefore: page.length > 0 ? page[0].createdAt.toISOString() : null,
    };

    return new Response(superjson.stringify(output), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(superjson.stringify({
      error: error instanceof Error ? error.message : "Could not load older messages.",
    }), { status: 500 });
  }
}