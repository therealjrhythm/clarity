export type GreetingBucket =
  | "morning"
  | "afternoon"
  | "evening"
  | "lateNight"
  | "anytime";

export type Greeting = {
  bucket: GreetingBucket;
  id: string;
  text: string;
};

export type SelectedGreeting = Greeting & {
  renderedText: string;
};

export const RECENT_GREETINGS_STORAGE_KEY = "clarity_recent_greetings";
const RECENT_GREETING_LIMIT = 5;

export const GREETINGS: Greeting[] = [
  { id: "anytime_01", text: "Hi, {firstName}. What are we making?", bucket: "anytime" },
  { id: "anytime_02", text: "{firstName}, what are we building today?", bucket: "anytime" },
  { id: "anytime_03", text: "Ready when you are, {firstName}.", bucket: "anytime" },
  { id: "anytime_04", text: "{firstName}, what's the angle?", bucket: "anytime" },
  { id: "anytime_05", text: "What's the vibe, {firstName}?", bucket: "anytime" },
  { id: "anytime_06", text: "Let's shape something sharp, {firstName}.", bucket: "anytime" },
  { id: "anytime_07", text: "Good to see you, {firstName}.", bucket: "anytime" },
  { id: "anytime_08", text: "{firstName}, where should we start?", bucket: "anytime" },
  { id: "anytime_09", text: "Let's make this clear, {firstName}.", bucket: "anytime" },
  { id: "anytime_10", text: "What are we refining today, {firstName}?", bucket: "anytime" },
  { id: "anytime_11", text: "{firstName}, let's get the idea into shape.", bucket: "anytime" },
  { id: "anytime_12", text: "What's on your mind, {firstName}?", bucket: "anytime" },
  { id: "anytime_13", text: "{firstName}, ready to turn this into something real?", bucket: "anytime" },
  { id: "anytime_14", text: "Let's find the direction, {firstName}.", bucket: "anytime" },
  { id: "anytime_15", text: "{firstName}, what are we bringing to life?", bucket: "anytime" },
  { id: "anytime_16", text: "Start with the idea, {firstName}. I'll help shape it.", bucket: "anytime" },
  { id: "anytime_17", text: "What's the project today, {firstName}?", bucket: "anytime" },
  { id: "anytime_18", text: "{firstName}, let's build from the first thought.", bucket: "anytime" },
  { id: "anytime_19", text: "Let's make the next move, {firstName}.", bucket: "anytime" },
  { id: "anytime_20", text: "{firstName}, what needs clarity?", bucket: "anytime" },
  { id: "anytime_21", text: "What are we designing today, {firstName}?", bucket: "anytime" },
  { id: "anytime_22", text: "{firstName}, let's turn the rough idea into direction.", bucket: "anytime" },
  { id: "anytime_23", text: "Ready to focus, {firstName}?", bucket: "anytime" },
  { id: "anytime_24", text: "{firstName}, what's worth building today?", bucket: "anytime" },
  { id: "anytime_25", text: "Let's give the idea some structure, {firstName}.", bucket: "anytime" },
  { id: "anytime_26", text: "{firstName}, what are we solving?", bucket: "anytime" },
  { id: "anytime_27", text: "What direction are we exploring, {firstName}?", bucket: "anytime" },
  { id: "anytime_28", text: "{firstName}, let's start with the truth of the project.", bucket: "anytime" },
  { id: "anytime_29", text: "Let's make something intentional, {firstName}.", bucket: "anytime" },
  { id: "anytime_30", text: "{firstName}, what should this become?", bucket: "anytime" },
  { id: "anytime_31", text: "Bring the idea, {firstName}. I'll help organize it.", bucket: "anytime" },
  { id: "anytime_32", text: "{firstName}, let's make the brand feel sharper.", bucket: "anytime" },
  { id: "anytime_33", text: "What are we making clearer today, {firstName}?", bucket: "anytime" },
  { id: "anytime_34", text: "{firstName}, ready to map the next step?", bucket: "anytime" },
  { id: "anytime_35", text: "Let's build with purpose, {firstName}.", bucket: "anytime" },
  { id: "anytime_36", text: "{firstName}, what's the creative problem?", bucket: "anytime" },
  { id: "anytime_37", text: "Let's define the direction, {firstName}.", bucket: "anytime" },
  { id: "anytime_38", text: "{firstName}, what needs a better shape?", bucket: "anytime" },
  { id: "anytime_39", text: "Start anywhere, {firstName}. We'll find the structure.", bucket: "anytime" },
  { id: "anytime_40", text: "{firstName}, let's make the idea easier to see.", bucket: "anytime" },
  { id: "morning_01", text: "Good morning, {firstName}.", bucket: "morning" },
  { id: "morning_02", text: "Morning, {firstName}. What are we making?", bucket: "morning" },
  { id: "morning_03", text: "Fresh start, {firstName}. What's the idea?", bucket: "morning" },
  { id: "morning_04", text: "{firstName}, ready to build something before the day gets loud?", bucket: "morning" },
  { id: "morning_05", text: "Morning focus, {firstName}.", bucket: "morning" },
  { id: "morning_06", text: "Good morning, {firstName}. Let's find the direction.", bucket: "morning" },
  { id: "morning_07", text: "{firstName}, what's first on the board today?", bucket: "morning" },
  { id: "morning_08", text: "New day, new direction, {firstName}.", bucket: "morning" },
  { id: "morning_09", text: "Morning, {firstName}. Let's make this clean.", bucket: "morning" },
  { id: "morning_10", text: "{firstName}, let's start the day with a sharp idea.", bucket: "morning" },
  { id: "morning_11", text: "Good morning, {firstName}. What needs clarity?", bucket: "morning" },
  { id: "morning_12", text: "{firstName}, what are we turning into momentum today?", bucket: "morning" },
  { id: "morning_13", text: "Morning, {firstName}. Let's shape the project.", bucket: "morning" },
  { id: "morning_14", text: "{firstName}, the day is open. What are we building?", bucket: "morning" },
  { id: "morning_15", text: "Good morning, {firstName}. Let's make the first move.", bucket: "morning" },
  { id: "afternoon_01", text: "Good afternoon, {firstName}.", bucket: "afternoon" },
  { id: "afternoon_02", text: "Afternoon, {firstName}. What are we working through?", bucket: "afternoon" },
  { id: "afternoon_03", text: "{firstName}, ready for the next pass?", bucket: "afternoon" },
  { id: "afternoon_04", text: "Midday check-in, {firstName}. What needs focus?", bucket: "afternoon" },
  { id: "afternoon_05", text: "Good afternoon, {firstName}. Let's refine the direction.", bucket: "afternoon" },
  { id: "afternoon_06", text: "{firstName}, what are we moving forward today?", bucket: "afternoon" },
  { id: "afternoon_07", text: "Afternoon momentum, {firstName}.", bucket: "afternoon" },
  { id: "afternoon_08", text: "{firstName}, let's make the idea stronger.", bucket: "afternoon" },
  { id: "afternoon_09", text: "Good afternoon, {firstName}. What should we sharpen?", bucket: "afternoon" },
  { id: "afternoon_10", text: "{firstName}, what's the next decision?", bucket: "afternoon" },
  { id: "afternoon_11", text: "Afternoon, {firstName}. Let's clean up the concept.", bucket: "afternoon" },
  { id: "afternoon_12", text: "{firstName}, ready to give this more shape?", bucket: "afternoon" },
  { id: "afternoon_13", text: "Good afternoon, {firstName}. Let's keep building.", bucket: "afternoon" },
  { id: "afternoon_14", text: "{firstName}, what needs a second look?", bucket: "afternoon" },
  { id: "afternoon_15", text: "Afternoon focus, {firstName}. Let's get clear.", bucket: "afternoon" },
  { id: "evening_01", text: "Good evening, {firstName}.", bucket: "evening" },
  { id: "evening_02", text: "Evening work, {firstName}. What are we shaping?", bucket: "evening" },
  { id: "evening_03", text: "{firstName}, let's make the most of the quiet.", bucket: "evening" },
  { id: "evening_04", text: "Evening, {firstName}. What's the direction?", bucket: "evening" },
  { id: "evening_05", text: "{firstName}, ready to refine the idea?", bucket: "evening" },
  { id: "evening_06", text: "Good evening, {firstName}. Let's make this feel right.", bucket: "evening" },
  { id: "evening_07", text: "{firstName}, what are we building tonight?", bucket: "evening" },
  { id: "evening_08", text: "Evening focus, {firstName}.", bucket: "evening" },
  { id: "evening_09", text: "{firstName}, let's turn the day's ideas into structure.", bucket: "evening" },
  { id: "evening_10", text: "Good evening, {firstName}. What needs clarity now?", bucket: "evening" },
  { id: "evening_11", text: "{firstName}, let's give this project a stronger shape.", bucket: "evening" },
  { id: "evening_12", text: "Evening, {firstName}. What's worth pushing forward?", bucket: "evening" },
  { id: "evening_13", text: "{firstName}, let's settle into the work.", bucket: "evening" },
  { id: "evening_14", text: "Good evening, {firstName}. Let's refine the vision.", bucket: "evening" },
  { id: "evening_15", text: "{firstName}, what should this become by the end of tonight?", bucket: "evening" },
  { id: "lateNight_01", text: "Late night work, {firstName}.", bucket: "lateNight" },
  { id: "lateNight_02", text: "{firstName}, burning the late oil?", bucket: "lateNight" },
  { id: "lateNight_03", text: "Quiet hours, {firstName}. Good time to build.", bucket: "lateNight" },
  { id: "lateNight_04", text: "{firstName}, late night ideas usually mean something.", bucket: "lateNight" },
  { id: "lateNight_05", text: "Still working, {firstName}? Let's make it count.", bucket: "lateNight" },
  { id: "lateNight_06", text: "Late night focus, {firstName}.", bucket: "lateNight" },
  { id: "lateNight_07", text: "{firstName}, what are we chasing tonight?", bucket: "lateNight" },
  { id: "lateNight_08", text: "The room is quiet, {firstName}. Let's shape the idea.", bucket: "lateNight" },
  { id: "lateNight_09", text: "{firstName}, this feels like a late-night breakthrough.", bucket: "lateNight" },
  { id: "lateNight_10", text: "Night mode, {firstName}. What are we making?", bucket: "lateNight" },
  { id: "lateNight_11", text: "{firstName}, let's turn the thought into direction.", bucket: "lateNight" },
  { id: "lateNight_12", text: "Late session, {firstName}. What needs clarity?", bucket: "lateNight" },
  { id: "lateNight_13", text: "{firstName}, ready for a little magic?", bucket: "lateNight" },
  { id: "lateNight_14", text: "Quiet mind, sharp idea, {firstName}.", bucket: "lateNight" },
  { id: "lateNight_15", text: "{firstName}, let's make the late hours useful.", bucket: "lateNight" },
];

