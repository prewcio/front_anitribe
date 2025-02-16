// Cache duration in milliseconds (30 minutes)
export const CACHE_DURATION = 30 * 60 * 1000;

export const cache = new Map<string, { data: any; timestamp: number }>();

export function clearCache() {
  cache.clear();
}

export function removeFromCache(key: string) {
  cache.delete(key);
} 