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

const STORAGE_KEY = "ating-simulation-local-store-v2";

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
  [
    { speaker: "maica" as const, text: "Narra ko diri lovey ha kung kapoy ka." },
    { speaker: "clint" as const, text: "Salamat kaayo lovey... mao jud nay akong safe space pirmi." },
  ],
];

const AMBIENT_DIALOGUES = [
  {
    speaker: "maica" as const,
    text: "Mylabs, nakainom na kag tubig diha? Ayaw sigeg code nga di magpahuway ha.",
    activity: "Maica is reminding Clint to hydrate",
  },
  {
    speaker: "clint" as const,
    text: "Opo mylabs, nagpahuway kadiyot gikan sa algorithmic loops. Kumusta imoha tanom?",
    activity: "Clint is checking in on Maica",
  },
  {
    speaker: "maica" as const,
    text: "Namukhad na ang bag-ong dahon sa orchids lovey! Nihunong kadiyot ang ulan.",
    activity: "Maica is tending the garden",
  },
  {
    speaker: "clint" as const,
    text: "2 Nay = ? Hahaha hulaan mo dali.",
    activity: "Clint is teasing Maica with wordplay",
  },
  {
    speaker: "maica" as const,
    text: "Tunay! Kahibaw nako ana lovey oy, karaan na kaayo na hahaha 🌸",
    activity: "Maica is laughing at Clint's inside joke",
  },
  {
    speaker: "clint" as const,
    text: "Kahinumdom ko atong Canon in D sa piano... sunod tukar nako puhon para nimo.",
    activity: "Clint is practicing piano chords",
  },
  {
    speaker: "maica" as const,
    text: "Mag-ukulele pud ko sa A Thousand Years lovey, duet nya ta hehe.",
    activity: "Maica is strumming ukulele",
  },
  {
    speaker: "clint" as const,
    text: "Romans 8:1 permi ta magsalig lovey. Walay kahadlok kay naa Siya nag-guide nato.",
    activity: "Sharing scriptures and quiet faith",
  },
  {
    speaker: "maica" as const,
    text: "Puhon atong bukid homestead naay telescope lovey ha, mag-stargaze ta kada gabii ✨",
    activity: "Dreaming about the countryside homestead",
  },
  {
    speaker: "clint" as const,
    text: "Ug automated solar hydroponics garden para sa imong mga kamatis ug talong!",
    activity: "Designing smart garden systems",
  },
];

type StoredData = {
  sessions: Record<string, ClientSessionOutput>;
};

function readStore(): StoredData {
  if (typeof window === "undefined") {
    return { sessions: {} };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: {} };
    return JSON.parse(raw);
  } catch {
    return { sessions: {} };
  }
}

function writeStore(data: StoredData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Could not save to localStorage:", err);
  }
}

export function getOrCreateClientSession(preferredId?: string | null): ClientSessionOutput {
  const store = readStore();
  if (preferredId && store.sessions[preferredId]) {
    return store.sessions[preferredId];
  }

  // Create new session
  const sessionId = preferredId || "sim_" + nanoid(14);
  const chosenStarter = STARTER_PAIRS[Math.floor(Math.random() * STARTER_PAIRS.length)];
  const now = Date.now();
  const dayCycle = getSimulationDayCycle();

  const messages: ClientMessage[] = chosenStarter.map((item, index) => ({
    messageId: "msg_" + nanoid(14),
    speaker: item.speaker,
    text: item.text,
    source: "simulation",
    interactionId: "starter_" + nanoid(8),
    createdAt: new Date(now - (chosenStarter.length - index) * 60000).toISOString(),
  }));

  const session: ClientSessionOutput = {
    sessionId,
    world: "living-room",
    clintMood: "reflective",
    maicaMood: "warm",
    currentActivity: dayCycle.sharedActivity,
    activeMusic: null,
    messages,
  };

  store.sessions[sessionId] = session;
  writeStore(store);
  return session;
}

export function runClientSimulationTick(sessionId: string, preferredSpeaker?: Speaker): {
  message: ClientMessage;
  currentActivity: string;
  nextDelayMs: number;
} {
  const store = readStore();
  const session = store.sessions[sessionId] || getOrCreateClientSession(sessionId);

  const lastSpeaker = session.messages.at(-1)?.speaker;
  const targetSpeaker = preferredSpeaker || (lastSpeaker === "clint" ? "maica" : "clint");

  // Pick suitable ambient line
  const candidates = AMBIENT_DIALOGUES.filter((d) => d.speaker === targetSpeaker);
  const picked = candidates[Math.floor(Math.random() * candidates.length)] || AMBIENT_DIALOGUES[0];

  const now = new Date();
  const newMsg: ClientMessage = {
    messageId: "msg_" + nanoid(14),
    speaker: picked.speaker,
    text: picked.text,
    source: "simulation",
    interactionId: "ambient_" + nanoid(8),
    createdAt: now.toISOString(),
  };

  session.messages.push(newMsg);
  if (session.messages.length > 100) {
    session.messages = session.messages.slice(-100);
  }
  session.currentActivity = picked.activity;

  store.sessions[sessionId] = session;
  writeStore(store);

  return {
    message: newMsg,
    currentActivity: picked.activity,
    nextDelayMs: 25000 + Math.floor(Math.random() * 20000),
  };
}

