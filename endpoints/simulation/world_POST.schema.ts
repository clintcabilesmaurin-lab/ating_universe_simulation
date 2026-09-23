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
    throw new Error(superjson.parse<{ error: string }>(await result.text()).error);
  }
  return superjson.parse<OutputType>(await result.text());
};
