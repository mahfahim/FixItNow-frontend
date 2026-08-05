//src/lib/query-options.ts

// src/lib/query-options.ts

/**
 * রিয়েল-টাইম এবং নো-ক্যাচ ডাটা ফেচিংয়ের জন্য TanStack Query Preset
 */
export const NO_CACHE_QUERY_CONFIG = {
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: "always" as const,
  refetchOnWindowFocus: true,
};
