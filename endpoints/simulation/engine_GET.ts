import superjson from "superjson";
import { isGeminiActive, getEngineMode, setEngineMode } from "../../helpers/geminiSimulation";

export async function handle(request: Request): Promise<Response> {
  if (request.method === "POST") {
    try {
      const text = await request.text();
      let mode: "ai" | "scripted" | undefined;
      try {
        const parsed = superjson.parse<{ mode?: "ai" | "scripted" }>(text);
        mode = parsed.mode;
      } catch {
        const json = JSON.parse(text);
        mode = json.mode;
      }
      if (mode === "ai" || mode === "scripted") {
        setEngineMode(mode);
      }
    } catch (err) {
      console.warn("Failed to set engine mode:", err);
    }
  }

  const active = isGeminiActive();
  const currentMode = getEngineMode();

  return new Response(
    superjson.stringify({
      geminiConfigured: active,
      model: "AI",
      mode: currentMode,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
