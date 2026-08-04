// src/lib/request-wrapper.ts

import { logger } from "./logger";
import { toApiError } from "./api-error";
import type { ActionResponse } from "@/types/api.types";

interface ActionContext {
  /** HTTP method of the underlying request, for logging (e.g. "POST"). */
  method: string;
  /** Backend endpoint being called, for logging (e.g. "/api/categories"). */
  endpoint: string;
  /** Fallback user-facing message if no better one is available. */
  fallbackMessage: string;
}

/**
 * Executes a Server Action's core logic and guarantees a consistent
 * `ActionResponse<T>` is returned, regardless of what goes wrong.
 *
 * This is the single place that owns try/catch for the entire action layer:
 * individual actions stay small and never repeat error-handling boilerplate.
 */
export async function executeAction<T>(
  action: () => Promise<ActionResponse<T>>,
  context: ActionContext
): Promise<ActionResponse<T>> {
  try {
    return await action();
  } catch (error) {
    const apiError = toApiError(error);

    logger.httpError({
      method: context.method,
      endpoint: context.endpoint,
      statusCode: apiError.statusCode,
      errorType: apiError.type,
      message: apiError.message,
    });

    return {
      success: false,
      message: apiError.message || context.fallbackMessage,
    };
  }
}