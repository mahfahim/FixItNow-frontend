// src/types/api.types.ts

/**
 * Add these to (or merge with) `src/types/index.ts`.
 * Kept as a dedicated file here since the project's existing `types/index.ts`
 * was not provided, to avoid overwriting types already defined there.
 */

/**
 * Local mirror of Next.js's `fetch` cache config, so we don't depend on
 * Next's internal (non-public) type paths.
 */
export interface NextFetchCacheConfig {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Standard shape returned by every Server Action.
 * Mirrors the backend's existing response contract: `{ success, message, data? }`.
 * `T` is the shape of `data` for a given action.
 */
export interface ActionResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface ApiRequestOptions {
  /** Extra/override headers merged on top of the default + auth headers. */
  headers?: HeadersInit;
  /** Per-request timeout override, in milliseconds. */
  timeoutMs?: number;
  /** Standard `fetch` cache mode (e.g. `"no-store"`). */
  cache?: RequestCache;
  /** Next.js fetch cache config (`revalidate`, `tags`). */
  next?: NextFetchCacheConfig;
}