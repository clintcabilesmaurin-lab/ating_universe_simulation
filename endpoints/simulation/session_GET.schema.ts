import superjson from "superjson";
import type { OutputType } from "./session_POST.schema";

export const getSimulationSession = async (
  sessionId?: string,
  limit?: number
): Promise<OutputType> => {
  const params = new URLSearchParams();
  if (sessionId) params.set("sessionId", sessionId);
  if (limit) params.set("limit", String(limit));
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const result = await fetch(`/_api/simulation/session${queryString}`, {
    method: "GET",
  });
  if (!result.ok) {
    throw new Error(`Failed to load simulation session: ${result.statusText}`);
  }
  const text = await result.text();
  return superjson.parse<OutputType>(text);
};
