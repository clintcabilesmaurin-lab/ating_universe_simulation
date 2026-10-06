import superjson from "superjson";

export type InputType = {
  sessionId: string;
  world: "living-room" | "music-room";
};

export type OutputType = InputType & {
  currentActivity: string;
};

export const postSimulationWorld = async (input: InputType): Promise<OutputType> => {
  const result = await fetch("/_api/simulation/world", {
    method: "POST",
    body: superjson.stringify(input),
    headers: { "Content-Type": "application/json" },
  });
  if (!result.ok) {
    throw new Error(`Failed to update world: ${result.statusText}`);
  }
  const text = await result.text();
  return superjson.parse<OutputType>(text);
};
