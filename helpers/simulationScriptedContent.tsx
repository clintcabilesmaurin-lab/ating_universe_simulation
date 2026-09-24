// Hardcoded content bank for the scripted (non-AI) simulation engine.
// This replaces live Gemini calls with a local random-event state machine
// and canned dialogue pools, so the app runs with zero per-message API cost.
//
// Scope note: intentionally excludes anything health-specific, financial-hardship
// specific, or a literal real-time location/itinerary log. Place names appear only
// as flavor text, not as a live "where is she right now" tracker.

export type Speaker = "clint" | "maica";

export type ScriptedEvent = {
  id: string;
  label: string;
  minHour: number;
  maxHour: number;
  daysOfWeek?: number[]; // 0 = Sunday ... 6 = Saturday
  chancePerTick: number;
  cooldownHours: number;
  durationMinutes: number;
  opener: Speaker;
  lines: Record<Speaker, string[]>;
};

export const SCRIPTED_EVENTS: ScriptedEvent[] = [
  {
    id: "brownout",
    label: "Brownout",
    minHour: 18,
    maxHour: 23,
    chancePerTick: 0.15,
    cooldownHours: 20,
    durationMinutes: 25,
    opener: "maica",
    lines: {
      maica: [
        "Brownout na sad lovey hehe",
        "Lagi ha, pag lingkod² ra nako sa amo ni brownout kalit 😅",
        "Init kaayo ani, wala jud koy fan karon lovey",
      ],
      clint: [
        "Batia ois hahah, pag abot dayun nako sa pultahan, na-brownout ois",
        "Sige lang, mag-candle lang ta hahaha",
        "Alimuot no? Tan-awa ra sad ta sa bituon samtang wala kuryente",
      ],
    },
  },
  {
    id: "water_shortage",
    label: "Water shortage",
    minHour: 5,
    maxHour: 9,
    chancePerTick: 0.1,
    cooldownHours: 72,
    durationMinutes: 20,
    opener: "clint",
    lines: {
      clint: [
        "Mag-sag-ob diay mi ron lovey, mangita mi ug puso, pila na ka adlaw wala agas diri 😅",
        "Nag ligo pud ko sa tubig gikan sa poso hahaha work-out na sad ni",
      ],
      maica: [
        "Alaot kaayo, ayaw lang paghago kaayo ha, pahulay usa",
        "Amo pud walay agas usahay, kasabot ko sa imong hagok hahaha",
      ],
    },
  },
  {
    id: "unsent_message",
    label: "Unsent message",
    minHour: 21,
    maxHour: 24,
    chancePerTick: 0.05,
    cooldownHours: 8,
    durationMinutes: 8,
    opener: "clint",
    lines: {
      clint: [
        "Napindot lang, madulas akong kamay hahahahahah",
        "Ay sori na-unsend, wala ra na importante hahaha",
      ],
      maica: [
        "Sa unsa nga paagi na-pindot mo 'ang lz'? Haha give me valid reason hahahaha",
        "Suspicious ka ana ha, unsa diay gi-type nimo hahaha",
      ],
    },
  },
  {
    id: "videoke_night",
    label: "Saturday videoke",
    minHour: 20,
    maxHour: 23,
    daysOfWeek: [6],
    chancePerTick: 0.5,
    cooldownHours: 20,
    durationMinutes: 30,
    opener: "clint",
    lines: {
      clint: [
        "Nagvideoke na sad si Papa, brokenhearted na sad songs hahaha para siya duna'y lovelife problem",
        "Grabe, sunod na siya kanta niya og sunog-sunog na ang boses hahaha",
      ],
      maica: [
        "Hahaha bless him, sabayi na lang siya sa background",
        "Amo pud gina-videoke sometimes, pero mas gusto nako ukulele hehe",
      ],
    },
  },
  {
    id: "nanay_lights",
    label: "Nanay turns the lights on",
    minHour: 19,
    maxHour: 22,
    chancePerTick: 0.15,
    cooldownHours: 20,
    durationMinutes: 20,
    opener: "maica",
    lines: {
      maica: [
        "Gi-sindihan sad ko ni Nanay sa suga, gusto pa niya mangutana unsa akong gibasa hehe",
        "Si Nanay naa gihapon sa iyang mga tigulang stories, cute siya oi, 91 na siya pero sharp pa",
      ],
      clint: [
        "Awts, cute na siya bala, pamatia lang tan-awa unsa iyang istorya",
        "Bless si Nanay, respetoha lang siya, dugay ra na siya makauban",
      ],
    },
  },
  {
    id: "meta_ai_banter",
    label: "Meta AI code banter",
    minHour: 23,
    maxHour: 24,
    chancePerTick: 0.12,
    cooldownHours: 10,
    durationMinutes: 15,
    opener: "clint",
    lines: {
      clint: [
        "@Meta AI decode ni: 01100100 01101001 01110011 hahaha try tag-ana ka",
        "Testing lang ko ani nga if-else logic sa C, murag pareha ra sa atong dula hahaha",
      ],
      maica: [
        "@Meta AI readable man diay, kay ana man jud na si lovey dw hahaha",
        "Grabe ka techy uy, pero ganahan ko ani nimo hahaha",
      ],
    },
  },
  {
    id: "mothers_day_twist",
    label: "Sunday service surprise",
    minHour: 8,
    maxHour: 12,
    daysOfWeek: [0],
    chancePerTick: 0.08,
    cooldownHours: 144,
    durationMinutes: 20,
    opener: "clint",
    lines: {
      clint: [
        "Gi-tawag ko sa Pastor og biglaan para mag-message, wala ko giandam hahaha nervous ko",
        "Ni-cry akong mama sa akong gisulti kanina, wala jud ko gitiman-an ana",
      ],
      maica: [
        "Awww proud ko nimo lovey, sigurado maayo ra imong gisulti",
        "God really uses unscripted moments, ana ra pud na siya kanunay hehe",
      ],
    },
  },
];

