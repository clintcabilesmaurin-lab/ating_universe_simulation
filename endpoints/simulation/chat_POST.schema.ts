import { z } from "zod";
import superjson from "superjson";

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
  const response = await fetch("/_api/simulation/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: superjson.stringify(validatedInput),
  });
  const data: unknown = await response.text().then((text) => superjson.parse<unknown>(text)).catch(() => ({ configured: true, message: "Invalid server response." }));
  if (!response.ok) {
    const message = typeof data === "object" && data !== null && "error" in data
      ? String((data as { error?: unknown }).error ?? "Simulation request failed.")
      : "Simulation request failed.";
    throw new Error(message);
  }
  return chatResponseSchema.parse(data);
}
