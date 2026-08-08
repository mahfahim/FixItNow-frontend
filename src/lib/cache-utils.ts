
// src/lib/cache-utils.ts
import { CACHE_REVALIDATE_SECONDS } from "./constants";

export interface BaseCacheOptions {
  useCache?: boolean;
  cache?: RequestCache;
  revalidateSeconds?: number;
  tags?: string[];
}

export function getCacheConfig(options: BaseCacheOptions = {}) {
  const {
    useCache = true,
    cache,
    revalidateSeconds = CACHE_REVALIDATE_SECONDS.SHORT,
    tags = [],
  } = options;

  
  if (!useCache || cache === "no-store") {
    return {
      cache: "no-store" as RequestCache,
      next: { revalidate: 0 },
    };
  }


  return {
    cache,
    next: {
      revalidate: revalidateSeconds,
      ...(tags.length > 0 ? { tags } : {}),
    },
  };
}
