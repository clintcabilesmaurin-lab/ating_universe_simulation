GEMINI — NO LONGER USED (kept for reference)

As of this note, tick_POST and chat_POST no longer call Gemini at all.
Both endpoints now run on a fully hardcoded, local "scripted engine":

  helpers/simulationScriptedContent.tsx  — the data bank (events, riddles, filler lines)
  helpers/simulationScriptedTurn.tsx     — picks/advances the next line, no network calls

GEMINI_API_KEY is not required anymore. The former Gemini helper was removed.
The simulation is intentionally hardcoded and local for zero per-message model cost.

The memory system (simulation_memories table + simulationMemoryRetriever.tsx)
is still active — it's now used to add occasional in-character "remember
when..." callbacks to scripted chat replies, purely via local DB lookup.
