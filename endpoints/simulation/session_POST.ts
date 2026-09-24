import superjson from "superjson";
import { nanoid } from "nanoid";
import { db } from "../../helpers/db";
import type { OutputType } from "./session_POST.schema";

export async function handle(): Promise<Response> {
  const sessionId = "sim_" + nanoid(16);
  const starterPairs = [
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

  const chosenStarter = starterPairs[Math.floor(Math.random() * starterPairs.length)];
  const now = Date.now();
  const createdMessages = [];

  for (let i = 0; i < chosenStarter.length; i++) {
    const item = chosenStarter[i];
    const messageId = "msg_" + nanoid(16);
    const createdAt = new Date(now - (chosenStarter.length - i) * 60000);
    await db.insertInto("simulationMessages").values({
      messageId,
      sessionId,
      speaker: item.speaker,
      text: item.text,
      source: "simulation",
      interactionId: "starter_" + nanoid(8),
      createdAt,
    }).execute();

    createdMessages.push({
      messageId,
      speaker: item.speaker,
      text: item.text,
      source: "simulation" as const,
      interactionId: "starter_" + nanoid(8),
      createdAt: createdAt.toISOString(),
    });
  }

  const result = await db.insertInto("simulationSessions").values({
    sessionId,
    world: "living-room",
    clintMood: "reflective",
    maicaMood: "warm",
    currentActivity: "sitting together",
    activeMusic: null,
  }).returningAll().executeTakeFirstOrThrow();

  const output: OutputType = {
    sessionId: result.sessionId,
    world: result.world,
    clintMood: result.clintMood,
    maicaMood: result.maicaMood,
    currentActivity: result.currentActivity,
    activeMusic: result.activeMusic,
    messages: createdMessages,
  };

  return new Response(superjson.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
}