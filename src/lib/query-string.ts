// src/lib/query-string.ts

/**
 * Serializes a flat options object into a URL query string, handling arrays
 * and skipping `undefined`, `null`, and empty-string values.
 */
export function buildQueryString(
  options: Record<string, unknown> = {}
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, String(item)));
      } else {
        params.append(key, String(value));
      }
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
