// Fully local, stateful conversation engine.
// No AI provider is used. The engine selects coherent hardcoded threads and
// remembers the current thread/step in the simulation session JSON state.

import {
  SCRIPTED_EVENTS,
  ACTIVITY_FILLERS,
  KEYWORD_BANKS,
  MEMORY_CALLBACK_TEMPLATES,
  type Speaker,
} from "./simulationScriptedContent";
import {
  DAILY_THREADS,
  EVENT_THREADS,
  type ConversationThread,
} from "./simulationConversationThreads";
import { getSimulationDayCycle } from "./simulationDayCycle";
import { simulationMemoryRetriever } from "./simulationMemoryRetriever";

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function manilaClock(date: Date): { hour: number; dayOfWeek: number } {
  const parts = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    hour: hour + minute / 60,
    dayOfWeek: dayMap[get("weekday")] ?? 0,
  };
}

export type EventState = {
  activeEvent: string | null;
  eventExpiresAt: Date | null;
  eventCooldowns: Record<string, string>;
};

export type AmbientTurnResult = {
  speaker: Speaker;
  text: string;
  activity: string;
  nextState: EventState;
  nextDelayMs: number;
};

const THREAD_ID_KEY = "conversationThreadId";
const THREAD_STEP_KEY = "conversationThreadStep";
const THREAD_NEXT_AT_KEY = "__thread_next_at";
const THREAD_USED_PREFIX = "threadUsed:";

function readThreadState(cooldowns: Record<string, string>) {
  return {
    id: cooldowns[THREAD_ID_KEY] ?? null,
    step: Number(cooldowns[THREAD_STEP_KEY] ?? "0"),
    lastTopic: cooldowns.lastConversationTopic ?? null,
  };
}

function writeThreadState(
  cooldowns: Record<string, string>,
  id: string | null,
  step = 0,
): Record<string, string> {
  const next = { ...cooldowns };

  delete next[THREAD_ID_KEY];
  delete next[THREAD_STEP_KEY];

  if (id) {
    next[THREAD_ID_KEY] = id;
    next[THREAD_STEP_KEY] = String(step);
  }

  return next;
}

function getThread(id: string | null): ConversationThread | null {
  if (!id) return null;

  const daily = DAILY_THREADS.find((thread) => thread.id === id);
  if (daily) return daily;

  return Object.values(EVENT_THREADS).find((thread) => thread.id === id) ?? null;
}

function threadRecentlyUsed(
  thread: ConversationThread,
  cooldowns: Record<string, string>,
  now: Date,
): boolean {
  const last = cooldowns[THREAD_USED_PREFIX + thread.id];
  if (!last) return false;

  return (
    (now.getTime() - new Date(last).getTime()) / 60000 <
    thread.cooldownMinutes
  );
}

function markThreadUsed(
  cooldowns: Record<string, string>,
  thread: ConversationThread,
  now: Date,
): Record<string, string> {
  return {
    ...cooldowns,
    [THREAD_USED_PREFIX + thread.id]: now.toISOString(),
  };
}

function beginThread(
  thread: ConversationThread,
  state: EventState,
  now: Date,
  activity: string,
): AmbientTurnResult {
  const cooldowns = markThreadUsed(
    writeThreadState(state.eventCooldowns, thread.id, 1),
    thread,
    now,
  );
  cooldowns.lastConversationTopic = thread.topic;

  return {
    speaker: thread.turns[0].speaker,
    text: thread.turns[0].text,
    activity,
    nextState: {
      ...state,
      eventCooldowns: cooldowns,
    },
    nextDelayMs: 8500 + Math.floor(Math.random() * 7500),
  };
}

function continueThread(
  thread: ConversationThread,
  state: EventState,
  step: number,
  now: Date,
  activity: string,
): AmbientTurnResult | null {
  const turn = thread.turns[step];
  if (!turn) return null;

  const nextStep = step + 1;
  const finished = nextStep >= thread.turns.length;

  return {
    speaker: turn.speaker,
    text: turn.text,
    activity,
    nextState: {
      ...state,
      activeEvent: finished && thread.id.startsWith("event-")
        ? null
        : state.activeEvent,
      eventExpiresAt: finished && thread.id.startsWith("event-")
        ? null
        : state.eventExpiresAt,
      eventCooldowns: finished
        ? {
            ...writeThreadState(state.eventCooldowns, null),
            lastConversationTopic: thread.topic,
          }
        : writeThreadState(state.eventCooldowns, thread.id, nextStep),
    },
    nextDelayMs: finished
      ? 120000 + Math.floor(Math.random() * 120000)
      : 6500 + Math.floor(Math.random() * 8500),
  };
}

