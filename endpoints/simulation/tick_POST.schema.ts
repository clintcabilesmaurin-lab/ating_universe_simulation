import superjson from "superjson";
import { runClientSimulationTick } from "../../helpers/clientSimulationEngine";

export type InputType = {
  sessionId: string;
  speaker?: "clint" | "maica";
};

export type OutputType = {
  sessionId: string;
  message: {
    messageId: string;
    speaker: "clint" | "maica";
    text: string;
    source: string;
    interactionId: string | null;
    createdAt: string;
  };
  world: string;
  currentActivity: string;
  nextDelayMs: number;
};

export const postSimulationTick = async (input: InputType): Promise<OutputType> => {
  try {
    const result = await fetch("/_api/simulation/tick", {
      method: "POST",
      body: superjson.stringify(input),
      headers: { "Content-Type": "application/json" },
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
    console.warn("Backend tick API unavailable, running client simulation tick:", err);
  }

  const clientTick = runClientSimulationTick(input.sessionId, input.speaker);
  return {
    sessionId: input.sessionId,
    message: clientTick.message,
    world: "living-room",
    currentActivity: clientTick.currentActivity,
    nextDelayMs: clientTick.nextDelayMs,
  };
};
