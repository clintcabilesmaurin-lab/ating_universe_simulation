import { GoogleGenAI } from "@google/genai";
import { simulationAgentProfiles } from "./simulationAgentProfiles";
import { SHARED_RELATIONSHIP_CONTEXT } from "./simulationKnowledge";

let keyValidationCache: { key: string; isValid: boolean } | null = null;

function isValidApiKeyFormat(key?: string | null): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  // Standard Google API keys start with AIzaSy and contain no dots
  if (trimmed.startsWith("AIzaSy") && trimmed.length >= 35) {
    return true;
  }
  // If it contains dots or unexpected tokens, it's not a valid Gemini API key
  if (trimmed.includes(".") || trimmed.length < 30) {
    return false;
  }
  return true;
}

export function isGeminiActive(): boolean {
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
    const ai = new GoogleGenAI({ apiKey });

    const activeProfile = simulationAgentProfiles[speaker];
    const partnerSpeaker = speaker === "clint" ? "maica" : "clint";
    const partnerProfile = simulationAgentProfiles[partnerSpeaker];

    const memoryContext = retrievedMemories && retrievedMemories.length > 0
      ? "Relevant Shared Memories & Inside Lore:\n" +
        retrievedMemories.map((m) => `- ${m.title}: ${m.description}`).join("\n")
      : "";

    const historyContext = recentHistory && recentHistory.length > 0
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

Simulation Rules:
1. Speak naturally in your authentic voice (Bisaya / Taglish / English).
2. Keep replies concise and natural (1-3 sentences).
3. Do not include markdown, meta tags, or prefixes like "${activeProfile.name}:".
`.trim();

    const prompt = `
${historyContext}

Input message received:
"${message}"

Reply directly in character as ${activeProfile.name}:
`.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        maxOutputTokens: 250,
      },
    });

    const reply = response.text?.trim();
    if (!reply) return null;

    return reply.replace(/^["']|["']$/g, "").trim();
  } catch (err: any) {
    const errMsg = String(err?.message || err);
    if (errMsg.includes("API key not valid") || errMsg.includes("API_KEY_INVALID") || errMsg.includes("PERMISSION_DENIED") || err?.status === 400 || err?.status === 403) {
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
    const ai = new GoogleGenAI({ apiKey });

    const activeProfile = simulationAgentProfiles[speaker];
    const partnerSpeaker = speaker === "clint" ? "maica" : "clint";
    const partnerProfile = simulationAgentProfiles[partnerSpeaker];

    const musicInfo = activeMusicTitle
      ? `Currently listening together to: "${activeMusicTitle}" by ${activeMusicArtist || "Unknown"}`
      : "Quiet ambient room setting.";

    const historyContext = recentHistory && recentHistory.length > 0
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
Generate a spontaneous, intimate line or thought spoken directly to ${partnerProfile.name} in natural Bisaya/Taglish/English.
Keep it short (1-2 sentences), warm, funny, or reflective.
Do not output quotes or speaker prefixes.
`.trim();

    const prompt = `
${historyContext}

Spontaneous line spoken to ${partnerProfile.name}:
`.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.9,
        maxOutputTokens: 180,
      },
    });

    const reply = response.text?.trim();
    if (!reply) return null;
    return reply.replace(/^["']|["']$/g, "").trim();
  } catch (err: any) {
    const errMsg = String(err?.message || err);
    if (errMsg.includes("API key not valid") || errMsg.includes("API_KEY_INVALID") || errMsg.includes("PERMISSION_DENIED") || err?.status === 400 || err?.status === 403) {
      recordKeyFailure(apiKey);
    }
    return null;
  }
}
