import superjson from "superjson";

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
  const result = await fetch("/_api/simulation/tick", {
    method: "POST",
    body: superjson.stringify(input),
    headers: { "Content-Type": "application/json" },
  });
  if (!result.ok) {
    const errorText = await result.text();
    throw new Error(superjson.parse<{ error: string }>(errorText).error);
  }
  return superjson.parse<OutputType>(await result.text());
};