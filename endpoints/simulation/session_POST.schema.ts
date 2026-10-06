import superjson from "superjson";
import type { SimulationSpeaker } from "../../helpers/schema";

export type MessageItem = {
  messageId: string;
  speaker: SimulationSpeaker;
  text: string;
  source: string;
  interactionId: string | null;
  createdAt: string;
};

export type OutputType = {
  sessionId: string;
  world: string;
  clintMood: string;
  maicaMood: string;
  currentActivity: string;
  activeMusic: string | null;
  messages: MessageItem[];
};

export const postSimulationSession = async (): Promise<OutputType> => {
  const result = await fetch("/_api/simulation/session", {
    method: "POST",
    body: superjson.stringify({}),
    headers: { "Content-Type": "application/json" },
  });
  if (!result.ok) {
    throw new Error(`Failed to initialize session: ${result.statusText}`);
  }
  const text = await result.text();
  return superjson.parse<OutputType>(text);
};
