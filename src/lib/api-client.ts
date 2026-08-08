// src/lib/api-client.ts

import { API_TIMEOUT_MS, DEFAULT_HEADERS, getBackendBaseUrl } from "./constants";
import { createHttpApiError, toApiError } from "./api-error";
import { buildQueryString } from "./query-string";
import type { ActionResponse, ApiRequestOptions, HttpMethod } from "@/types";

export interface ExtendedApiRequestOptions extends ApiRequestOptions {
  params?: Record<string, unknown>;
  tags?: string[];
  credentials?: RequestCredentials;
}

interface InternalRequestOptions extends ExtendedApiRequestOptions {
  body?: unknown;
}




async function parseJsonSafely(response: Response): Promise<unknown> {
  const raw = await response.text();

  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}




function buildUrl(baseUrl: string, endpoint: string, params?: Record<string, unknown>): string {
  const isAbsolute = endpoint.startsWith("http://") || endpoint.startsWith("https://");
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  const url = isAbsolute ? new URL(endpoint) : new URL(normalizedEndpoint, normalizedBase);

  if (params) {
    const queryString = buildQueryString(params);
    if (queryString) {
      const searchParams = new URLSearchParams(queryString.slice(1));
      searchParams.forEach((value, key) => url.searchParams.append(key, value));
    }
  }

  return url.toString();
}




async function getServerCookies(): Promise<string | undefined> {
  if (typeof window !== "undefined") return undefined;

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    return cookieString || undefined;
  } catch {
    return undefined;
  }
}




class ApiClient {
  constructor(private readonly getBaseUrl: () => string) {}

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    options: InternalRequestOptions = {}
  ): Promise<ActionResponse<T>> {
    const {
      headers,
      timeoutMs = API_TIMEOUT_MS,
      cache,
      next,
      body,
      params,
      tags,
      credentials = "include",
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const baseUrl = this.getBaseUrl();
    const targetUrl = buildUrl(baseUrl, endpoint, params);

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    const mergedNext = {
      ...next,
      ...(tags ? { tags: Array.from(new Set([...(next?.tags || []), ...tags])) } : {}),
    };

    const reqHeaders: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...(headers as Record<string, string>),
    };

    if (typeof window === "undefined" && !reqHeaders["cookie"] && !reqHeaders["Cookie"]) {
      const serverCookies = await getServerCookies();
      if (serverCookies) {
        reqHeaders["Cookie"] = serverCookies;
      }
    }

    if (isFormData) {
      delete reqHeaders["Content-Type"];
    }

    try {
      const response = await fetch(targetUrl, {
        method,
        headers: reqHeaders,
        body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
        cache,
        credentials,
        next: Object.keys(mergedNext).length > 0 ? mergedNext : undefined,
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

  get<T>(endpoint: string, options?: ExtendedApiRequestOptions): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "GET", options);
  }

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: ExtendedApiRequestOptions
  ): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "POST", { ...options, body });
  }

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: ExtendedApiRequestOptions
  ): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "PATCH", { ...options, body });
  }

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: ExtendedApiRequestOptions
  ): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "PUT", { ...options, body });
  }

  delete<T>(endpoint: string, options?: ExtendedApiRequestOptions): Promise<ActionResponse<T>> {
    return this.request<T>(endpoint, "DELETE", options);
  }

  async fetcher<T>(endpoint: string, options?: ExtendedApiRequestOptions): Promise<T> {
    const response = await this.get<T>(endpoint, options);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch data from server.");
    }

    const payload = response.data;
    if (payload && typeof payload === "object" && "data" in payload && (payload as { data: T }).data !== undefined) {
      return (payload as { data: T }).data;
    }

    return payload as T;
  }
}

export const apiClient = new ApiClient(getBackendBaseUrl);