export const RIDDLES: { starter: Speaker; exchange: { speaker: Speaker; text: string }[] }[] = [
  {
    starter: "clint",
    exchange: [
      { speaker: "clint", text: "Knock knock" },
      { speaker: "maica", text: "Who's there?" },
      { speaker: "clint", text: "Egg" },
      { speaker: "clint", text: "Egg who? I'm eggcited to meet you hahaha" },
    ],
  },
  {
    starter: "maica",
    exchange: [
      { speaker: "maica", text: "Battery" },
      { speaker: "clint", text: "Battery who?" },
      { speaker: "maica", text: "Battery low man akong cellphone, peru ikaw? 100% permi sakong heart hehe" },
    ],
  },
  {
    starter: "maica",
    exchange: [
      { speaker: "maica", text: "ALOE VERA" },
      { speaker: "clint", text: "Aloe vera who?" },
      { speaker: "maica", text: "ALOE u VERA much! 🤭" },
    ],
  },
  {
    starter: "maica",
    exchange: [
      { speaker: "maica", text: "Unsa English sa gamay nga bubuyog?" },
      { speaker: "clint", text: "Unsa man?" },
      { speaker: "maica", text: "BEE-by (baby)! Ang dako nga bubuyog kay jolliBEE! hahaha" },
    ],
  },
];

export const MORNING_GREETING = {
  maicaOpen: ["Good morning lovey 😊", "Morning lovey", "Morning na lovey, kaon na sad ka ha"],
  clintReply: ["Good morning lovey.. 😊", "Good morning my loves hehehe ☺️", "Morning lovey, dungan ta kaon ha"],
};

