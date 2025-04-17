import CryptoJS from 'crypto-js'
import { SavedTasksState } from '@/types/tasks'
import { CustomTasksStorage } from '@/types/storage'

// The keys used for encryption/decryption and storage (you can change these)
const ENCRYPTION_KEY = 'weekly-wow-tasks-secure-key'
const STORAGE_KEY = 'save-state'
const CUSTOM_TASKS_KEY = 'weekly-wow-custom-tasks'
const CHARACTER_INFO_KEY = 'character-info'

// Character info type
interface CharacterInfo {
  name: string
  realm: string
  region: string
}

/**
 * Service for encrypting and storing task progress in localStorage
 */
export class StorageService {
  /**
   * Save task completion data to localStorage with encryption
   * @param data The task completion data to save
   */
  static saveTasksState (data: SavedTasksState): void {
    try {
      // Convert data to JSON string
      const jsonString = JSON.stringify(data)

      // Encrypt the JSON string
      const encryptedData = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()

      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, encryptedData)
    } catch (error) {
      console.error('Error saving task state:', error)
    }
  }

  /**
   * Load task completion data from localStorage and decrypt it
   * @returns The decrypted task state or null if not found or invalid
   */
  static loadTasksState (): SavedTasksState | null {
    try {
      // Get encrypted data from localStorage
      const encryptedData = localStorage.getItem(STORAGE_KEY)

      // If no data found, return null
      if (!encryptedData) {
        return null
      }

      // Decrypt the data
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
      const jsonString = decryptedBytes.toString(CryptoJS.enc.Utf8)

      // Parse the JSON string
      if (jsonString) {
        return JSON.parse(jsonString) as SavedTasksState
      }

      return null
    } catch (error) {
      console.error('Error loading task state:', error)
      return null
    }
  }

  /**
   * Reset all saved task progress
   */
  static resetTasksState (): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Save custom tasks to localStorage with encryption
   * @param data The custom tasks data to save
   */
  static saveCustomTasks (data: CustomTasksStorage): void {
    try {
      // Convert data to JSON string
      const jsonString = JSON.stringify(data)

      // Encrypt the JSON string
      const encryptedData = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()

      // Store in localStorage
      localStorage.setItem(CUSTOM_TASKS_KEY, encryptedData)
    } catch (error) {
      console.error('Error saving custom tasks:', error)
    }
  }

  /**
   * Load custom tasks from localStorage and decrypt them
   * @returns The decrypted custom tasks or null if not found or invalid
   */
  static loadCustomTasks (): CustomTasksStorage | null {
    try {
      // Get encrypted data from localStorage
      const encryptedData = localStorage.getItem(CUSTOM_TASKS_KEY)

      // If no data found, return null
      if (!encryptedData) {
        return null
      }

      // Decrypt the data
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
      const jsonString = decryptedBytes.toString(CryptoJS.enc.Utf8)

      // Parse the JSON string
      if (jsonString) {
        return JSON.parse(jsonString) as CustomTasksStorage
      }

      return null
    } catch (error) {
      console.error('Error loading custom tasks:', error)
      return null
    }
  }

  /**
   * Reset all custom tasks
   */
  static resetCustomTasks (): void {
    localStorage.removeItem(CUSTOM_TASKS_KEY)
  }

  /**
   * Save character information to localStorage
   * @param characterInfo The character information to save
   */
  static saveCharacterInfo (characterInfo: CharacterInfo): void {
    try {
      localStorage.setItem(CHARACTER_INFO_KEY, JSON.stringify(characterInfo))
    } catch (error) {
      console.error('Error saving character info:', error)
    }
  }

  /**
   * Get character information from localStorage
   * @returns The character information or null if not found
   */
  static getCharacterInfo (): CharacterInfo | null {
    try {
      const characterInfo = localStorage.getItem(CHARACTER_INFO_KEY)
      if (!characterInfo) {
        return null
      }
      return JSON.parse(characterInfo) as CharacterInfo
    } catch (error) {
      console.error('Error loading character info:', error)
      return null
    }
  }

  static clearAllData (): void {
    localStorage.clear();
  }
}

export default StorageService
