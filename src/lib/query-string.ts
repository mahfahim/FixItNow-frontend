// src/lib/query-string.ts

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
