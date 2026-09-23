import superjson from "superjson";
import type { OutputType } from "./session_POST.schema";

export type InputType = { sessionId: string };

export const getSimulationSession = async (sessionId: string, limit?: number): Promise<OutputType> => {
  const params = new URLSearchParams({ sessionId });
  if (limit) params.set("limit", String(limit));
  const result = await fetch(`/_api/simulation/session?${params.toString()}`, {
    method: "GET",
  });
  if (!result.ok) throw new Error("Could not load the simulation session.");
  return superjson.parse<OutputType>(await result.text());
};