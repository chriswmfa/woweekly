<template>
  <div>
    <v-container class="pb-6">
      <!-- Expansion Tabs -->
      <expansion-tabs
        :expansions="tasksData.expansions"
        v-model="currentExpansion"
      />

      <!-- Task Type Filters -->
      <task-type-filters
        :all-task-types="allTaskTypes"
        :enabled-task-types="enabledTaskTypes"
        @update:enabled-task-types="enabledTaskTypes = $event"
      />

      <v-window v-model="currentExpansion" class="mt-5">
        <v-window-item v-for="(expansion, key) in tasksData.expansions" :key="key" :value="key">
          <!-- Progress Bars -->
          <task-progress
            :weekly-completion="getWeeklyCompletion(key)"
            :weekly-completed="getCompletedTasksCount(key, 'weekly')"
            :weekly-total="getVisibleTasksCount(key, 'weekly')"
          />

          <!-- Tasks Section -->
          <v-row justify="start" class="mb-4">
            <!-- Weekly Task List -->
            <v-col cols="12">
              <!-- Completion Banner -->
              <task-completion-banner
                :weekly-completion="getWeeklyCompletion(key)"
                :expansion-name="tasksData.expansions[key].name"
              />
              <task-list
                :tasks="getFilteredTasks(key, 'weekly')"
                type="weekly"
                :enabled-task-types="enabledTaskTypes"
                @update:tasks="updateTasks($event)"
                @delete:task="deleteTask($event)"
              />
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>

      <!-- Reset Progress Button -->
      <v-row justify="center" class="mt-5">
        <v-col cols="12" sm="6" md="4">
          <v-btn
            color="error"
            block
            prepend-icon="mdi-delete"
            @click="confirmResetProgress"
          >
            Reset All Progress
          </v-btn>
        </v-col>
      </v-row>

      <!-- Reset Confirmation Dialog -->
      <v-dialog v-model="showResetDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5">Reset Progress</v-card-title>
          <v-card-text>Are you sure you want to reset all task progress? This action cannot be undone.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="showResetDialog = false">Cancel</v-btn>
            <v-btn color="error" @click="resetAllProgress">Reset All</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { TasksData, Task } from '@/types/tasks'

// Import components
import ExpansionTabs from '@/components/tasks/ExpansionTabs.vue'
import TaskTypeFilters from '@/components/tasks/TaskTypeFilters.vue'
import TaskProgress from '@/components/tasks/TaskProgress.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskCompletionBanner from '@/components/tasks/TaskCompletionBanner.vue'

// Setup Vuex store
const store = useStore()

// Track the current selected expansion tab
const currentExpansion = ref('tww') // Default to The War Within

// Dialog control for reset confirmation
const showResetDialog = ref(false)

// Get task data from store
const tasksData = computed<TasksData>(() => ({
  expansions: store.getters.getExpansions
}))

// Get all unique task types from the data
const allTaskTypes = computed(() => {
  const types = new Set<string>()

  Object.values(tasksData.value.expansions).forEach(expansion => {
    expansion.weekly.forEach(task => types.add(task.type))
  })

  return Array.from(types).sort()
})

// Track which task types are enabled for filtering
const enabledTaskTypes = ref<string[]>([])

// Initialize with all task types enabled and load saved progress
onMounted(() => {
  enabledTaskTypes.value = [...allTaskTypes.value]
  // Initialize store to load saved progress
  store.dispatch('initializeStore')
})

// Get filtered tasks for an expansion and type
const getFilteredTasks = (expansionKey: string | number, taskType: 'weekly') => {
  // Get tasks with saved progress applied from store
  const key = String(expansionKey)
  const tasks = store.getters.getTasksWithProgress(key, taskType)
  // Apply type filtering
  return tasks.filter((task: Task) => enabledTaskTypes.value.includes(task.type))
}

// Update a task in the store or add a new custom task
const updateTasks = (task: Task) => {
  // Get current tasks to check if the task exists
  const currentTasks = tasksData.value.expansions[currentExpansion.value].weekly
  // If it's an existing task being updated
  if (currentTasks.some(t => t.id === task.id)) {
    store.dispatch('updateTask', {
      taskId: task.id,
      completed: task.completed,
      currentCount: task.currentCount,
      notes: task.notes
    })
  } else {
    // If it's a new custom task being added
    // Add expansion key and taskType to the task object
    const customTask = {
      ...task,
      expansionKey: currentExpansion.value,
      taskType: 'weekly'
    }
    // Dispatch action to add custom task
    store.dispatch('addCustomTask', customTask)
  }
}

// Delete a task
const deleteTask = (taskId: string) => {
  store.dispatch('deleteTask', {
    taskId,
    expansionKey: currentExpansion.value
  })
}

// Helper function for getting task counts that respects filters
const getVisibleTasksCount = (expansionKey: string | number, taskType: 'weekly') => {
  const key = String(expansionKey)
  const tasks = store.getters.getTasksWithProgress(key, taskType)
  return tasks.filter((task: Task) => enabledTaskTypes.value.includes(task.type)).length
}

const getCompletedTasksCount = (expansionKey: string | number, taskType: 'weekly') => {
  const key = String(expansionKey)
  const tasks = store.getters.getTasksWithProgress(key, taskType)
  return tasks.filter((task: Task) =>
    enabledTaskTypes.value.includes(task.type) &&
    isTaskCompleted(task)
  ).length
}

// Check if a task is completed (utility function)
const isTaskCompleted = (task: Task) => {
  if (task.isCountable && task.currentCount !== undefined && task.targetCount !== undefined) {
    return task.currentCount >= task.targetCount
  }
  return task.completed
}

const getWeeklyCompletion = (expansionKey: string | number) => {
  const key = String(expansionKey)
  const tasks = store.getters.getTasksWithProgress(key, 'weekly')
  const filteredTasks = tasks.filter((task: Task) => enabledTaskTypes.value.includes(task.type))
  const completed = filteredTasks.filter((t: Task) => isTaskCompleted(t)).length
  return filteredTasks.length > 0 ? (completed / filteredTasks.length) * 100 : 0
}

// Reset progress confirmation
const confirmResetProgress = () => {
  showResetDialog.value = true
}

// Reset all progress
const resetAllProgress = () => {
  store.dispatch('resetProgress')
  showResetDialog.value = false
}
</script>
