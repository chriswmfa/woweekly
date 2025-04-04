<template>
  <div>
    <v-btn
      color="primary"
      class="mb-3"
      @click="openAddTaskDialog"
    >
      Add Task
    </v-btn>

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
      <v-card-title>
        <v-icon :color="type === 'weekly' ? 'primary' : 'success'" class="mr-2">
          mdi-calendar-week
        </v-icon>
        Weekly Task List
      </v-card-title>
      <v-divider class="border-opacity-15"></v-divider>
      <v-card-text>
        <v-list bg-color="transparent">
          <task-item
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            @update="updateTask($event)"
            @delete:task="deleteTask($event)"
          />
          <v-list-item v-if="filteredTasks.length === 0">
            <v-list-item-title class="text-center text-grey">No tasks match your filters</v-list-item-title>
          </v-list-item>
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
import { TaskTag } from '@/types/tasks'

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
  tags: [] as string[],
  completed: false,
  isCountable: false,
  currentCount: 0,
  targetCount: 1
})

const taskTypes = [
  { text: 'Checkbox', value: 'checkbox' },
  { text: 'Countable', value: 'countable' }
]

const availableTags = Object.entries(TaskTag).map(([key, value]) => ({
  text: value,
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
    completed: false,
    isCountable: false,
    currentCount: 0,
    targetCount: 1
  }
}

const addTask = () => {
  if (!newTask.value.title || !newTask.value.type || newTask.value.tags.length === 0) {
    return
  }

  const primaryTag = typeof newTask.value.tags[0] === 'object'
    ? newTask.value.tags[0].value
    : newTask.value.tags[0]

  const taskToAdd: Task = {
    id: uuidv4(),
    name: newTask.value.title,
    subtitle: newTask.value.subtitle || '',
    type: primaryTag,
    icon: 'mdi-check-circle',
    completed: false,
    isCountable: newTask.value.type === 'countable',
    currentCount: newTask.value.type === 'countable' ? 0 : undefined,
    targetCount: newTask.value.type === 'countable' ? 1 : undefined,
    tags: newTask.value.tags.map(tag => typeof tag === 'object' ? tag.value : tag)
  }

  emit('update:tasks', taskToAdd)

  closeAddTaskDialog()
}

const filteredTasks = computed(() => {
  return props.tasks.filter(task => props.enabledTaskTypes.includes(task.type))
})

const updateTask = (updatedTask: Task) => {
  emit('update:tasks', updatedTask)
}

const deleteTask = (taskId: string) => {
  emit('delete:task', taskId)
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
