import {
  formatGreeting,
  selectAndRememberGreeting,
} from "@/lib/greetings";

export type DashboardGreetingPart = {
  accent?: boolean;
  text: string;
};

export function defaultDashboardGreetingParts(
  name: string,
): DashboardGreetingPart[] {
  const displayName = formatGreeting("{firstName}", name);

  return [
    { text: "Let's find the direction, " },
    { accent: true, text: displayName },
    { text: "." },
  ];
}

export function getDashboardGreetingParts(
  name: string,
  storage?: Storage,
  date = new Date(),
  maxRenderedLength?: number,
): DashboardGreetingPart[] {
  const selected = selectAndRememberGreeting({
    date,
    firstName: name,
    maxRenderedLength,
    storage,
  });
  const displayName = formatGreeting("{firstName}", name);

  return greetingTextToParts(selected.renderedText, displayName);
}

function greetingTextToParts(text: string, displayName: string) {
  const nameStartIndex = text.indexOf(displayName);

  if (nameStartIndex === -1) {
    return [{ text }];
  }

  return [
    { text: text.slice(0, nameStartIndex) },
    { accent: true, text: displayName },
    { text: text.slice(nameStartIndex + displayName.length) },
  ].filter((part) => part.text.length > 0);
}
