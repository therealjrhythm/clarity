export const PENDING_FOUNDATION_STORAGE_KEY = "clarity.pendingFoundation";

export type PendingFoundationSource = "prompt" | "quick-action";

export type PendingFoundationContext = {
  createdAt: number;
  modelId: string;
  source: PendingFoundationSource;
  title: string;
};

export type FoundationDefaults = {
  description: string;
  name: string;
  type: string;
};

const TYPE_PATTERNS: Array<[RegExp, string]> = [
  [/\blanding\s+page\b/i, "Landing page"],
  [/\bwebsite\b|\bweb\s+site\b/i, "Website"],
  [/\bdashboard\b/i, "Dashboard"],
  [/\bmobile\s+app\b/i, "Mobile app"],
  [/\bweb\s+app\b|\bapp\b/i, "App"],
  [/\bcolor\s+palette\b|\bpalette\b/i, "Color palette"],
  [/\breferences?\b|\bmoodboard\b/i, "References"],
  [/\bbrand\s+identity\b|\bidentity\b|\bbrand\b/i, "Brand identity"],
  [/\bdesign\s+system\b|\bsystem\b/i, "Design system"],
];

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

function normalizeTitle(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function parseContext(value: unknown): PendingFoundationContext | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const context = value as Partial<PendingFoundationContext>;
  if (
    typeof context.title !== "string" ||
    typeof context.modelId !== "string" ||
    typeof context.createdAt !== "number" ||
    (context.source !== "prompt" && context.source !== "quick-action")
  ) {
    return null;
  }

  const title = normalizeTitle(context.title);
  if (!title) {
    return null;
  }

  return {
    createdAt: context.createdAt,
    modelId: context.modelId,
    source: context.source,
    title,
  };
}

export function clearPendingFoundation() {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(PENDING_FOUNDATION_STORAGE_KEY);
}

export function readPendingFoundation() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(PENDING_FOUNDATION_STORAGE_KEY);
    return parseContext(rawValue ? JSON.parse(rawValue) : null);
  } catch {
    clearPendingFoundation();
    return null;
  }
}

export function writePendingFoundation(context: PendingFoundationContext) {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(
    PENDING_FOUNDATION_STORAGE_KEY,
    JSON.stringify({
      ...context,
      title: normalizeTitle(context.title),
    }),
  );
}

function inferProjectType(title: string) {
  const match = TYPE_PATTERNS.find(([pattern]) => pattern.test(title));
  return match?.[1] || "Design system";
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() || ""}${word.slice(1)}`)
    .join(" ");
}

function inferProjectName(title: string) {
  const match = title.match(/\bfor\s+([^,.;!?]+)/i);
  if (!match?.[1]) {
    return "";
  }

  const candidate = match[1]
    .replace(/\b(a|an|the)\b/gi, "")
    .trim()
    .replace(/\s+/g, " ");

  if (!candidate) {
    return "";
  }

  const words = candidate.split(/\s+/);
  const hasNameLikeWord = words.some((word) => /^[A-Z0-9]/.test(word));

  return hasNameLikeWord ? titleCase(candidate) : "";
}

export function inferFoundationDefaults(
  context: PendingFoundationContext | null,
): FoundationDefaults {
  const title = normalizeTitle(context?.title || "");

  return {
    description: title,
    name: title ? inferProjectName(title) : "",
    type: title ? inferProjectType(title) : "",
  };
}
