import superjson from "superjson";

export type OutputType = {
  sessionId: string;
  world: string;
  clintMood: string;
  maicaMood: string;
  currentActivity: string;
  activeMusic: string | null;
  messages: Array<{
    messageId: string;
    speaker: "clint" | "maica";
    text: string;
    source: string;
    interactionId: string | null;
    createdAt: string;
  }>;
};

export const postSimulationSession = async (): Promise<OutputType> => {
  const result = await fetch("/_api/simulation/session", {
    method: "POST",
    body: superjson.stringify({}),
    headers: { "Content-Type": "application/json" },
  });
  if (!result.ok) throw new Error("Could not create the simulation session.");
  return superjson.parse<OutputType>(await result.text());
};