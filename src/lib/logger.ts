// src/lib/logger.ts

type LogLevel = "debug" | "info" | "warn" | "error";

export interface HttpLogContext {
  method: string;
  endpoint: string;
  statusCode?: number;
  errorType?: string;
  message?: string;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const SENSITIVE_KEYS = new Set([
  "authorization",
  "cookie",
  "accesstoken",
  "refreshtoken",
  "password",
  "token",
]);

function redact(context: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    redacted[key] = SENSITIVE_KEYS.has(key.toLowerCase())
      ? "[REDACTED]"
      : value;
  }

  return redacted;
}

function write(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (level === "debug" && IS_PRODUCTION) {
    return;
  }

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? redact(context) : {}),
  };

  const serialized = JSON.stringify(payload);

  switch (level) {
    case "error":
      console.error(serialized);
      break;
    case "warn":
      console.warn(serialized);
      break;
    default:
      console.log(serialized);
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>): void =>
    write("debug", message, context),
  info: (message: string, context?: Record<string, unknown>): void =>
    write("info", message, context),
  warn: (message: string, context?: Record<string, unknown>): void =>
    write("warn", message, context),
  error: (message: string, context?: Record<string, unknown>): void =>
    write("error", message, context),

  httpError: (context: HttpLogContext): void =>
    write("error", "HTTP request failed", { ...context }),
};
