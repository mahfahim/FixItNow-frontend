// src/lib/api-error.ts

export enum ApiErrorType {
  NETWORK = "NETWORK",
  TIMEOUT = "TIMEOUT",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION = "VALIDATION",
  CONFLICT = "CONFLICT",
  RATE_LIMIT = "RATE_LIMIT",
  INTERNAL_SERVER = "INTERNAL_SERVER",
  UNKNOWN = "UNKNOWN",
}

const DEFAULT_ERROR_MESSAGES: Record<ApiErrorType, string> = {
  [ApiErrorType.NETWORK]: "Unable to reach the server. Please check your connection.",
  [ApiErrorType.TIMEOUT]: "The request took too long to complete. Please try again.",
  [ApiErrorType.UNAUTHORIZED]: "You are not authorized. Please sign in again.",
  [ApiErrorType.FORBIDDEN]: "You do not have permission to perform this action.",
  [ApiErrorType.NOT_FOUND]: "The requested resource could not be found.",
  [ApiErrorType.VALIDATION]: "The provided data is invalid.",
  [ApiErrorType.CONFLICT]: "This action conflicts with the current state of the resource.",
  [ApiErrorType.RATE_LIMIT]: "Too many requests. Please try again shortly.",
  [ApiErrorType.INTERNAL_SERVER]: "Something went wrong on our end. Please try again later.",
  [ApiErrorType.UNKNOWN]: "An unexpected error occurred. Please try again.",
};

export class ApiError extends Error {
  public readonly type: ApiErrorType;
  public readonly statusCode?: number;

  constructor(type: ApiErrorType, message: string, statusCode?: number) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.statusCode = statusCode;
  }
}

export function classifyHttpStatus(status: number): ApiErrorType {
  switch (status) {
    case 401:
      return ApiErrorType.UNAUTHORIZED;
    case 403:
      return ApiErrorType.FORBIDDEN;
    case 404:
      return ApiErrorType.NOT_FOUND;
    case 409:
      return ApiErrorType.CONFLICT;
    case 422:
      return ApiErrorType.VALIDATION;
    case 429:
      return ApiErrorType.RATE_LIMIT;
    default:
      return status >= 500 ? ApiErrorType.INTERNAL_SERVER : ApiErrorType.UNKNOWN;
  }
}

export function extractBackendMessage(body: unknown): string | undefined {
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as { message?: unknown }).message === "string"
  ) {
    return (body as { message: string }).message;
  }
  return undefined;
}

export function createHttpApiError(status: number, body: unknown): ApiError {
  const type = classifyHttpStatus(status);
  const message = extractBackendMessage(body) ?? DEFAULT_ERROR_MESSAGES[type];
  return new ApiError(type, message, status);
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError(ApiErrorType.TIMEOUT, DEFAULT_ERROR_MESSAGES[ApiErrorType.TIMEOUT]);
  }

  if (error instanceof TypeError) {
    return new ApiError(ApiErrorType.NETWORK, DEFAULT_ERROR_MESSAGES[ApiErrorType.NETWORK]);
  }

  return new ApiError(ApiErrorType.UNKNOWN, DEFAULT_ERROR_MESSAGES[ApiErrorType.UNKNOWN]);
}
