# Clarity Dynamic Greetings Spec

## Goal

Add a dynamic greeting system to Clarity so that when a user signs in, signs up, or opens the app, they are greeted with a fresh, personalized message.

The greeting should feel human, creative, warm, and lightly strategic — not overly corporate or robotic.

Example:

```text
Hi, Jeremiah. What are we making?
```

The name should be dynamic and use the signed-in user’s first name.

Example with template variable:

```text
Hi, {firstName}. What are we making?
```

---

# Product Direction

Use a curated greeting bank of 100 greetings.

Then dynamically select an appropriate greeting when the user opens the app or signs in.

Do not use AI generation for greetings at runtime.

Reasons:

- faster
- more reliable
- no API cost
- consistent product tone
- easier to test
- avoids awkward or off-brand generated greetings

---

# Dynamic Behavior

The app should choose greetings based on:

1. User first name
2. Time of day
3. Session freshness
4. Avoiding immediate repeats

---

# Name Handling

Use the user’s first name when available.

Suggested logic:

```ts
const firstName =
  user.profile?.firstName ||
  user.user_metadata?.first_name ||
  user.email?.split("@")[0] ||
  "there"
```

If no first name is available, use a graceful fallback.

Example:

```text
Hi there. What are we making?
```

Do not show the full email in the greeting.

---

# Time-of-Day Rules

Time-aware greetings should only appear during the appropriate time window.

Suggested local-time windows:

```ts
morning: 5 <= hour < 12
afternoon: 12 <= hour < 17
evening: 17 <= hour < 22
lateNight: 22 <= hour || hour < 5
anytime: always eligible
```

Use the user’s local browser time unless the app already stores user timezone.

---

# Rotation Rules

On each app open/sign-in:

1. Build a list of eligible greetings based on time of day.
2. Include `anytime` greetings.
3. Randomly choose one.
4. Avoid showing the same greeting twice in a row.
5. Optionally avoid the last 3–5 recently shown greetings.

Suggested local storage key:

```ts
clarity_recent_greetings
```

Store greeting IDs, not full greeting text.

Example:

```json
["anytime_12", "morning_03", "evening_08"]
```

---

# Greeting Data Shape

Suggested structure:

```ts
type GreetingTimeBucket =
  | "morning"
  | "afternoon"
  | "evening"
  | "lateNight"
  | "anytime"

type Greeting = {
  id: string
  text: string
  bucket: GreetingTimeBucket
}
```

Example:

```ts
{
  id: "anytime_01",
  text: "Hi, {firstName}. What are we making?",
  bucket: "anytime"
}
```

---

# Implementation Notes

- Replace `{firstName}` with the user’s first name.
- Keep punctuation exactly as written unless a lint/format rule requires changes.
- Do not use all caps.
- Do not use emojis for now.
- Avoid overly trendy phrases.
- Avoid greetings that sound too salesy.
- Avoid repetitive “AI assistant” language.
- Keep the voice premium, creative, and relaxed.

---

# 100 Curated Greetings

## Anytime Greetings

1. Hi, {firstName}. What are we making?
2. {firstName}, what are we building today?
3. Ready when you are, {firstName}.
4. {firstName}, what’s the angle?
5. What’s the vibe, {firstName}?
6. Let’s shape something sharp, {firstName}.
7. Good to see you, {firstName}.
8. {firstName}, where should we start?
9. Let’s make this clear, {firstName}.
10. What are we refining today, {firstName}?
11. {firstName}, let’s get the idea into shape.
12. What’s on your mind, {firstName}?
13. {firstName}, ready to turn this into something real?
14. Let’s find the direction, {firstName}.
15. {firstName}, what are we bringing to life?
16. Start with the idea, {firstName}. I’ll help shape it.
17. What’s the project today, {firstName}?
18. {firstName}, let’s build from the first thought.
19. Let’s make the next move, {firstName}.
20. {firstName}, what needs clarity?
21. What are we designing today, {firstName}?
22. {firstName}, let’s turn the rough idea into direction.
23. Ready to focus, {firstName}?
24. {firstName}, what’s worth building today?
25. Let’s give the idea some structure, {firstName}.
26. {firstName}, what are we solving?
27. What direction are we exploring, {firstName}?
28. {firstName}, let’s start with the truth of the project.
29. Let’s make something intentional, {firstName}.
30. {firstName}, what should this become?
31. Bring the idea, {firstName}. I’ll help organize it.
32. {firstName}, let’s make the brand feel sharper.
33. What are we making clearer today, {firstName}?
34. {firstName}, ready to map the next step?
35. Let’s build with purpose, {firstName}.
36. {firstName}, what’s the creative problem?
37. Let’s define the direction, {firstName}.
38. {firstName}, what needs a better shape?
39. Start anywhere, {firstName}. We’ll find the structure.
40. {firstName}, let’s make the idea easier to see.

## Morning Greetings

