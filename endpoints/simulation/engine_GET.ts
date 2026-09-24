import superjson from "superjson";
import { isGeminiActive } from "../../helpers/geminiSimulation";

export async function handle(_request: Request): Promise<Response> {
  const active = isGeminiActive();
  return new Response(
    superjson.stringify({
      geminiConfigured: active,
      model: "gemini-3.5-flash-lite",
      mode: active ? "gemini" : "scripted",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