export function getTimeBucket(date = new Date()): GreetingBucket {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 17) {
    return "afternoon";
  }

  if (hour >= 17 && hour < 22) {
    return "evening";
  }

  return "lateNight";
}

export function formatGreeting(text: string, firstName?: string | null) {
  return text.replaceAll("{firstName}", normalizeFirstName(firstName));
}

export function selectGreeting({
  date = new Date(),
  firstName,
  maxRenderedLength,
  random = Math.random,
  recentGreetingIds = [],
}: {
  date?: Date;
  firstName?: string | null;
  maxRenderedLength?: number;
  random?: () => number;
  recentGreetingIds?: string[];
}): SelectedGreeting {
  const bucket = getTimeBucket(date);
  const eligible = GREETINGS.filter(
    (greeting) => greeting.bucket === "anytime" || greeting.bucket === bucket,
  );
  const lengthFiltered =
    typeof maxRenderedLength === "number"
      ? eligible.filter(
          (greeting) =>
            formatGreeting(greeting.text, firstName).length <= maxRenderedLength,
        )
      : eligible;
  const layoutEligible =
    lengthFiltered.length > 0 ? lengthFiltered : eligible;
  const recentIds = new Set(recentGreetingIds);
  const nonRecent = layoutEligible.filter(
    (greeting) => !recentIds.has(greeting.id),
  );
  const lastGreetingId = recentGreetingIds[0];
  const nonImmediateRepeat = layoutEligible.filter(
    (greeting) => greeting.id !== lastGreetingId,
  );
  const pool =
    nonRecent.length > 0
      ? nonRecent
      : nonImmediateRepeat.length > 0
        ? nonImmediateRepeat
        : layoutEligible;
  const boundedRandom = Math.min(Math.max(random(), 0), 0.999999);
  const selected = pool[Math.floor(boundedRandom * pool.length)];

  return {
    ...selected,
    renderedText: formatGreeting(selected.text, firstName),
  };
}