41. Good morning, {firstName}.
42. Morning, {firstName}. What are we making?
43. Fresh start, {firstName}. What’s the idea?
44. {firstName}, ready to build something before the day gets loud?
45. Morning focus, {firstName}.
46. Good morning, {firstName}. Let’s find the direction.
47. {firstName}, what’s first on the board today?
48. New day, new direction, {firstName}.
49. Morning, {firstName}. Let’s make this clean.
50. {firstName}, let’s start the day with a sharp idea.
51. Good morning, {firstName}. What needs clarity?
52. {firstName}, what are we turning into momentum today?
53. Morning, {firstName}. Let’s shape the project.
54. {firstName}, the day is open. What are we building?
55. Good morning, {firstName}. Let’s make the first move.

## Afternoon Greetings

56. Good afternoon, {firstName}.
57. Afternoon, {firstName}. What are we working through?
58. {firstName}, ready for the next pass?
59. Midday check-in, {firstName}. What needs focus?
60. Good afternoon, {firstName}. Let’s refine the direction.
61. {firstName}, what are we moving forward today?
62. Afternoon momentum, {firstName}.
63. {firstName}, let’s make the idea stronger.
64. Good afternoon, {firstName}. What should we sharpen?
65. {firstName}, what’s the next decision?
66. Afternoon, {firstName}. Let’s clean up the concept.
67. {firstName}, ready to give this more shape?
68. Good afternoon, {firstName}. Let’s keep building.
69. {firstName}, what needs a second look?
70. Afternoon focus, {firstName}. Let’s get clear.

## Evening Greetings

71. Good evening, {firstName}.
72. Evening work, {firstName}. What are we shaping?
73. {firstName}, let’s make the most of the quiet.
74. Evening, {firstName}. What’s the direction?
75. {firstName}, ready to refine the idea?
76. Good evening, {firstName}. Let’s make this feel right.
77. {firstName}, what are we building tonight?
78. Evening focus, {firstName}.
79. {firstName}, let’s turn the day’s ideas into structure.
80. Good evening, {firstName}. What needs clarity now?
81. {firstName}, let’s give this project a stronger shape.
82. Evening, {firstName}. What’s worth pushing forward?
83. {firstName}, let’s settle into the work.
84. Good evening, {firstName}. Let’s refine the vision.
85. {firstName}, what should this become by the end of tonight?

## Late Night Greetings

86. Late night work, {firstName}.
87. {firstName}, burning the late oil?
88. Quiet hours, {firstName}. Good time to build.
89. {firstName}, late night ideas usually mean something.
90. Still working, {firstName}? Let’s make it count.
91. Late night focus, {firstName}.
92. {firstName}, what are we chasing tonight?
93. The room is quiet, {firstName}. Let’s shape the idea.
94. {firstName}, this feels like a late-night breakthrough.
95. Night mode, {firstName}. What are we making?
96. {firstName}, let’s turn the thought into direction.
97. Late session, {firstName}. What needs clarity?
98. {firstName}, ready for a little magic?
99. Quiet mind, sharp idea, {firstName}.
100. {firstName}, let’s make the late hours useful.

---

# Suggested Greeting Utility

Create a small utility for greeting selection.

Suggested file:

```text
lib/greetings.ts
```

Example implementation:

```ts
export type GreetingBucket =
  | "morning"
  | "afternoon"
  | "evening"
  | "lateNight"
  | "anytime"

export type Greeting = {
  id: string
  text: string
  bucket: GreetingBucket
}

export function getTimeBucket(date = new Date()): GreetingBucket {
  const hour = date.getHours()

  if (hour >= 5 && hour < 12) return "morning"
  if (hour >= 12 && hour < 17) return "afternoon"
  if (hour >= 17 && hour < 22) return "evening"

  return "lateNight"
}

export function formatGreeting(text: string, firstName?: string | null) {
  const safeName = firstName?.trim() || "there"
  return text.replaceAll("{firstName}", safeName)
}

export function selectGreeting(params: {
  firstName?: string | null
  date?: Date
  recentGreetingIds?: string[]
}) {
  const bucket = getTimeBucket(params.date ?? new Date())

  const eligible = GREETINGS.filter((greeting) => {
    return greeting.bucket === "anytime" || greeting.bucket === bucket
  })

  const recentIds = new Set(params.recentGreetingIds ?? [])

  const nonRecent = eligible.filter((greeting) => {
    return !recentIds.has(greeting.id)
  })

  const pool = nonRecent.length > 0 ? nonRecent : eligible

  const selected = pool[Math.floor(Math.random() * pool.length)]

  return {
    ...selected,
    renderedText: formatGreeting(selected.text, params.firstName)
  }
}
```

---

# Suggested Component Usage

Use the greeting wherever the app currently has a static welcome message.

Example:

```tsx
const greeting = selectGreeting({
  firstName: userFirstName,
  recentGreetingIds
})

return <h1>{greeting.renderedText}</h1>
```

Store the selected greeting ID after display so it can be avoided next time.

---

# Acceptance Criteria

- The app displays a personalized greeting when the user opens/signs into the app.
- The greeting uses the user’s first name when available.
- If no name is available, the greeting gracefully uses “there.”
- Morning greetings only show in the morning.
- Afternoon greetings only show in the afternoon.
- Evening greetings only show in the evening.
- Late-night greetings only show late at night.
- Anytime greetings can show at any time.
- The same greeting should not appear twice in a row.
- Ideally, the last 3–5 greetings should be avoided.
- Greetings should not require an AI/API call.
- The system should be easy to extend with more greetings later.
- The greeting system should not block app loading.