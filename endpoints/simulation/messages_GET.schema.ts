import superjson from "superjson";

export type OutputType = {
  messages: Array<{
    messageId: string;
    speaker: "clint" | "maica";
    text: string;
    source: string;
    interactionId: string | null;
    createdAt: string;
  }>;
  hasMore: boolean;
  nextBefore: string | null;
};

export const getSimulationMessages = async (
  sessionId: string,
  before: string | null,
  limit = 50,
): Promise<OutputType> => {
  const params = new URLSearchParams({
    sessionId,
    ...(before ? { before } : {}),
    limit: String(Math.min(Math.max(limit, 20), 50)),
  });

  const result = await fetch("/_api/simulation/messages?" + params.toString());
  if (!result.ok) throw new Error("Could not load older simulation messages.");
  return superjson.parse<OutputType>(await result.text());
};