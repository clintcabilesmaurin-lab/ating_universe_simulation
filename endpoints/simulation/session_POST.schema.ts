import superjson from "superjson";
import {
  getOrCreateClientSession,
  type ClientSessionOutput,
} from "../../helpers/clientSimulationEngine";

export type OutputType = ClientSessionOutput;

export const postSimulationSession = async (): Promise<OutputType> => {
  try {
    const result = await fetch("/_api/simulation/session", {
      method: "POST",
      body: superjson.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    if (result.ok) {
      const text = await result.text();
      // Ensure it's not an HTML 404 page from SPA fallback
      if (
        !text.trim().startsWith("<!DOCTYPE") &&
        !text.trim().startsWith("<html")
      ) {
        return superjson.parse<OutputType>(text);
      }
    }
  } catch (err) {
    console.warn("Backend session API unavailable, running client simulation:", err);
  }

  // Gracefully initialize client-side simulation observatory
  return getOrCreateClientSession();
};