// Ambient filler lines keyed by the "shared" activity label from simulationDayCycle.
export const ACTIVITY_FILLERS: Record<string, Record<Speaker, string[]>> = {
  "quiet hours": {
    clint: ["Dungan ta sleep my lovey", "Goodnight lovey, ingat ha", "Pray tayo bago matulog"],
    maica: ["Goodnight lovey, mahal kita", "Sige, tulog na ta, ingat pud ka", "Amen, goodnight na 🤎"],
  },
  "early morning rhythm": {
    clint: ["Ready na ko mag-ready for the day", "Ge-stretch usa ko medyo", "Naa koy gi-check na small task karon"],
    maica: ["Nag-tan-aw ko sa mga tanom kanina", "Ni-jog gamay ko earlier hehe", "Nag-tabang ko sa mga bata mag-andam"],
  },
  "morning at home": {
    clint: ["Nag-breakfast na ko", "Nag-check ko unsa akong schedule karon", "Ge-andam na akong mga notes"],
    maica: ["Nag-tabang ko sa breakfast", "Gi-check nako akong mga igsoon", "Nag-start na mi sa balay"],
  },
  "weekday responsibilities": {
    clint: ["Naa koy class karon, mag-focus usa ko", "Nag-review ko sa notes", "Naa koy gi-debug nga small bug hehe"],
    maica: ["Naa koy freelance task karon", "Mag-errand usa ko sa lungsod", "Nag-check ko sa mga requirements"],
  },
  "midday pause": {
    clint: ["Lunch break na, kaon usa", "Medyo tired pero okay ra", "Short rest usa before mo-continue"],
    maica: ["Kaon na sad ta lovey", "Nag lunch break sad ko", "Nagpahuway gamay after kaon"],
  },
  "afternoon work": {
    clint: ["Deep in a coding task karon, medyo challenging pero fun", "Nag-test ko sa akong small project", "Naa koy stubborn bug, mag-figure out ko"],
    maica: ["Naa koy gina-sort na task list", "Nag-errand ko sa lungsod", "Freelance work pa gihapon karon"],
  },
  "late afternoon": {
    clint: ["Nag calisthenics ko kanina, lain akong braso hahaha", "Gamay stretch usa ko", "Reset lang before ang gabii"],
    maica: ["Nag-check ko sa akong garden, tubo na ang eggplants", "Ge-water nako ang tomatoes", "Nag-duyan-duyan ko medyo, ganahan ko ani nga oras"],
  },
  "evening routine": {
    clint: ["Naa koy church work karon", "Nag-practice ko sa music", "Nag-settle na ko sa balay"],
    maica: ["Church work sad ko karon", "Nag-tabang ko sa balay", "Family time una before matulog"],
  },
  "slow evening": {
    clint: ["Nag-code ko while naay music", "Naa koy gi-play around nga small project", "Quiet keyboard time lang karon"],
    maica: ["Nag-practice ko sa ukulele, A Thousand Years pa gihapon hehe", "Nag-lingkod lang ko sa gawas medyo", "Quiet time lang ko karon"],
  },
  "winding down": {
    clint: ["Ge-close nako akong tabs", "Naa lang gamay na task ma-check", "Medyo ge slow down na ko"],
    maica: ["Ge-ayo nako ang mga butang", "Ge-check nako ang tomorrow", "Quiet time na lang ko karon"],
  },
  "Sunday morning": {
    clint: ["Ge-check nako akong music gear para sa service", "Ge-andam na ko para sa service", "Nag-run through ko sa usa ka song"],
    maica: ["Ge-andam na ko", "Nag-tabang ko sa balay usa", "Ge-prepare na ko para sa service"],
  },
  "church and community": {
    clint: ["Nag-serve ko sa music karon", "Naa koy youth work sa church", "Sa church service pa ko karon"],
    maica: ["Sa church service pa ko", "Ge-tabangan nako ang church work", "Community time karon"],
  },
  "family time": {
    clint: ["Nag-kaon mi with family", "Slow afternoon lang karon", "Nagpahuway usa after service"],
    maica: ["Family lunch karon", "Nag-tabang ko sa balay", "Ge-catch up nako akong pamilya"],
  },
  "slow Sunday afternoon": {
    clint: ["Quiet coding lang karon", "Nag-take a break ko gamay", "Naa'y music sa background samtang nagcode"],
    maica: ["Garden time karon", "Home chores lang", "Quiet afternoon lang gyud"],
  },
  "evening service rhythm": {
    clint: ["Church follow-up karon", "Nag-practice ko sa music", "Ge-check nako akong tomorrow's tasks"],
    maica: ["Church follow-up sad ko", "Family time karon", "Ge-andam na nako ang mga butang"],
  },
  "quiet evening": {
    clint: ["Small coding task lang", "Nag-play ko ug music", "Ge slow down na ko"],
    maica: ["Ukulele practice pa gihapon", "Quiet time lang", "Ge-andam na ko matulog"],
  },
};

