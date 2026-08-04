// src/lib/query-string.ts

/**
 * Serializes a flat options object into a URL query string, skipping
 * `undefined`, `null`, and empty-string values. Shared by every list/filter
 * Server Action to avoid re-implementing this per file.
 */
export function buildQueryString(
  options: Record<string, unknown> = {}
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}