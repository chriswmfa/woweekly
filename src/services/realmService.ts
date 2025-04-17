import axios from 'axios'
import { CacheService } from './cacheService'

// Client credentials for Blizzard API
const CLIENT_ID = '6a8e84e3100e4485b050d5a3a044378f'
const CLIENT_SECRET = 'DUT2MLD9jVSlWOzNDPYjIi3MC48cFBec'

// Cache keys for realm data
const EU_REALMS_CACHE_KEY = 'eu_realms'
const US_REALMS_CACHE_KEY = 'us_realms'

// Cache for access token to prevent unnecessary token requests
let accessTokenCache: {
  token: string,
  expiry: number
} | null = null

/**
 * Gets an OAuth access token for the Blizzard API
 * @param region The region to authenticate with
 * @returns Access token for API requests
 */
async function getAccessToken (region: string): Promise<string> {
  // Check if we have a cached token that's still valid
  if (accessTokenCache && accessTokenCache.expiry > Date.now()) {
    return accessTokenCache.token
  }

  try {
    // Request new token using client credentials flow
    const tokenResponse = await axios({
      method: 'post',
      url: `https://${region}.battle.net/oauth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET
      },
      data: 'grant_type=client_credentials'
    })

    // Cache the new token with expiry
    const expiresIn = tokenResponse.data.expires_in * 1000 // Convert to milliseconds
    accessTokenCache = {
      token: tokenResponse.data.access_token,
      expiry: Date.now() + expiresIn - 60000 // Expire 1 minute early to be safe
    }

    return accessTokenCache.token
  } catch (error) {
    console.error('Error getting Blizzard access token:', error)
    throw new Error('Failed to authenticate with Blizzard API')
  }
}

/**
 * Interface for realm data from Blizzard API
 */
export interface Realm {
  id: number
  name: string
  slug: string
  timezone: string
  isTournament: boolean
  locale: string
}

/**
 * Fetch realms list for a specific region with caching support
 * @param region Either 'eu' or 'us'
 * @param forceRefresh Set to true to bypass cache and force a new API request
 * @returns Array of realm data or undefined on error
 */
export async function fetchRealms (region: string, forceRefresh = false): Promise<Realm[] | undefined> {
  try {
    // Use different cache keys for different regions
    const cacheKey = region === 'eu' ? EU_REALMS_CACHE_KEY : US_REALMS_CACHE_KEY

    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedData = CacheService.getCache<Realm[]>(cacheKey)
      if (cachedData) {
        console.log(`Using cached realm data for ${region}`)
        return cachedData
      }
    }

    // Get access token
    const token = await getAccessToken(region)

    // Get the correct locale based on region
    const locale = region === 'eu' ? 'en_GB' : 'en_US'

    // Build the URL with query parameters for namespace and locale
    const url = `https://${region}.api.blizzard.com/data/wow/realm/index`
    const params = {
      namespace: `dynamic-${region}`,
      locale
    }

    // Make the API request
    const response = await axios({
      method: 'get',
      url,
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Extract realms from response and sort alphabetically
    const realms = response.data.realms
    if (realms) {
      realms.sort((a: Realm, b: Realm) => a.name.localeCompare(b.name))

      // Store in cache (1 day default expiry - realms don't change often)
      CacheService.setCache(cacheKey, realms, 24 * 60 * 60 * 1000)
    }

    return realms
  } catch (error) {
    console.error(`Error fetching realms for ${region}:`, error)
    return undefined
  }
}