// Keyword-triggered banks for the direct chat endpoint (best-effort local matching,
// no external model call). Falls back to the activity filler when nothing matches.
export const KEYWORD_BANKS: { keywords: string[]; lines: Record<Speaker, string[]> }[] = [
  {
    keywords: ["good morning", "gud am", "morning na", "goodmorning"],
    lines: { maica: MORNING_GREETING.maicaOpen, clint: MORNING_GREETING.clintReply },
  },
  {
    keywords: ["kumusta", "kamusta", "how are you", "musta"],
    lines: {
      clint: ["Okay ra ko lovey, ikaw? Musta imong adlaw?", "Fine ra ko, medyo busy lang. Ikaw kumusta?"],
      maica: ["Okay ra ko lovey hehe, ikaw kumusta?", "Naa lang, normal nga adlaw. Ikaw?"],
    },
  },
  {
    keywords: ["kaon", "eat", "kain", "hungry", "gutom"],
    lines: {
      maica: ["Ni-kaon na ka mylabs?", "Kaon usa ka ha, ayaw skip"],
      clint: ["Ni-kaon na ko, ikaw ba?", "Kaon usa ta, dungan ta"],
    },
  },
  {
    keywords: ["riddle", "joke", "patawa", "knock knock"],
    lines: {
      clint: ["Sige, knock knock!"],
      maica: ["Sige, riddle time! Battery..."],
    },
  },
  {
    keywords: ["pray", "prayer", "god", "lord", "jehovah"],
    lines: {
      clint: ["Pray tayo, ipasa lang nato sa Iya ang tanan", "Amen, trust lang ta sa plano Niya"],
      maica: ["Amen lovey, salamat kay naa ka nag-uban nako mag-pray", "Ge-commit lang nato sa Ginoo tanan"],
    },
  },
  {
    keywords: ["miss you", "miss ta", "lonely", "gimingaw"],
    lines: {
      clint: ["Gimingaw sad ko nimo lovey", "Ge miss tika, pero dinhi ra ko permi para nimo"],
      maica: ["Gimingaw ko nimo lovey 🤎", "Ge miss tika sad, sige ra ta mag-text"],
    },
  },
  {
    keywords: ["good night", "goodnight", "matulog", "sleep na", "tulog"],
    lines: { clint: ACTIVITY_FILLERS["quiet hours"].clint, maica: ACTIVITY_FILLERS["quiet hours"].maica },
  },
  {
    keywords: ["okay ra", "okay lang", "wala ra"],
    lines: {
      clint: ["Okay ra, pero sure ka? If kapoy ka, pwede ra ka mu-storya.", "Okay ra lovey. Naa ra ko diri."],
      maica: ["Okay ra ko hehe, ikaw kumusta?", "Wala ra lovey, normal day lang."],
    },
  },
  {
    keywords: ["skl", "share ko lang"],
    lines: {
      clint: ["Sige, share lang. Unsay nahitabo?", "Go, paminawon tika hehe."],
      maica: ["Skl lang lovey hehe", "Share ko lang, mao ni nahitabo karon."],
    },
  },
  {
    keywords: ["basta"],
    lines: {
      clint: ["Basta 😂", "Kabalo naman ka sa basta nako hahaha"],
      maica: ["Basta jud hahaha", "Wala ra. Basta. 🤭"],
    },
  },
  {
    keywords: ["narra"],
    lines: {
      clint: ["NARRA ko diri, paminawon tika.", "Naa ra ko diri lovey."],
      maica: ["Hahaha NARRA na pud ka.", "Okay mylabs, storya ko."],
    },
  },
  {
    keywords: ["chess", "checkers"],
    lines: {
      clint: ["Sige dula ta. Ayaw lang reklamo if tudloan tika hahaha.", "Pwede, practice ta."],
      maica: ["Sige pero hinay-hinay lang ko hahaha.", "Okay, tudloan ko nimo? 🤭"],
    },
  },
  {
    keywords: ["piano", "river flows", "canon in d", "guitar", "ukulele"],
    lines: {
      clint: ["Nag-practice ko gamay karon.", "Ganahan ko magpatukar usahay, maka-reset."],
      maica: ["A Thousand Years pa gihapon ako hehe.", "Music lang sa ko kadali."],
    },
  },
];

// Used when a chat message doesn't match a keyword bank but does match an
// archived memory (via simulationMemoryRetriever). {title} is substituted
// with the matched memory's title so the reply feels like a real callback
// without needing any live AI generation.
export const MEMORY_CALLBACK_TEMPLATES: Record<Speaker, string[]> = {
  clint: [
    "Naa ba ta nag-istorya ana? '{title}' oy, nindot japon hunahunaon 😊",
    "Uy, na-remind ko sa '{title}' kanina hahaha",
    "That reminds me sa '{title}', ganahan ko ana nga memory nato",
  ],
  maica: [
    "Awts na-miss ko '{title}' hehe",
    "Uy oo, kabalo ka pa diay ana? '{title}' jud 🤎",
    "Ge-recall nako '{title}' kanina, sweet japon na hunahunaon",
  ],
};