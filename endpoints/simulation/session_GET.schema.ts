import superjson from "superjson";
import type { OutputType } from "./session_POST.schema";
import { getOrCreateClientSession } from "../../helpers/clientSimulationEngine";

export type InputType = { sessionId: string };

export const getSimulationSession = async (
  sessionId: string,
  limit?: number
): Promise<OutputType> => {
  try {
    const params = new URLSearchParams({ sessionId });
    if (limit) params.set("limit", String(limit));
    const result = await fetch(`/_api/simulation/session?${params.toString()}`, {
      method: "GET",
    });
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
    console.warn("Backend session GET API unavailable, retrieving local session:", err);
  }

  return getOrCreateClientSession(sessionId);
};
