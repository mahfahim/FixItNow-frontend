// src/lib/api-client.ts

import { API_TIMEOUT_MS, DEFAULT_HEADERS, getBackendBaseUrl } from "./constants";
import { createHttpApiError, toApiError } from "./api-error";
import type { ActionResponse, ApiRequestOptions, HttpMethod } from "@/types/api.types";

/**
 * Safely parses a `Response` body as JSON.
 * Never throws: returns `undefined` for empty bodies or invalid JSON so
 * callers never blindly trust `await response.json()`.
 */
async function parseJsonSafely(response: Response): Promise<unknown> {
  const raw = await response.text();

  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

interface InternalRequestOptions extends ApiRequestOptions {
  body?: unknown;
}

/**
 * Thin, typed wrapper around the native Fetch API.
 *
 * Centralizes:
 * - default + auth headers
 * - request timeout via AbortController
 * - JSON body serialization
 * - safe JSON response parsing
 * - HTTP status -> ApiError classification
 *
 * Callers get back the backend's own `ActionResponse<T>` shape on success,
 * or a thrown `ApiError` on failure — never a raw, unchecked `Response`.
 */
class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    options: InternalRequestOptions = {}
  ): Promise<ActionResponse<T>> {
    const { headers, timeoutMs = API_TIMEOUT_MS, cache, next, body } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          ...DEFAULT_HEADERS,
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache,
        next,
        signal: controller.signal,
      });

      const parsedBody = await parseJsonSafely(response);

      if (!response.ok) {
        throw createHttpApiError(response.status, parsedBody);
      }

      return (parsedBody ?? { success: true, message: "" }) as ActionResponse<T>;
    } catch (error) {
      throw toApiError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(endpoint: string, options?: ApiRequestOptions): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "GET", options);
  }

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "POST", { ...options, body });
  }

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "PATCH", { ...options, body });
  }

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "PUT", { ...options, body });
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "DELETE", options);
  }
}

export const apiClient = new ApiClient(getBackendBaseUrl());