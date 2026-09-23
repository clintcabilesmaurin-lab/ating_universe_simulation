import superjson from "superjson";

export type InputType = {
  sessionId: string;
  trackId: string;
};

export type OutputType = {
  sessionId: string;
  trackId: string;
  currentActivity: string;
  messages: Array<{
    messageId: string;
    speaker: "clint" | "maica";
    text: string;
    interactionId: string;
    createdAt: string;
  }>;
};

export const postSimulationMusic = async (input: InputType): Promise<OutputType> => {
  const result = await fetch("/_api/simulation/music", {
    method: "POST",
    body: superjson.stringify(input),
    headers: { "Content-Type": "application/json" },
  });

  if (!result.ok) {
    throw new Error(superjson.parse<{ error: string }>(await result.text()).error);
  }

  return superjson.parse<OutputType>(await result.text());
};
