import { nanoid } from "nanoid";
import { getSimulationDayCycle } from "./simulationDayCycle";
import { musicLibrary } from "./musicLibrary";
import type { Speaker } from "./simulationConversationThreads";

export type ClientMessage = {
  messageId: string;
  speaker: Speaker;
  text: string;
  source: string;
  interactionId: string | null;
  createdAt: string;
};

export type ClientSessionOutput = {
  sessionId: string;
  world: string;
  clintMood: string;
  maicaMood: string;
  currentActivity: string;
  activeMusic: string | null;
  messages: ClientMessage[];
};

const STARTER_PAIRS = [
  [
    { speaker: "maica" as const, text: "Skl lovey, para jud tayong compound interest ba 🌱" },
    { speaker: "clint" as const, text: "Solid ang growth araw-araw... tas pag ikaw ang kahati, mas dodoble pa hahahaha." },
    { speaker: "maica" as const, text: "Hehe basta nag-unongay ta sa tanan 🤍" },
  ],
  [
    { speaker: "clint" as const, text: "5:21 AM sa Osmeña Peak fog uban ni Papa palit utan... grabe to sauna pero grateful ko sa training." },
    { speaker: "maica" as const, text: "Mao nay naghimo nimo nga responsable ug lig-on kaayo karon lovey. Proud ko nimo 🤎" },
  ],
  [
    { speaker: "maica" as const, text: "Kahinumdom paka atong sa Julie's Bakeshop sa Tungkop lovey? May 31." },
    { speaker: "clint" as const, text: "Oo naman, di jud to makalimtan... ikaw jud akong gipili ug barugan. Worth fighting for jud." },
  ],
  [
    { speaker: "clint" as const, text: "222-88-8-33 6-66... decode sa keypad dali hahaha" },
    { speaker: "maica" as const, text: "C-U-T-E M-O na pud? Hahaha korni nimo choy pero sige cute 😂" },
  ],
];

// Ephemeral in-memory fallback cache (non-authoritative; canonical state is Supabase)
let ephemeralSession: ClientSessionOutput | null = null;

/**
 * Creates an ephemeral fallback session when backend network is temporarily unreachable.
 * Canonical simulation state is stored in Supabase.
 */
export function getOrCreateClientSession(preferredId?: string | null): ClientSessionOutput {
  if (ephemeralSession && (!preferredId || ephemeralSession.sessionId === preferredId)) {
    return ephemeralSession;
  }

  const sessionId = preferredId || "sim_" + nanoid(14);
  const chosenStarter = STARTER_PAIRS[Math.floor(Math.random() * STARTER_PAIRS.length)];
  const now = Date.now();
  const dayCycle = getSimulationDayCycle();

  const messages: ClientMessage[] = chosenStarter.map((item, index) => ({
    messageId: "msg_" + nanoid(12),
    speaker: item.speaker,
    text: item.text,
    source: "simulation",
    interactionId: "starter_" + index,
    createdAt: new Date(now - (chosenStarter.length - index) * 60000).toISOString(),
  }));

  ephemeralSession = {
    sessionId,
    world: "living-room",
    clintMood: "reflective",
    maicaMood: "warm",
    currentActivity: "Sitting together · " + dayCycle.sharedActivity,
    activeMusic: null,
    messages,
  };

  return ephemeralSession;
}

export function runClientSimulationTick(
  sessionId: string,
  preferredSpeaker?: Speaker
): {
  message: ClientMessage;
  currentActivity: string;
  nextDelayMs: number;
} {
  const session = getOrCreateClientSession(sessionId);
  const lastSpeaker = session.messages.at(-1)?.speaker;
  const nextSpeaker: Speaker =
    preferredSpeaker ?? (lastSpeaker === "clint" ? "maica" : "clint");

  const messageText =
    nextSpeaker === "clint"
      ? "Narra ko diri lovey, pahuway lang kung kapoy."
      : "Salamat kaayo mylabs... safe space jud tika pirmi 🤎";

  const messageId = "msg_" + nanoid(12);
  const createdAt = new Date().toISOString();
  const currentActivity = (nextSpeaker === "clint" ? "Clint" : "Maica") + " is speaking";

  const newMessage: ClientMessage = {
    messageId,
    speaker: nextSpeaker,
    text: messageText,
    source: "simulation",
    interactionId: "tick_" + nanoid(8),
    createdAt,
  };

  session.messages.push(newMessage);
  session.currentActivity = currentActivity;

  return {
    message: newMessage,
    currentActivity,
    nextDelayMs: 45000,
  };
}

export function sendClientSimulationChat({
  sessionId,
  speaker,
  message,
}: {
  sessionId: string;
  speaker: Speaker;
  message: string;
  world?: string;
}): {
  userMessageId: string;
  responseMessageId: string;
  message: string;
  speaker: Speaker;
  interactionId: string;
} {
  const session = getOrCreateClientSession(sessionId);
  const userMessageId = "msg_" + nanoid(12);
  const responseMessageId = "msg_" + nanoid(12);
  const responder: Speaker = speaker === "clint" ? "maica" : "clint";

  const replyText =
    responder === "clint"
      ? "Kabalo ka lovey, bisan unsa pa kalisud ang adlaw, worth fighting for jud ta kanunay."
      : "Hoy choy! Ayaw palabi kaguol ha, unongay jud ta sa tanan.";

  const now = new Date().toISOString();

  session.messages.push({
    messageId: userMessageId,
    speaker,
    text: message,
    source: "user",
    interactionId: null,
    createdAt: now,
  });

  session.messages.push({
    messageId: responseMessageId,
    speaker: responder,
    text: replyText,
    source: "simulation",
    interactionId: "reply_" + nanoid(8),
    createdAt: now,
  });

  session.currentActivity = (responder === "clint" ? "Clint" : "Maica") + " is speaking";

  return {
    userMessageId,
    responseMessageId,
    message: replyText,
    speaker: responder,
    interactionId: "reply_" + nanoid(8),
  };
}

export function updateClientSimulationMusic(
  sessionId: string,
  trackId: string
): {
  trackId: string;
  currentActivity: string;
  messages: ClientMessage[];
} {
  const session = getOrCreateClientSession(sessionId);
  const track = musicLibrary.find((m) => m.id === trackId);
  const currentActivity = track ? "Listening to " + track.title : "Listening to music";
  session.activeMusic = trackId;
  session.currentActivity = currentActivity;
  return {
    trackId,
    currentActivity,
    messages: [],
  };
}

export function updateClientSimulationWorld(
  sessionId: string,
  world: "living-room" | "music-room"
): {
  world: "living-room" | "music-room";
  currentActivity: string;
} {
  const session = getOrCreateClientSession(sessionId);
  session.world = world;
  const currentActivity =
    world === "music-room"
      ? "Walking into Music World"
      : "Settling into the Living Room";
  session.currentActivity = currentActivity;
  return { world, currentActivity };
}
