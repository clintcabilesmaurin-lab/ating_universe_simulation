export type RoutineAgent = "clint" | "maica" | "both";

export type RoutineSnapshot = {
  dateLabel: string;
  timeLabel: string;
  dayLabel: string;
  clintActivity: string;
  maicaActivity: string;
  clintDetail: string;
  maicaDetail: string;
  sharedActivity: string;
  primaryAgent: RoutineAgent;
  nextTransition: string;
  phase: "night" | "morning" | "day" | "evening";
};

type RoutineBlock = {
  start: number;
  end: number;
  clint: string;
  maica: string;
  shared: string;
  primary: RoutineAgent;
};

const weekdayRoutine: RoutineBlock[] = [
  { start: 0, end: 4.5, clint: "sleeping / offline", maica: "sleeping / offline", shared: "quiet hours", primary: "both" },
  { start: 4.5, end: 6, clint: "slow morning", maica: "chores / jogging", shared: "early morning rhythm", primary: "maica" },
  { start: 6, end: 8, clint: "breakfast / getting ready", maica: "family morning", shared: "morning at home", primary: "both" },
  { start: 8, end: 12, clint: "school / study", maica: "study / freelance work", shared: "weekday responsibilities", primary: "both" },
  { start: 12, end: 13, clint: "lunch / reset", maica: "lunch / family check-in", shared: "midday pause", primary: "both" },
  { start: 13, end: 16.5, clint: "coding / school work", maica: "freelance work / errands", shared: "afternoon work", primary: "clint" },
  { start: 16.5, end: 18, clint: "calisthenics / reset", maica: "garden / siblings", shared: "late afternoon", primary: "both" },
  { start: 18, end: 20, clint: "church / music / home", maica: "church / family", shared: "evening routine", primary: "both" },
  { start: 20, end: 22, clint: "coding / music", maica: "ukulele / quiet time", shared: "slow evening", primary: "both" },
  { start: 22, end: 24, clint: "late-night reflection / rest", maica: "late-night quiet time", shared: "winding down", primary: "both" },
];

const routineDetails: Record<string, { clint: string[]; maica: string[] }> = {
  "quiet hours": {
    clint: ["phone on the side", "laptop closed", "offline for the night"],
    maica: ["blanket and quiet", "phone on silent", "offline for the night"],
  },
  "early morning rhythm": {
    clint: ["slow start", "getting ready", "quiet morning"],
    maica: ["doing early chores", "short jog", "helping around the house"],
  },
  "morning at home": {
    clint: ["getting things ready", "breakfast", "checking the day ahead"],
    maica: ["helping with breakfast", "checking on the siblings", "starting the household"],
  },
  "weekday responsibilities": {
    clint: ["class notes open", "working through a task", "studying between messages"],
    maica: ["school work", "freelance task", "checking a few errands"],
  },
  "midday pause": {
    clint: ["lunch break", "away from the keyboard", "quick reset"],
    maica: ["eating lunch", "checking the house", "short rest"],
  },
  "afternoon work": {
    clint: ["deep in a coding task", "testing something", "fixing a stubborn bug"],
    maica: ["freelance work", "sorting a task list", "running a small errand"],
  },
  "late afternoon": {
    clint: ["bodyweight set", "stretching", "taking a short reset"],
    maica: ["checking the eggplants", "watering the tomatoes", "looking after the garden"],
  },
  "evening routine": {
    clint: ["music notes nearby", "church work", "getting settled at home"],
    maica: ["family time", "church work", "helping around the house"],
  },
  "slow evening": {
    clint: ["coding with music on", "playing around with a project", "quiet keyboard time"],
    maica: ["ukulele practice", "repeating A Thousand Years", "sitting outside for a bit"],
  },
  "winding down": {
    clint: ["closing tabs", "checking one last thing", "slowing down"],
    maica: ["putting things away", "checking the next day", "quiet time"],
  },
  "Sunday morning": {
    clint: ["checking music gear", "getting ready for service", "running through a song"],
    maica: ["getting ready", "helping at home", "getting ready for service"],
  },
  "church and community": {
    clint: ["serving with music", "church youth work", "church service"],
    maica: ["church service", "helping with church work", "community time"],
  },
  "family time": {
    clint: ["eating with family", "slow afternoon", "resting after service"],
    maica: ["family lunch", "helping at home", "catching up with everyone"],
  },
  "slow Sunday afternoon": {
    clint: ["quiet coding", "taking a break", "music in the background"],
    maica: ["garden time", "home chores", "quiet afternoon"],
  },
  "evening service rhythm": {
    clint: ["church follow-up", "music practice", "checking tomorrow's tasks"],
    maica: ["church follow-up", "family time", "getting things ready"],
  },
  "quiet evening": {
    clint: ["small coding task", "playing music", "winding down"],
    maica: ["ukulele practice", "quiet time", "getting ready for bed"],
  },
};

