import { z } from "zod";
import superjson from "superjson";
import { sendClientSimulationChat } from "../../helpers/clientSimulationEngine";

export const chatSchema = z.object({
  speaker: z.enum(["clint", "maica"]),
  message: z.string().min(1).max(8000),
  world: z.enum(["living-room", "music-room"]).default("living-room"),
  previousInteractionId: z.string().min(1).optional(),
  sessionId: z.string().min(1).optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;

export const chatResponseSchema = z.object({
  configured: z.boolean(),
  sessionId: z.string(),
  userMessageId: z.string(),
  responseMessageId: z.string(),
  message: z.string(),
  speaker: z.enum(["clint", "maica"]),
  interactionId: z.string(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;

export async function postSimulationChat(input: ChatInput): Promise<ChatResponse> {
  const validatedInput = chatSchema.parse(input);
  try {
    const response = await fetch("/_api/simulation/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: superjson.stringify(validatedInput),
    });
    if (response.ok) {
      const text = await response.text();
      if (
        !text.trim().startsWith("<!DOCTYPE") &&
        !text.trim().startsWith("<html")
      ) {
        const data: unknown = superjson.parse<unknown>(text);
        return chatResponseSchema.parse(data);
      }
    }
  } catch (err) {
    console.warn("Backend chat API unavailable, running client simulation reply:", err);
  }

  const result = sendClientSimulationChat({
    sessionId: input.sessionId || "sim_local",
    speaker: input.speaker,
    message: input.message,
    world: input.world,
  });

  return {
    configured: true,
    sessionId: input.sessionId || "sim_local",
    userMessageId: result.userMessageId,
    responseMessageId: result.responseMessageId,
    message: result.message,
    speaker: result.speaker,
    interactionId: result.interactionId,
  };
}
