import superjson from "superjson";
import { updateClientSimulationMusic } from "../../helpers/clientSimulationEngine";
import { musicLibrary } from "../../helpers/musicLibrary";

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
  try {
    const result = await fetch("/_api/simulation/music", {
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
    console.warn("Backend music API unavailable, updating local simulation music:", err);
  }

  const res = updateClientSimulationMusic(input.sessionId, input.trackId);
  const track = musicLibrary.find((t) => t.id === input.trackId);
  return {
    sessionId: input.sessionId,
    trackId: input.trackId,
    currentActivity: res.currentActivity,
    messages: [
      {
        messageId: "msg_" + Math.random().toString(36).slice(2),
        speaker: "clint",
        text: track ? `Tukar ta ani lovey: ${track.title} 🎶` : "Playing soundtrack",
        interactionId: "music_" + input.trackId,
        createdAt: new Date().toISOString(),
      },
    ],
  };
};
