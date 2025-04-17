import { Task } from '@/types/tasks'

/**
 * Interface for custom tasks storage
 */
export interface CustomTasksStorage {
  [expansionKey: string]: {
    weekly: Task[]
  }
}

/**
 * Interface for UI Settings
 */
export interface UISettings {
  reputationSettings?: {
    showExalted: boolean
    showParagon: boolean
  }
}

/**
 * Interface for reputation methods settings
 */
export interface ReputationMethodsSettings {
  completedMethods: Record<string, boolean>
}

/**
 * Interface for saved task state
 */
export interface SavedTaskState {
  completed: boolean
  count?: number
  lastCompleted?: number
  deleted?: boolean
}

/**
 * Interface for application settings
 */
export interface AppSettings {
  tasks?: { [taskId: string]: SavedTaskState }
  uiSettings?: UISettings
  reputationMethods?: ReputationMethodsSettings
}
