import { createStore } from 'vuex'
import tasksJson from '@/data/tasks.json'
import type { TasksData, SavedTasksState, Task } from '@/types/tasks'
import StorageService from '@/services/storageService'

interface State {
  tasksData: TasksData,
  savedProgress: SavedTasksState | null,
  customTasks: {
    [expansionKey: string]: {
      daily: Task[],
      weekly: Task[]
    }
  } | null
}

export default createStore<State>({
  state: {
    tasksData: tasksJson as TasksData,
    savedProgress: null,
    customTasks: null
  },
  getters: {
    // Get all expansion data
    getExpansions (state): {[key: string]: TasksData['expansions'][string]} {
      const result = { ...state.tasksData.expansions }

      // Merge custom tasks with base task data
      if (state.customTasks) {
        Object.keys(state.customTasks).forEach(expansionKey => {
          if (!result[expansionKey]) {
            result[expansionKey] = {
              name: expansionKey,
              daily: [],
              weekly: []
            }
          }

          // Add custom daily tasks
          if (state.customTasks?.[expansionKey]?.daily?.length) {
            result[expansionKey].daily = [
              ...result[expansionKey].daily,
              ...state.customTasks[expansionKey].daily
            ]
          }

          // Add custom weekly tasks
          if (state.customTasks?.[expansionKey]?.weekly?.length) {
            result[expansionKey].weekly = [
              ...result[expansionKey].weekly,
              ...state.customTasks[expansionKey].weekly
            ]
          }
        })
      }

      return result
    },

    // Get tasks with their saved progress applied
    getTasksWithProgress: (state, getters) => (expansionKey: string, taskType: 'daily' | 'weekly') => {
      // Get tasks including custom tasks
      const expansions = getters.getExpansions
      const tasks = expansions[expansionKey]?.[taskType] || []

      if (!state.savedProgress) {
        return tasks
      }

      // Apply saved progress to each task
      return tasks.map((task: Task) => {
        const savedTask = state.savedProgress?.[task.id]
        if (!savedTask) {
          return task
        }

        return {
          ...task,
          completed: savedTask.completed,
          currentCount: task.isCountable ? (savedTask.currentCount || 0) : undefined,
          notes: savedTask.notes || ''
        }
      })
    }
  },
  mutations: {
    // Load the saved progress from localStorage
    LOAD_SAVED_PROGRESS (state) {
      state.savedProgress = StorageService.loadTasksState()
    },

    // Load custom tasks from localStorage
    LOAD_CUSTOM_TASKS (state) {
      state.customTasks = StorageService.loadCustomTasks()
    },

    // Update a task's completion state
    UPDATE_TASK (state, payload: { taskId: string, completed: boolean, currentCount?: number, notes?: string }) {
      const { taskId, completed, currentCount, notes } = payload

      if (!state.savedProgress) {
        state.savedProgress = {}
      }

      // Create or update the task state
      state.savedProgress[taskId] = {
        completed,
        ...(currentCount !== undefined ? { currentCount } : {}),
        ...(notes !== undefined ? { notes } : {})
      }

      // Save the updated state to localStorage
      StorageService.saveTasksState(state.savedProgress)
    },

    // Reset task progress for all tasks
    RESET_TASK_PROGRESS (state) {
      state.savedProgress = {}
      StorageService.resetTasksState()
    },

    // Add a new mutation for adding custom tasks
    ADD_CUSTOM_TASK (state, task: Task & { expansionKey: string, taskType: 'daily' | 'weekly' }) {
      // Initialize custom tasks if needed
      if (!state.customTasks) {
        state.customTasks = {}
      }

      // Create expansion structure if it doesn't exist
      if (!state.customTasks[task.expansionKey]) {
        state.customTasks[task.expansionKey] = {
          daily: [],
          weekly: []
        }
      }

      // Add the custom task to the appropriate expansion and task type
      if ((task.taskType === 'daily' || task.taskType === 'weekly')) {
        // Remove the extra properties before adding to the task list
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { expansionKey, taskType, ...cleanTask } = task

        // Add to the appropriate task list
        state.customTasks[task.expansionKey][task.taskType].push(cleanTask as Task)

        // Initialize the task's progress state
        if (!state.savedProgress) {
          state.savedProgress = {}
        }

        state.savedProgress[task.id] = {
          completed: task.completed || false,
          currentCount: task.isCountable ? (task.currentCount || 0) : undefined,
          notes: task.notes || ''
        }

        // Save to localStorage
        StorageService.saveTasksState(state.savedProgress)
        StorageService.saveCustomTasks(state.customTasks)
      }
    },

    // Add a new mutation for deleting tasks
    DELETE_TASK (state, payload: { taskId: string, expansionKey: string }) {
      const { taskId, expansionKey } = payload

      // First check if this is a custom task
      let deleted = false

      if (state.customTasks && state.customTasks[expansionKey]) {
        // Try to delete from custom tasks
        const taskTypes = ['daily', 'weekly'] as const

        taskTypes.forEach((taskType) => {
          if (state.customTasks?.[expansionKey]?.[taskType]) {
            const taskList = state.customTasks[expansionKey][taskType]
            const taskIndex = taskList.findIndex((task: Task) => task.id === taskId)

            if (taskIndex !== -1) {
              // Remove the task from the array
              taskList.splice(taskIndex, 1)
              deleted = true
            }
          }
        })

        // Save updated custom tasks if a deletion occurred
        if (deleted) {
          StorageService.saveCustomTasks(state.customTasks)
        }
      }

      // Also remove the task's saved state
      if (state.savedProgress && state.savedProgress[taskId]) {
        delete state.savedProgress[taskId]
        // Save the updated state to localStorage
        StorageService.saveTasksState(state.savedProgress)
      }
    }
  },
  actions: {
    // Initialize by loading saved progress and custom tasks
    initializeStore ({ commit }) {
      commit('LOAD_SAVED_PROGRESS')
      commit('LOAD_CUSTOM_TASKS')
    },

    // Update a task
    updateTask ({ commit }, payload: { taskId: string, completed: boolean, currentCount?: number, notes?: string }) {
      commit('UPDATE_TASK', payload)
    },

    // Reset all progress
    resetProgress ({ commit }) {
      commit('RESET_TASK_PROGRESS')
    },

    // Add a new action to add custom tasks
    addCustomTask ({ commit }, task) {
      commit('ADD_CUSTOM_TASK', task)
    },

    // Add a new action to delete tasks
    deleteTask ({ commit }, payload: { taskId: string, expansionKey: string }) {
      commit('DELETE_TASK', payload)
    }
  },
  modules: {
  }
})
