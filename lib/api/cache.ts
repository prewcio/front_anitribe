export const cache = new Map<string, { data: any; timestamp: number }>();

export function clearCache() {
  cache.clear();
}

export function removeFromCache(key: string) {
  cache.delete(key);
}

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds 