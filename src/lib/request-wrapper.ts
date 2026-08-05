// src/lib/request-wrapper.ts

import { logger } from "./logger";
import { toApiError } from "./api-error";
import type { ActionResponse } from "@/types/api.types";

interface ActionContext {
  method: string;
  endpoint: string;
  fallbackMessage: string;
}

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
