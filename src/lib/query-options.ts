//src/lib/query-options.ts

export const NO_CACHE_QUERY_CONFIG = {
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: "always" as const,
  refetchOnWindowFocus: true,
};