export function rememberGreeting(
  greetingId: string,
  recentGreetingIds: string[],
  limit = RECENT_GREETING_LIMIT,
) {
  return [
    greetingId,
    ...recentGreetingIds.filter((recentId) => recentId !== greetingId),
  ].slice(0, limit);
}

export function readRecentGreetingIds(storage: Storage | undefined) {
  if (!storage) {
    return [];
  }

  try {
    const rawValue = storage.getItem(RECENT_GREETINGS_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : [];

    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export function selectAndRememberGreeting({
  date,
  firstName,
  maxRenderedLength,
  random,
  storage,
}: {
  date?: Date;
  firstName?: string | null;
  maxRenderedLength?: number;
  random?: () => number;
  storage?: Storage;
}) {
  const recentGreetingIds = readRecentGreetingIds(storage);
  const selected = selectGreeting({
    date,
    firstName,
    maxRenderedLength,
    random,
    recentGreetingIds,
  });
  const nextRecentGreetingIds = rememberGreeting(
    selected.id,
    recentGreetingIds,
  );

  try {
    storage?.setItem(
      RECENT_GREETINGS_STORAGE_KEY,
      JSON.stringify(nextRecentGreetingIds),
    );
  } catch {
    // Greeting rotation should never block the dashboard.
  }

  return selected;
}

function normalizeFirstName(firstName?: string | null) {
  const trimmedName = firstName?.trim();

  if (!trimmedName) {
    return "there";
  }

  const emailSafeName = trimmedName.includes("@")
    ? trimmedName.split("@")[0]
    : trimmedName;

  return emailSafeName.split(/[._\-\s]+/).filter(Boolean)[0] || "there";
}
