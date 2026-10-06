import { GoogleGenAI } from "@google/genai";
import { simulationAgentProfiles } from "./simulationAgentProfiles";
import { SHARED_RELATIONSHIP_CONTEXT } from "./simulationKnowledge";

let currentEngineMode: "ai" | "scripted" = "ai";
let keyValidationCache: { key: string; isValid: boolean } | null = null;

export function getEngineMode(): "ai" | "scripted" {
  return currentEngineMode;
}

export function setEngineMode(mode: "ai" | "scripted"): void {
  currentEngineMode = mode;
}

export function isValidApiKeyFormat(key?: string | null): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  // Valid Google Gemini API keys start with AIzaSy and are at least 35 characters
  return trimmed.startsWith("AIzaSy") && trimmed.length >= 35;
}

export function isGeminiActive(): boolean {
  if (currentEngineMode === "scripted") return false;
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || !isValidApiKeyFormat(key)) return false;
  if (keyValidationCache && keyValidationCache.key === key) {
    return keyValidationCache.isValid;
  }
  return true;
}

function recordKeyFailure(key: string) {
  keyValidationCache = { key, isValid: false };
}

function createGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function generateGeminiChatReply({
  speaker,
  message,
  world,
  currentActivity,
  retrievedMemories,
  recentHistory,
}: {
  speaker: "clint" | "maica";
  message: string;
  world?: string;
  currentActivity?: string;
  retrievedMemories?: Array<{ title: string; description: string }>;
  recentHistory?: Array<{ speaker: string; text: string }>;
}): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || !isGeminiActive()) return null;

  try {
    const ai = createGeminiClient(apiKey);

    const activeProfile = simulationAgentProfiles[speaker];
    const partnerSpeaker = speaker === "clint" ? "maica" : "clint";
    const partnerProfile = simulationAgentProfiles[partnerSpeaker];

    const memoryContext =
      retrievedMemories && retrievedMemories.length > 0
        ? "Relevant Shared Memories & Inside Lore:\n" +
          retrievedMemories.map((m) => `- ${m.title}: ${m.description}`).join("\n")
        : "";

    const historyContext =
      recentHistory && recentHistory.length > 0
        ? "Recent dialogue context:\n" +
          recentHistory
            .slice(-6)
            .map((h) => `${h.speaker === "clint" ? "Clint" : "Maica"}: ${h.text}`)
            .join("\n")
        : "";

    const systemInstruction = `
${activeProfile.systemPrompt}

You are currently talking directly to or about ${partnerProfile.name}.
Location: ${world || "living-room"}
Ambient Context: ${currentActivity || "sitting together quietly"}

Inside Jokes & Recurring Moments:
${SHARED_RELATIONSHIP_CONTEXT.insideJokes.join(", ")}
${SHARED_RELATIONSHIP_CONTEXT.recurringMoments.join("; ")}

${memoryContext}

Exact Voice Guidelines:
1. Speak in natural, everyday conversational Bisaya (Cebuano) + Taglish + English.
2. Naturally use authentic emotional markers and fillers: "jud", "ba", "bitaw", "lagi", "karon", "sad", "diay", "ra", "ois", "haha", "hehe".
3. Use terms of affection naturally: "lovey", "mylabs", "choy", "palangga", "baby ko".
4. Keep it concise, genuine, and punchy (1 to 3 sentences max)—like real couples chatting.
5. NEVER sound like a customer service assistant or generic AI. Do not use quotes, asterisks, or prefix your name.
`.trim();

    const prompt = `
${historyContext}

Input message from partner or user:
"${message}"

Reply directly in character as ${activeProfile.name}:
`.trim();

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });
    } catch {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });
    }

    const reply = response.text?.trim();
    if (!reply) return null;

    return reply.replace(/^["']|["']$/g, "").trim();
  } catch (err: any) {
    const errMsg = String(err?.message || err);
    if (
      errMsg.includes("API key not valid") ||
      errMsg.includes("API_KEY_INVALID") ||
      errMsg.includes("PERMISSION_DENIED") ||
      errMsg.includes("API_KEY_SERVICE_BLOCKED") ||
      err?.status === 400 ||
      err?.status === 403
    ) {
      recordKeyFailure(apiKey);
    }
    return null;
  }
}

export async function generateGeminiAmbientTurn({
  speaker,
  world,
  currentActivity,
  activeMusicTitle,
  activeMusicArtist,
  recentHistory,
}: {
  speaker: "clint" | "maica";
  world: string;
  currentActivity: string;
  activeMusicTitle?: string | null;
  activeMusicArtist?: string | null;
  recentHistory?: Array<{ speaker: string; text: string }>;
}): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || !isGeminiActive()) return null;

  try {
    const ai = createGeminiClient(apiKey);

    const activeProfile = simulationAgentProfiles[speaker];
    const partnerSpeaker = speaker === "clint" ? "maica" : "clint";
    const partnerProfile = simulationAgentProfiles[partnerSpeaker];

    const musicInfo = activeMusicTitle
      ? `Currently listening together to: "${activeMusicTitle}" by ${activeMusicArtist || "Unknown"}`
      : "Quiet ambient room setting.";

    const historyContext =
      recentHistory && recentHistory.length > 0
        ? "Recent conversation:\n" +
          recentHistory
            .slice(-4)
            .map((h) => `${h.speaker === "clint" ? "Clint" : "Maica"}: ${h.text}`)
            .join("\n")
        : "";

    const systemInstruction = `
${activeProfile.systemPrompt}

Setting: ${world} (${currentActivity})
${musicInfo}

Partner: ${partnerProfile.name} is right here with you.
Generate a spontaneous, intimate line or thought spoken directly to ${partnerProfile.name} in natural, authentic Bisaya/Taglish/English.
Keep it short (1-2 sentences), warm, funny, reflective, or affectionate.
Use natural particles ("jud", "ba", "lagi", "karon", "sad", "haha") and pet names ("lovey", "mylabs", "choy").
Do not output quotes or speaker prefixes.
`.trim();

    const prompt = `
${historyContext}

Spontaneous line spoken to ${partnerProfile.name}:
`.trim();

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.9,
        },
      });
    } catch {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.9,
        },
      });
    }

    const reply = response.text?.trim();
    if (!reply) return null;
    return reply.replace(/^["']|["']$/g, "").trim();
  } catch (err: any) {
    const errMsg = String(err?.message || err);
    if (
      errMsg.includes("API key not valid") ||
      errMsg.includes("API_KEY_INVALID") ||
      errMsg.includes("PERMISSION_DENIED") ||
      errMsg.includes("API_KEY_SERVICE_BLOCKED") ||
      err?.status === 400 ||
      err?.status === 403
    ) {
      recordKeyFailure(apiKey);
    }
    return null;
  }
}
