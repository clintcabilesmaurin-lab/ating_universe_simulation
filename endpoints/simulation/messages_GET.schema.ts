import superjson from "superjson";
import { getOrCreateClientSession } from "../../helpers/clientSimulationEngine";

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
  try {
    const params = new URLSearchParams({
      sessionId,
      ...(before ? { before } : {}),
      limit: String(Math.min(Math.max(limit, 20), 50)),
    });

    const result = await fetch("/_api/simulation/messages?" + params.toString());
    if (result.ok) {
      const text = await result.text();
      if (
        !text.trim().startsWith("<!DOCTYPE") &&
        !text.trim().startsWith("<html")
      ) {
        return superjson.parse<OutputType>(text);
      }
    }
  } catch (err) {
    console.warn("Backend messages API unavailable, retrieving from client session:", err);
  }

  const session = getOrCreateClientSession(sessionId);
  const msgs = session.messages || [];
  return {
    messages: msgs.slice(-limit),
    hasMore: false,
    nextBefore: null,
  };
};