export function simulationScriptedAmbientTurn(params: {
  lastSpeaker?: Speaker;
  desiredSpeaker?: Speaker;
  state: EventState;
  now?: Date;
}): AmbientTurnResult {
  const now = params.now ?? new Date();
  const { hour, dayOfWeek } = manilaClock(now);
  const snapshot = getSimulationDayCycle(now);
  const threadState = readThreadState(params.state.eventCooldowns);

  // Continue an existing conversation before introducing another topic.
  const existingThread = getThread(threadState.id);
  if (existingThread) {
    const continued = continueThread(
      existingThread,
      params.state,
      threadState.step,
      now,
      existingThread.id.startsWith("event-")
        ? existingThread.id.replace("event-", "")
        : snapshot.sharedActivity,
    );

    if (continued) return continued;
  }

  // An active event gets first priority and becomes a coherent mini-thread.
  if (
    params.state.activeEvent &&
    params.state.eventExpiresAt &&
    params.state.eventExpiresAt.getTime() > now.getTime()
  ) {
    const eventThread = EVENT_THREADS[params.state.activeEvent];
    if (eventThread) {
      return beginThread(
        eventThread,
        params.state,
        now,
        eventThread.id.replace("event-", ""),
      );
    }

    const fallbackEvent = SCRIPTED_EVENTS.find(
      (event) => event.id === params.state.activeEvent,
    );

    if (fallbackEvent) {
      const speaker =
        params.lastSpeaker === fallbackEvent.opener
          ? fallbackEvent.opener === "clint"
            ? "maica"
            : "clint"
          : fallbackEvent.opener;

      return {
        speaker,
        text: pick(fallbackEvent.lines[speaker]),
        activity: fallbackEvent.label,
        nextState: params.state,
        nextDelayMs: 14000 + Math.floor(Math.random() * 12000),
      };
    }
  }

  // New random events are still driven by the real clock and weekly rules.
  const eventCandidates = SCRIPTED_EVENTS.filter((event) => {
    if (hour < event.minHour || hour >= event.maxHour) return false;
    if (event.daysOfWeek && !event.daysOfWeek.includes(dayOfWeek)) return false;

    const last = params.state.eventCooldowns[event.id];
    if (
      last &&
      (now.getTime() - new Date(last).getTime()) / 3600000 <
        event.cooldownHours
    ) {
      return false;
    }

    return true;
  });

  for (const event of eventCandidates) {
    if (Math.random() >= event.chancePerTick) continue;

    const eventThread = EVENT_THREADS[event.id];
    const eventCooldowns = {
      ...params.state.eventCooldowns,
      [event.id]: now.toISOString(),
    };

    const eventState: EventState = {
      activeEvent: event.id,
      eventExpiresAt: new Date(
        now.getTime() + event.durationMinutes * 60000,
      ),
      eventCooldowns,
    };

    if (eventThread) {
      return beginThread(eventThread, eventState, now, event.label);
    }
  }

  // Normal life conversation threads are intentionally less frequent than
  // simple fallback lines. This creates pauses between conversations.
  const dailyCandidates = DAILY_THREADS.filter((thread) => {
    if (hour < thread.minHour || hour >= thread.maxHour) return false;
    if (thread.daysOfWeek && !thread.daysOfWeek.includes(dayOfWeek)) return false;
    return !threadRecentlyUsed(
      thread,
      params.state.eventCooldowns,
      now,
    );
  });

  const relatedTopic: Record<string, string[]> = {
    academics: ["leadership", "school", "chess", "banter"],
    school: ["academics", "leadership", "friends", "motorcycle"],
    leadership: ["academics", "school", "banter"],
    music: ["quiet", "motorcycle", "banter"],
    motorcycle: ["school", "music", "family"],
    friends: ["banter", "school", "academics"],
    family: ["quiet", "garden", "school"],
    garden: ["music", "family", "quiet"],
    faith: ["family", "quiet", "school"],
    banter: ["school", "friends", "music"],
    morning: ["family", "school"],
    quiet: ["family", "faith", "banter"],
  };
  const topicMatches = relatedTopic[threadState.lastTopic ?? ""];
  const relatedCandidates = topicMatches?.length
    ? dailyCandidates.filter((thread) => topicMatches.includes(thread.topic))
    : dailyCandidates;

  if (dailyCandidates.length > 0 && (!params.lastSpeaker || Math.random() < 0.78)) {
    const preferred = params.desiredSpeaker
      ? relatedCandidates.filter(
          (thread) => thread.turns[0]?.speaker === params.desiredSpeaker,
        )
      : [];

    const chosen = pick(
      preferred.length > 0
        ? preferred
        : relatedCandidates.length > 0
          ? relatedCandidates
          : dailyCandidates,
    );

    return beginThread(chosen, params.state, now, snapshot.sharedActivity);
  }

  // Quiet fallback. A single line now creates a long pause, rather than
  // immediately causing another unrelated reply.
  const pool =
    ACTIVITY_FILLERS[snapshot.sharedActivity] ??
    ACTIVITY_FILLERS["quiet hours"];

  const speaker =
    params.desiredSpeaker ??
    (params.lastSpeaker === "clint" ? "maica" : "clint");

  return {
    speaker,
    text: pick(pool[speaker]),
    activity: snapshot.sharedActivity,
    nextState: {
      ...params.state,
      eventCooldowns: writeThreadState(params.state.eventCooldowns, null),
    },
    nextDelayMs: 36000 + Math.floor(Math.random() * 55000),
  };
}

export async function simulationScriptedChatReply(params: {
  speaker: Speaker;
  message: string;
  now?: Date;
}): Promise<string> {
  const now = params.now ?? new Date();
  const lowered = params.message.toLowerCase();

  const bank = KEYWORD_BANKS.find((entry) =>
    entry.keywords.some((keyword) => lowered.includes(keyword)),
  );

  if (bank) {
    return pick(bank.lines[params.speaker]);
  }

  if (/riddle|knock|joke|patawa/.test(lowered)) {
    const riddleStarters = [
      "Knock knock",
      "Battery",
      "ALOE VERA",
      "Unsa English sa gamay nga bubuyog?",
    ];
    return params.speaker === "clint"
      ? pick(riddleStarters.slice(0, 2))
      : pick(riddleStarters.slice(1));
  }

  const memories = await simulationMemoryRetriever(params.message, 1);
  if (memories.length > 0) {
    const template = pick(MEMORY_CALLBACK_TEMPLATES[params.speaker]);
    return template.replace("{title}", memories[0].title);
  }

  const snapshot = getSimulationDayCycle(now);
  const pool =
    ACTIVITY_FILLERS[snapshot.sharedActivity] ??
    ACTIVITY_FILLERS["quiet hours"];

  return pick(pool[params.speaker]);
}
