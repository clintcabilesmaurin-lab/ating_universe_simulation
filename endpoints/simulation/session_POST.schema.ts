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
    const errorText = await result.text();
    let message = `Failed to initialize session: ${result.statusText}`;
    try {
      const err = superjson.parse<{ error?: string }>(errorText);
      if (err?.error) message = err.error;
    } catch {}
    throw new Error(message);
  }
  const text = await result.text();
  return superjson.parse<OutputType>(text);
};
