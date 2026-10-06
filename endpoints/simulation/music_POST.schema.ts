import superjson from "superjson";

export type InputType = {
  sessionId: string;
  trackId: string;
};

export type OutputType = {
  sessionId: string;
  trackId: string;
  currentActivity: string;
};

export const postSimulationMusic = async (input: InputType): Promise<OutputType> => {
  const result = await fetch("/_api/simulation/music", {
    method: "POST",
    body: superjson.stringify(input),
    headers: { "Content-Type": "application/json" },
  });

  if (!result.ok) {
    throw new Error(`Failed to update music selection: ${result.statusText}`);
  }
  const text = await result.text();
  return superjson.parse<OutputType>(text);
};
