import { reactive } from 'vue'

// Define interface for cached items
export interface CachedItem<T> {
  data: T
  expiry: number
  timestamp: number
}

// Define interface for cache status
export interface CacheStatus {
  [key: string]: {
    isCached: boolean
    expiresAt: number
    timestamp: number
  }
}

// Default cache duration (1 hour in milliseconds)
const DEFAULT_CACHE_DURATION = 60 * 60 * 1000

// Reactive object to track cache status across components
export const cacheState = reactive<CacheStatus>({})

/**
 * Service for caching data in localStorage with expiration
 */
export class CacheService {
  /**
   * Store data in cache with expiration
   * @param key Unique identifier for the cached data
   * @param data The data to cache
   * @param duration How long to keep the cache valid (in milliseconds), defaults to 1 hour
   */
  static setCache<T> (key: string, data: T, duration: number = DEFAULT_CACHE_DURATION): void {
    try {
      const now = Date.now()
      const expiry = now + duration

      // Create cached item
      const cacheItem: CachedItem<T> = {
        data,
        expiry,
        timestamp: now
      }

      // Store in localStorage (with key prefix to avoid conflicts)
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem))

      // Update reactive cache state
      cacheState[key] = {
        isCached: true,
        expiresAt: expiry,
        timestamp: now
      }
    } catch (error) {
      console.error(`Error setting cache for ${key}:`, error)
    }
  }

  /**
   * Retrieve data from cache if still valid
   * @param key The identifier for the cached data
   * @returns The cached data or null if expired or not found
   */
  static getCache<T> (key: string): T | null {
    try {
      // Get from localStorage
      const cacheJson = localStorage.getItem(`cache_${key}`)

      if (!cacheJson) {
        // Update cache state to show not cached
        cacheState[key] = {
          isCached: false,
          expiresAt: 0,
          timestamp: 0
        }
        return null
      }

      // Parse the cached item
      const cacheItem = JSON.parse(cacheJson) as CachedItem<T>
      const now = Date.now()

      // Check if cache is still valid
      if (cacheItem.expiry > now) {
        // Update cache state
        cacheState[key] = {
          isCached: true,
          expiresAt: cacheItem.expiry,
          timestamp: cacheItem.timestamp
        }
        return cacheItem.data
      } else {
        // Cache expired, update state
        cacheState[key] = {
          isCached: false,
          expiresAt: 0,
          timestamp: cacheItem.timestamp
        }
        // Remove expired item
        localStorage.removeItem(`cache_${key}`)
        return null
      }
    } catch (error) {
      console.error(`Error retrieving cache for ${key}:`, error)
      return null
    }
  }

  /**
   * Check if a cache entry exists and is valid
   * @param key The cache key to check
   * @returns True if the cache exists and is valid
   */
  static hasCacheValid (key: string): boolean {
    try {
      const cacheJson = localStorage.getItem(`cache_${key}`)
      if (!cacheJson) return false

      const cacheItem = JSON.parse(cacheJson) as CachedItem<unknown>
      return cacheItem.expiry > Date.now()
    } catch (error) {
      return false
    }
  }

  /**
   * Clear a specific cache entry
   * @param key The key of the cache to clear
   */
  static clearCache (key: string): void {
    localStorage.removeItem(`cache_${key}`)

    // Update cache state
    if (cacheState[key]) {
      cacheState[key].isCached = false
      cacheState[key].expiresAt = 0
    }
  }

  /**
   * Clear all cache entries
   */
  static clearAllCache (): void {
    // Find all cache entries in localStorage
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('cache_')) {
        keysToRemove.push(key)
      }
    }

    // Remove each cache entry
    keysToRemove.forEach(key => localStorage.removeItem(key))

    // Reset cache state
    Object.keys(cacheState).forEach(key => {
      cacheState[key] = {
        isCached: false,
        expiresAt: 0,
        timestamp: 0
      }
    })
  }

  /**
   * Get time remaining until cache expiry
   * @param key The cache key
   * @returns Time remaining in milliseconds, or 0 if expired/not found
   */
  static getTimeRemaining (key: string): number {
    try {
      const cacheJson = localStorage.getItem(`cache_${key}`)
      if (!cacheJson) return 0

      const cacheItem = JSON.parse(cacheJson) as CachedItem<unknown>
      const now = Date.now()

      return Math.max(0, cacheItem.expiry - now)
    } catch (error) {
      return 0
    }
  }

  /**
   * Force refresh a cache entry
   * @param key The key of the cache to refresh
   * @param fetchFunction The async function that fetches fresh data
   * @param duration Cache duration in milliseconds
   * @returns The fresh data
   */
  static async refreshCache<T> (
    key: string,
    fetchFunction: () => Promise<T>,
    duration: number = DEFAULT_CACHE_DURATION
  ): Promise<T | null> {
    try {
      // Clear existing cache
      this.clearCache(key)

      // Fetch new data
      const freshData = await fetchFunction()

      // Store in cache
      this.setCache(key, freshData, duration)

      return freshData
    } catch (error) {
      console.error(`Error refreshing cache for ${key}:`, error)
      return null
    }
  }
}
