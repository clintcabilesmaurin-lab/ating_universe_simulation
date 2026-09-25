import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType =
  | { token: string; wssEndpoint: string; userId: string }
  | { error: string };

export const postRealtimeToken = async (
  body: InputType = {},
  init?: RequestInit,
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  try {
    const result = await fetch(`/_api/_realtime/token`, {
      method: "POST",
      body: superjson.stringify(validatedInput),
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
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
  } catch {}

  return { error: "Realtime WebSocket server unavailable on current deployment host" };
};