const sundayRoutine: RoutineBlock[] = [
  { start: 0, end: 5, clint: "sleeping / offline", maica: "sleeping / offline", shared: "quiet hours", primary: "both" },
  { start: 5, end: 8, clint: "getting ready / music prep", maica: "chores / getting ready", shared: "Sunday morning", primary: "both" },
  { start: 8, end: 12, clint: "church / music service", maica: "church / service", shared: "church and community", primary: "both" },
  { start: 12, end: 14, clint: "lunch / family", maica: "family lunch", shared: "family time", primary: "both" },
  { start: 14, end: 17, clint: "coding / rest", maica: "garden / home", shared: "slow Sunday afternoon", primary: "both" },
  { start: 17, end: 20, clint: "music / church follow-up", maica: "family / church", shared: "evening service rhythm", primary: "both" },
  { start: 20, end: 22.5, clint: "quiet coding / music", maica: "ukulele / rest", shared: "quiet evening", primary: "both" },
  { start: 22.5, end: 24, clint: "rest", maica: "rest", shared: "winding down", primary: "both" },
];

function blockForHour(hour: number, sunday: boolean) {
  const blocks = sunday ? sundayRoutine : weekdayRoutine;
  return blocks.find((block) => hour >= block.start && hour < block.end) || blocks[0];
}

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getSimulationDayCycle(date: Date = new Date()): RoutineSnapshot {
  const parts = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  const decimalHour = hour + minute / 60;
  const dayLabel = get("weekday");
  const sunday = dayLabel === "Sunday";
  const block = blockForHour(decimalHour, sunday);
  const detailPool = routineDetails[block.shared] || routineDetails["quiet hours"];
  const minuteBucket = Math.floor(minute / 20);
  const clintDetail = detailPool.clint[minuteBucket % detailPool.clint.length];
  const maicaDetail = detailPool.maica[minuteBucket % detailPool.maica.length];
  const phase: RoutineSnapshot["phase"] =
    decimalHour < 5 ? "night" :
    decimalHour < 12 ? "morning" :
    decimalHour < 18 ? "day" :
    decimalHour < 22 ? "evening" : "night";

  const dateLabel = get("month") + " " + get("day") + ", " + get("year");
  const blocks = sunday ? sundayRoutine : weekdayRoutine;
  const next = blocks.find((candidate) => candidate.start > decimalHour) || blocks[0];
  const nextHour = Math.floor(next.start);
  const nextMinutes = Math.round((next.start - nextHour) * 60);
  const nextTime = String(nextHour).padStart(2, "0") + ":" + String(nextMinutes).padStart(2, "0");

  return {
    dateLabel,
    timeLabel: formatClock(date),
    dayLabel,
    clintActivity: block.clint,
    maicaActivity: block.maica,
    clintDetail,
    maicaDetail,
    sharedActivity: block.shared,
    primaryAgent: block.primary,
    nextTransition: nextTime,
    phase,
  };
}