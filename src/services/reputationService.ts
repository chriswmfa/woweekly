/* eslint-disable camelcase */
import axios from 'axios'
import { Reputation } from '@/types/reputation'
import { CacheService } from '@/services/cacheService'

// Client credentials for Blizzard API
const CLIENT_ID = '6a8e84e3100e4485b050d5a3a044378f'
const CLIENT_SECRET = 'DUT2MLD9jVSlWOzNDPYjIi3MC48cFBec'
const REGION = 'eu' // EU region
const LOCALE = 'en_GB'

// Cache key for reputations data
const REPUTATIONS_CACHE_KEY = 'character_reputations'

// Cache for access token to prevent unnecessary token requests
let accessTokenCache: {
  token: string,
  expiry: number
} | null = null

/**
 * Gets an OAuth access token for the Blizzard API
 * @returns Access token for API requests
 */
async function getAccessToken (): Promise<string> {
  // Check if we have a cached token that's still valid
  if (accessTokenCache && accessTokenCache.expiry > Date.now()) {
    return accessTokenCache.token
  }

  try {
    // Request new token using client credentials flow
    const tokenResponse = await axios({
      method: 'post',
      url: `https://${REGION}.battle.net/oauth/token`,
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
 * Fetch character reputations with caching support
 * @param forceRefresh Set to true to bypass cache and force a new API request
 * @returns Array of reputation data or undefined on error
 */
export async function fetchReputations (forceRefresh = false): Promise<Reputation[] | undefined> {
  try {
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedData = CacheService.getCache<Reputation[]>(REPUTATIONS_CACHE_KEY)
      if (cachedData) {
        console.log('Using cached reputation data')
        return cachedData
      }
    }

    // If no valid cache or force refresh, fetch from API
    console.log('Fetching fresh reputation data from API')

    // Set character and realm (these could be moved to parameters or configuration)
    const characterName = 'diz'
    const realmSlug = 'ravencrest'

    // Get access token
    const token = await getAccessToken()

    // Build the correct URL with query parameters for namespace and locale
    const url = `https://${REGION}.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/reputations`
    const params = {
      namespace: `profile-${REGION}`,
      locale: LOCALE
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

    // Extract reputations from response
    const reputations = response.data.reputations

    console.log(reputations)

    // Store in cache (1 hour default expiry)
    if (reputations) {
      CacheService.setCache(REPUTATIONS_CACHE_KEY, reputations)
    }

    return reputations
  } catch (error) {
    console.error('Error fetching reputations:', error)
    return undefined
  }
}
