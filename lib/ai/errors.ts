export type AiErrorCode =
  | "AI_INVALID_RESPONSE"
  | "AI_LOW_QUALITY_RESPONSE"
  | "AI_MISSING_API_KEY"
  | "AI_RATE_LIMITED"
  | "AI_REQUEST_FAILED"
  | "AI_TIMEOUT"
  | "AI_UNKNOWN_ERROR";

export class AiError extends Error {
  code: AiErrorCode;
  cause?: unknown;
  status?: number;

  constructor({
    cause,
    code,
    message,
    status,
  }: {
    cause?: unknown;
    code: AiErrorCode;
    message: string;
    status?: number;
  }) {
    super(message);
    this.name = "AiError";
    this.code = code;
    this.cause = cause;
    this.status = status;
  }
}

export type PublicAiError = {
  code: AiErrorCode;
  message: string;
};

export function toAiError(error: unknown): AiError {
  if (error instanceof AiError) {
    return error;
  }

  if (error instanceof SyntaxError) {
    return new AiError({
      cause: error,
      code: "AI_INVALID_RESPONSE",
      message: "The AI response was not valid JSON.",
    });
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new AiError({
      cause: error,
      code: "AI_TIMEOUT",
      message: "The AI request timed out.",
    });
  }

  return new AiError({
    cause: error,
    code: "AI_UNKNOWN_ERROR",
    message: error instanceof Error ? error.message : "Unknown AI error.",
  });
}

export function getPublicAiError(error: unknown): PublicAiError {
  const aiError = toAiError(error);

  switch (aiError.code) {
    case "AI_MISSING_API_KEY":
      return {
        code: aiError.code,
        message:
          "Clarity is not connected to its AI provider yet. Add the API key and try again.",
      };
    case "AI_TIMEOUT":
      return {
        code: aiError.code,
        message: "Clarity took too long to generate this response. Please try again.",
      };
    case "AI_RATE_LIMITED":
      return {
        code: aiError.code,
        message:
          "Clarity is receiving too many AI requests right now. Please try again shortly.",
      };
    case "AI_INVALID_RESPONSE":
    case "AI_LOW_QUALITY_RESPONSE":
      return {
        code: aiError.code,
        message:
          "Clarity couldn’t generate a strong enough response. Please try again.",
      };
    case "AI_REQUEST_FAILED":
    case "AI_UNKNOWN_ERROR":
    default:
      return {
        code: aiError.code,
        message: "Clarity couldn’t generate this response. Please try again.",
      };
  }
}

export function logAiError({
  action,
  attempt,
  error,
  model,
}: {
  action: string;
  attempt: "initial" | "repair";
  error: unknown;
  model: string;
}) {
  const aiError = toAiError(error);

  if (process.env.NODE_ENV !== "production") {
    console.error("[Clarity AI]", {
      action,
      attempt,
      code: aiError.code,
      message: aiError.message,
      model,
      status: aiError.status,
    });
  }
}
