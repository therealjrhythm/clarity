import "server-only";

import { AiError, toAiError } from "@/lib/ai/errors";

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_REQUEST_TIMEOUT_MS = 20000;

type GeminiTextPart = {
  text?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiTextPart[];
    };
  }>;
};

export type GeminiJsonOptions = {
  maxOutputTokens?: number;
  model?: string;
  prompt: string;
  temperature?: number;
};

export function getGeminiModel() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function hasGeminiApiKey() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function extractJsonText(value: string) {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return fenced?.[1]?.trim() || trimmed;
}

export async function generateGeminiJson<T>({
  maxOutputTokens = 4096,
  model = getGeminiModel(),
  prompt,
  temperature = 0.45,
}: GeminiJsonOptions): Promise<{ model: string; value: T }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new AiError({
      code: "AI_MISSING_API_KEY",
      message: "GEMINI_API_KEY is not configured.",
    });
  }

  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    GEMINI_REQUEST_TIMEOUT_MS,
  );

  let response: Response;
  try {
    response = await fetch(
      `${GEMINI_API_BASE_URL}/models/${encodeURIComponent(model)}:generateContent`,
      {
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
              role: "user",
            },
          ],
          generationConfig: {
            maxOutputTokens,
            responseMimeType: "application/json",
            temperature,
          },
        }),
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        method: "POST",
        signal: abortController.signal,
      },
    );
  } catch (error) {
    throw toAiError(error);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const details = await response.text();
    const code = response.status === 429 ? "AI_RATE_LIMITED" : "AI_REQUEST_FAILED";
    throw new AiError({
      code,
      message: `Gemini request failed: ${response.status} ${details}`,
      status: response.status,
    });
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new AiError({
      code: "AI_INVALID_RESPONSE",
      message: "Gemini returned no text.",
    });
  }

  let value: T;
  try {
    value = JSON.parse(extractJsonText(text)) as T;
  } catch (error) {
    throw new AiError({
      cause: error,
      code: "AI_INVALID_RESPONSE",
      message: "Gemini returned malformed JSON.",
    });
  }

  return {
    model,
    value,
  };
}
