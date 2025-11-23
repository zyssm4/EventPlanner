interface CacheEntry<T> {
  data: T;
  expiry: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    const expiry = Date.now() + ttl;

    this.cache.set(key, { data, expiry });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  deletePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern.replace('*', '.*'));

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Helper to generate cache keys
  static key(...parts: (string | number)[]): string {
    return parts.join(':');
  }

  // Cleanup expired entries
  cleanup(): number {
    let count = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  // Get or set pattern (cache-aside)
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, options);

    return data;
  }

  // Memory usage estimation
  getMemoryUsage(): { entries: number; estimatedBytes: number } {
    let estimatedBytes = 0;

    for (const [key, entry] of this.cache.entries()) {
      estimatedBytes += key.length * 2; // UTF-16
      estimatedBytes += JSON.stringify(entry.data).length * 2;
      estimatedBytes += 8; // expiry number
    }

    return {
      entries: this.cache.size,
      estimatedBytes
    };
  }
}

// Singleton instance
export const cache = new CacheService();

// Run cleanup every minute
setInterval(() => {
  cache.cleanup();
}, 60 * 1000);

// Cache key helpers
export const CacheKeys = {
  event: (eventId: string) => CacheService.key('event', eventId),
  events: (userId: string) => CacheService.key('events', userId),
  budget: (eventId: string) => CacheService.key('budget', eventId),
  checklist: (eventId: string) => CacheService.key('checklist', eventId),
  timeline: (eventId: string) => CacheService.key('timeline', eventId),
  suppliers: (userId: string) => CacheService.key('suppliers', userId),
  venue: (eventId: string) => CacheService.key('venue', eventId),
  user: (userId: string) => CacheService.key('user', userId)
};

// Cache invalidation helpers
export const invalidateEventCache = (eventId: string, userId: string): void => {
  cache.delete(CacheKeys.event(eventId));
  cache.delete(CacheKeys.events(userId));
  cache.delete(CacheKeys.budget(eventId));
  cache.delete(CacheKeys.checklist(eventId));
  cache.delete(CacheKeys.timeline(eventId));
  cache.delete(CacheKeys.venue(eventId));
};

export default cache;
