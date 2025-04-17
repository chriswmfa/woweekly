<template>
  <div>
    <v-dialog v-model="showAddTaskDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-plus" class="mr-2"></v-icon>
          Add New Task
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="newTask.title"
            label="Task Title"
            placeholder="Enter task title"
            required
          ></v-text-field>

          <v-text-field
            v-model="newTask.subtitle"
            label="Task Subtitle"
            placeholder="Enter task subtitle"
          ></v-text-field>

          <v-select
            v-model="newTask.type"
            :items="taskTypes"
            label="Task Type"
            item-title="text"
            item-value="value"
            required
          ></v-select>

          <v-combobox
            v-model="newTask.tags"
            :items="availableTags"
            label="Tags (Required)"
            item-title="text"
            item-value="value"
            return-object
            multiple
            chips
            closable-chips
            clearable
            required
            hint="Select at least one tag to categorize this task"
          ></v-combobox>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeAddTaskDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="addTask">
            Add Task
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="task-card" elevation="3" color="surface">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon :color="type === 'weekly' ? 'primary' : 'success'" class="mr-2">
            mdi-calendar-week
          </v-icon>
          Weekly Task List
        </div>
        <v-btn
          color="primary"
          size="small"
          @click="openAddTaskDialog"
          style="text-transform: none;"
        >
          <v-icon size="small" class="mr-1">mdi-plus</v-icon>
          Add Custom Task
        </v-btn>
      </v-card-title>
      <v-divider class="border-opacity-15"></v-divider>
      <v-card-text>
        <v-list bg-color="transparent">
          <template v-if="tasksByType.length === 0">
            <v-list-item>
              <v-list-item-title class="text-center text-grey">No tasks match your filters</v-list-item-title>
            </v-list-item>
          </template>

          <template v-for="(group, index) in tasksByType" :key="group.type">
            <!-- Task Type Header -->
            <v-list-subheader class="d-flex align-center px-1">
              <v-icon size="small" :color="getTaskTypeColor(group.type)" class="mr-2">
                {{ getTaskTypeIcon(group.type) }}
              </v-icon>
              <span class="text-subtitle-2 font-weight-medium">{{ formatTaskType(group.type) }}</span>
            </v-list-subheader>

            <!-- Divider -->
            <v-divider class="mx-2"></v-divider>

            <!-- Tasks for this type -->
            <task-item
              v-for="task in group.tasks"
              :key="task.id"
              :task="task"
              @update="$emit('update:tasks', $event)"
              @delete:task="$emit('delete:task', $event)"
            />

            <!-- Add spacing between groups except after the last one -->
            <div v-if="index < tasksByType.length - 1" class="mt-4"></div>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { PropType } from 'vue'
import type { Task } from '@/types/tasks'
import TaskItem from './TaskItem.vue'
import { getTaskTypeIcon, getTaskTypeColor, TaskTypeData } from '@/types/tasks'
import { snackbarService } from '@/services/snackbarService'

const props = defineProps({
  tasks: {
    type: Array as PropType<Task[]>,
    required: true
  },
  type: {
    type: String as PropType<'weekly'>,
    required: true,
    validator: (value: string) => ['weekly'].includes(value)
  },
  enabledTaskTypes: {
    type: Array as PropType<string[]>,
    required: true
  }
})

const emit = defineEmits(['update:tasks', 'delete:task'])

const showAddTaskDialog = ref(false)
const newTask = ref({
  id: '',
  title: '',
  subtitle: '',
  type: '',
  tags: [] as (string | { text: string, value: string })[],
  completed: false
})

const taskTypes = [
  { text: 'Checkbox', value: 'checkbox' }
]

// Generate available tags from TaskTypeData
const availableTags = Object.entries(TaskTypeData).map(([key, value]) => ({
  text: value.name,
  value: key
}))

const openAddTaskDialog = () => {
  showAddTaskDialog.value = true
}

const closeAddTaskDialog = () => {
  showAddTaskDialog.value = false
  resetNewTask()
}

const resetNewTask = () => {
  newTask.value = {
    id: '',
    title: '',
    subtitle: '',
    type: '',
    tags: [],
    completed: false
  }
}

const addTask = () => {
  if (!newTask.value.title || !newTask.value.type || newTask.value.tags.length === 0) {
    return
  }

  const firstTag = newTask.value.tags[0]
  const primaryTag = typeof firstTag === 'object' && 'value' in firstTag
    ? firstTag.value
    : firstTag as string

  const taskToAdd: Task = {
    id: uuidv4(),
    name: newTask.value.title,
    subtitle: newTask.value.subtitle || '',
    type: primaryTag,
    completed: false,
    tags: newTask.value.tags.map(tag => {
      if (typeof tag === 'object' && 'value' in tag) {
        return tag.value
      }
      return tag as string
    })
  }

  emit('update:tasks', taskToAdd)
  // Show success message when task is added
  snackbarService.showInfo(`Task "${taskToAdd.name}" added successfully`)

  closeAddTaskDialog()
}

// Filter tasks first
const filteredTasks = computed(() => {
  return props.tasks.filter(task => props.enabledTaskTypes.includes(task.type))
})

// Group tasks by type
const tasksByType = computed(() => {
  const groupedTasks: { type: string; tasks: Task[] }[] = []

  // First group tasks by type
  const tasksByTypeMap = new Map<string, Task[]>()

  filteredTasks.value.forEach(task => {
    if (!tasksByTypeMap.has(task.type)) {
      tasksByTypeMap.set(task.type, [])
    }
    tasksByTypeMap.get(task.type)?.push(task)
  })

  // Convert map to array and sort by type
  Array.from(tasksByTypeMap.entries()).forEach(([type, tasks]) => {
    groupedTasks.push({ type, tasks })
  })

  // Sort groups by type name alphabetically
  return groupedTasks.sort((a, b) => {
    const nameA = TaskTypeData[a.type]?.name || a.type
    const nameB = TaskTypeData[b.type]?.name || b.type
    return nameA.localeCompare(nameB)
  })
})

// Format task type for display
const formatTaskType = (type: string): string => {
  return TaskTypeData[type]?.name || type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<style scoped>
.task-card {
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
}
</style>
