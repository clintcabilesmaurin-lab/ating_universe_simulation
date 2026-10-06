import { z } from "zod";
import superjson from "superjson";
import type { MessageItem } from "./session_POST.schema";

export const chatSchema = z.object({
  speaker: z.enum(["clint", "maica"]),
  message: z.string().min(1).max(8000),
  world: z.enum(["living-room", "music-room"]).default("living-room"),
  sessionId: z.string().min(1).optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;

export type ChatResponse = {
  success: boolean;
  sessionId: string;
  message: MessageItem;
};

export async function postSimulationChat(input: ChatInput): Promise<ChatResponse> {
  const validatedInput = chatSchema.parse(input);
  const response = await fetch("/_api/simulation/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: superjson.stringify(validatedInput),
  });
  if (!response.ok) {
    const errorText = await response.text();
    let message = `Failed to send transmission: ${response.statusText}`;
    try {
      const err = superjson.parse<{ error?: string }>(errorText);
      if (err.error) message = err.error;
    } catch {}
    throw new Error(message);
  }
  const text = await response.text();
  return superjson.parse<ChatResponse>(text);
}
