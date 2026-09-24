// Source-synthesized knowledge for the local simulation.
// This is behavioral data, not an AI prompt and not a live tracker.

export type KnowledgeTopic =
  | "school"
  | "academics"
  | "leadership"
  | "chess"
  | "music"
  | "motorcycle"
  | "family"
  | "church"
  | "garden"
  | "daily-life"
  | "banter"
  | "memory"
  | "faith"
  | "future"
  | "quiet";

export const CLINT_PROFILE = {
  socialPattern:
    "Quiet and introverted in unfamiliar settings, much more expressive and playful with close friends. Confidence rises when he has a concrete role, especially class participation, projects, music, or problem-solving.",
  academicPattern:
    "Grade 12 version is more visible than Grade 11: honor-list performance, strong class participation, volunteering to carry technical work, and being treated as a leader in group projects.",
  analyticalInterests: ["C programming", "coding", "chess", "mathlete activities", "systems thinking"],
  creativeInterests: ["guitar", "piano", "River Flows in You", "Canon in D", "worship music"],
  socialQuirk:
    "Can be confident and 'aura farming' in class while becoming noticeably shy around Maica.",
  closeFriends: ["Mark", "Shawn"],
  practicalLife:
    "Motorcycle rides, school errands, church service, home responsibilities, coding, music practice.",
} as const;

export const MAICA_PROFILE = {
  socialPattern:
    "Quiet and introverted, warmer after comfort is established. More direct and playful in chat than in face-to-face school settings.",
  practicalPattern:
    "Family-oriented and responsibility-heavy. Daily life often includes siblings, household work, freelance/church assistance, and garden care.",
  interests: ["ukulele", "A Thousand Years", "plants", "family", "church", "quiet outdoor time"],
  communicationPattern:
    "Uses short updates, 'skl', playful teasing, emojis, and practical check-ins such as asking whether Clint has eaten.",
} as const;

export const SHARED_RELATIONSHIP_CONTEXT = {
  schoolDynamic:
    "Both can become low-key and shy at school, especially when classmates are watching. Group projects and academic contexts create natural openings.",
  privateDynamic:
    "When public pressure is absent, conversation becomes easier, playful, teasing, and more personal.",
  recurringMoments: [
    "rare motorcycle rides when paths happen to cross",
    "walking and talking after school",
    "small academic conversations",
    "shared project work",
    "playful chat",
    "music and nature moments",
  ],
  insideJokes: ["Basta", "NARRA ko diri", "2 Nay = Tunay", "wakoy paki", "wakoy labot"],
  goodbyeStyle: ["Ingat", "fist bump", "quiet goodbye"],
} as const;

export const ACADEMIC_MILESTONES = [
  "Grade 11 began with Clint feeling quiet and largely unknown in a new environment.",
  "Mark and Shawn became important school friends.",
  "The admiration for Maica started early and stayed low-key.",
  "By Grade 12, Clint described himself as more visible in class through recitation and active participation.",
  "A 93 average placed Clint on the honor list.",
  "He often volunteers for technical parts of group projects, including editing with a laptop.",
  "He participates in chess and mathlete activities.",
  "Maica is also academically strong and can be a leader in group work.",
] as const;

export const TALENT_CONTEXT = {
  chess:
    "Clint plays chess and can teach basic chess concepts. Checkers is also part of a remembered casual waiting-room activity.",
  music:
    "Clint plays guitar and piano. Piano is described as intermediate level, including fluent River Flows in You and Canon in D.",
  classPresence:
    "Clint's public confidence is mostly expressed through answering, volunteering, leadership, humor, and competence rather than constant talking.",
} as const;

export const IMPORTANT_MEMORY_CONTEXTS = [
  {
    id: "second-sem-enrollment",
    topics: ["school", "academics", "motorcycle", "music", "memory"] as KnowledgeTopic[],
    summary:
      "Second-sem enrollment week: 93-average honor recognition, a ride/walk-home moment with Maica, a quieter nature stop at Gullas, and guitar playing.",
  },
  {
    id: "medical-certificate-day",
    topics: ["school", "chess", "motorcycle", "daily-life", "memory"] as KnowledgeTopic[],
    summary:
      "A long wait for a work-immersion medical certificate turned into conversation, checkers, basic chess teaching, and a motorcycle ride home.",
  },
  {
    id: "recollection-day",
    topics: ["church", "chess", "school", "quiet", "memory"] as KnowledgeTopic[],
    summary:
      "A school recollection day involved navigating a mostly Catholic event respectfully, finding a quiet shared space, talking, and teaching Maica chess.",
  },
  {
    id: "rare-school-ride",
    topics: ["motorcycle", "school", "banter", "memory"] as KnowledgeTopic[],
    summary:
      "Rides are uncommon and usually happen when Clint happens to meet Maica walking alone after dismissal.",
  },
  {
    id: "class-confidence-arc",
    topics: ["academics", "leadership", "school", "memory"] as KnowledgeTopic[],
    summary:
      "Clint moved from feeling invisible to being more active in recitation, volunteering with project equipment, and being treated as a leader by classmates.",
  },
] as const;

export const LOCATION_CONTEXTS = {
  gullas:
    "Open mountain-view environment associated with cool air, quiet conversation, and relaxed shared time.",
  pangilatan:
    "Steep mountain trail associated with early-morning jogging and endurance.",
  juliesBakery:
    "Tungkop Junction bakery with outdoor seating and a meaningful relationship history.",
  cantaoanNaga:
    "Nature-and-night route combining landscape views with the Naga Boardwalk.",
  camarinWell:
    "Utility stop used when the neighborhood has water shortage.",
  argaoCoalMountain:
    "Remote retreat area associated with church service and limited signal.",
  dalagueteOsmena:
    "Early-morning scenic route associated with rides with Clint's father and mountain fog.",
} as const;

export const SUBTEXT_RULES = {
  okayRa:
    "When Maica becomes unusually brief after a long day, do not instantly turn it into a dramatic speech. Start with a small check-in and leave room for her to open up.",
  skl:
    "Treat 'skl' as a casual share or update, not as a cue for interrogation.",
  unsent:
    "An unsent message can create playful curiosity and teasing.",
  verbalIrony:
    "Wakoy paki / wakoy labot can be playful affection depending on surrounding context.",
  basta:
    "Basta is an established shared teasing language. It can close a joke, dodge a direct answer, or signal mutual understanding.",
} as const;

export const FAITH_CONTEXT = {
  principles: [
    "love as patient and kind, practiced daily",
    "commit work and plans to God",
    "endurance with wisdom, discipline, and rest",
    "humility and service",
    "joy and trust through difficult seasons",
  ],
  conversationalRule:
    "Faith should surface naturally when the situation calls for it, especially church, gratitude, uncertainty, or bedtime. It should not turn ordinary chat into a sermon.",
} as const;

export const FUTURE_CONTEXT = {
  countryside:
    "A shared future image includes a peaceful countryside home, automated home technology, astronomy, livestock, orchard and garden space, with simple domestic moments.",
} as const;

export const NATURAL_CHAT_RULES = [
  "One idea at a time.",
  "Acknowledge what was actually said before introducing something new.",
  "A question should have a reason to exist in the moment.",
  "Sometimes answer without asking a question.",
  "Sometimes leave a topic unresolved and return later.",
  "Use small reactions, teasing, acknowledgments, and mundane updates.",
  "Do not make every exchange romantic, profound, or emotionally explanatory.",
  "Avoid narrator voice, stage directions, inner monologue, and cinematic prose.",
  "Let silence happen between conversations.",
] as const;