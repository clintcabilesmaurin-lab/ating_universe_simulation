import { db } from "./db";

type SimulationMemory = {
  memoryId: string;
  memoryCategory: string;
  title: string;
  description: string;
  keywords: string[];
};

const stopWords = new Set([
  "about", "after", "again", "also", "what", "when", "where", "which", "with",
  "that", "this", "your", "you", "just", "have", "from", "they", "them", "into",
  "would", "could", "should", "like", "think", "here", "there", "really",
]);

export async function simulationMemoryRetriever(message: string, limit = 6): Promise<SimulationMemory[]> {
  const rows = await db
    .selectFrom("simulationMemories")
    .select(["memoryId", "memoryCategory", "title", "description", "keywords"])
    .execute();

  const terms = Array.from(
    new Set(
      message
        .toLowerCase()
        .replace(/[^a-z0-9à-ž\s-]/gi, " ")
        .split(/\s+/)
        .map((term) => term.trim())
        .filter((term) => term.length >= 3 && !stopWords.has(term)),
    ),
  );

  if (terms.length === 0) return rows.slice(0, limit);

  return rows
    .map((memory) => {
      const haystack = [
        memory.title,
        memory.description,
        ...memory.keywords,
      ].join(" ").toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (memory.keywords.some((keyword) => keyword.toLowerCase().includes(term))) score += 4;
        if (memory.title.toLowerCase().includes(term)) score += 3;
        if (haystack.includes(term)) score += 1;
      }

      return { memory, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ memory }) => memory);
}