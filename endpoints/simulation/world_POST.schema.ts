import superjson from "superjson";
import { updateClientSimulationWorld } from "../../helpers/clientSimulationEngine";

export type InputType = {
  sessionId: string;
  world: "living-room" | "music-room";
};

export type OutputType = InputType & {
  currentActivity: string;
};

export const postSimulationWorld = async (input: InputType): Promise<OutputType> => {
  try {
    const result = await fetch("/_api/simulation/world", {
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
    console.warn("Backend world API unavailable, updating local simulation world:", err);
  }

  const localResult = updateClientSimulationWorld(input.sessionId, input.world);
  return {
    sessionId: input.sessionId,
    world: input.world,
    currentActivity: localResult.currentActivity,
  };
};