export function sendClientSimulationChat(params: {
  sessionId: string;
  speaker: Speaker;
  message: string;
  world?: string;
}): {
  userMessageId: string;
  responseMessageId: string;
  speaker: Speaker;
  message: string;
  interactionId: string;
} {
  const store = readStore();
  const session = store.sessions[params.sessionId] || getOrCreateClientSession(params.sessionId);

  const now = new Date();
  const userMessageId = "msg_" + nanoid(14);
  const responseMessageId = "msg_" + nanoid(14);
  const interactionId = "chat_" + nanoid(8);

  const userMsg: ClientMessage = {
    messageId: userMessageId,
    speaker: params.speaker,
    text: params.message,
    source: "user",
    interactionId: null,
    createdAt: now.toISOString(),
  };
  session.messages.push(userMsg);

  // Generate authentic reply
  const lowered = params.message.toLowerCase();
  let replyText = "";

  if (params.speaker === "clint") {
    // Clint is responding to user/simulation
    if (lowered.includes("kamusta") || lowered.includes("kumusta") || lowered.includes("how are you")) {
      replyText = "Maayo ra kaayo diri lovey. Nag-refactor ug code kadiyot unya paminaw sa imong updates.";
    } else if (lowered.includes("gugma") || lowered.includes("love") || lowered.includes("palangga")) {
      replyText = "Palangga kaayo tika lovey... unongay jud ta kanunay. Compound interest jud atong gugma.";
    } else if (lowered.includes("kaon") || lowered.includes("food") || lowered.includes("gutom")) {
      replyText = "Bag-o ra human kaon lovey! Ikaw pud diha ayaw sige skip sa kaon ha.";
    } else if (lowered.includes("music") || lowered.includes("kanta") || lowered.includes("song")) {
      replyText = "Ganahan ko magpatukar ug Canon in D or River Flows in You karon... calming kaayo.";
    } else if (lowered.includes("joke") || lowered.includes("katawa") || lowered.includes("riddle")) {
      replyText = "2 Nay = Tunay hahahaha! Kahibaw nako korni pero basta ikaw mukatawa, payts na.";
    } else {
      replyText = "Sakto jud na lovey... paminaw ko nimo pirmi diri. Narra ko nimo bisag kanus-a.";
    }
  } else {
    // Maica is responding
    if (lowered.includes("kamusta") || lowered.includes("kumusta") || lowered.includes("how are you")) {
      replyText = "Busy gamay sa balay ug mga tanom lovey, pero malipayon pirmi basta makabati nimo 🌸";
    } else if (lowered.includes("gugma") || lowered.includes("love") || lowered.includes("palangga")) {
      replyText = "Love kaayo tika lovey, amping kanunay diha ha. Proud kaayo ko nimo.";
    } else if (lowered.includes("kaon") || lowered.includes("food") || lowered.includes("gutom")) {
      replyText = "Nag-luto ko tinola with kamunggay ganiha hehe, lami kaayo! Kaon pud ug tarong ha.";
    } else if (lowered.includes("music") || lowered.includes("kanta") || lowered.includes("song")) {
      replyText = "Tugtogan tika sa akong ukulele ug A Thousand Years puhon lovey hehe.";
    } else if (lowered.includes("joke") || lowered.includes("katawa") || lowered.includes("riddle")) {
      replyText = "Hahaha choy kaayo ka uy! Korni pero cute man pud gamay 😂";
    } else {
      replyText = "Skl lovey, ganahan ko makig-storya nimo. Basta kuyog ta sa tanan, lig-on kaayo ta.";
    }
  }

  const responseMsg: ClientMessage = {
    messageId: responseMessageId,
    speaker: params.speaker,
    text: replyText,
    source: "simulation",
    interactionId,
    createdAt: new Date(now.getTime() + 800).toISOString(),
  };
  session.messages.push(responseMsg);

  if (session.messages.length > 100) {
    session.messages = session.messages.slice(-100);
  }
  session.currentActivity = params.speaker === "clint" ? "Clint answered gently" : "Maica responded with warmth";

  store.sessions[params.sessionId] = session;
  writeStore(store);

  return {
    userMessageId,
    responseMessageId,
    speaker: params.speaker,
    message: replyText,
    interactionId,
  };
}

export function updateClientSimulationWorld(sessionId: string, world: string): {
  world: string;
  currentActivity: string;
} {
  const store = readStore();
  const session = store.sessions[sessionId] || getOrCreateClientSession(sessionId);
  session.world = world;
  session.currentActivity = world === "music-room" ? "Exploring soundtracks in Music Room" : "Relaxing together in Living Room";
  store.sessions[sessionId] = session;
  writeStore(store);
  return {
    world,
    currentActivity: session.currentActivity,
  };
}

export function updateClientSimulationMusic(sessionId: string, trackId: string | null): {
  activeMusic: string | null;
  currentActivity: string;
} {
  const store = readStore();
  const session = store.sessions[sessionId] || getOrCreateClientSession(sessionId);
  session.activeMusic = trackId;
  const track = musicLibrary.find((t) => t.id === trackId);
  session.currentActivity = track ? `Listening to ${track.title}` : "Soundtrack silent";
  store.sessions[sessionId] = session;
  writeStore(store);
  return {
    activeMusic: trackId,
    currentActivity: session.currentActivity,
  };
}
