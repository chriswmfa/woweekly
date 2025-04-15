<template>
  <v-list-item
    :class="{'bg-success-subtle': isCompleted}"
    rounded="sm"
    class="mb-1 position-relative"
  >
    <template v-slot:prepend>
      <!-- Regular checkbox for non-countable tasks -->
      <v-checkbox
        v-if="!task.isCountable"
        density="compact"
        hide-details
        :model-value="task.completed"
        @click="updateCompleted(!task.completed)"
        color="success"
        class="mr-2"
      ></v-checkbox>

      <!-- Counter UI for countable tasks -->
      <div v-else class="d-flex align-center bg-primary-lighten-5 rounded px-1">
        <v-btn
          density="compact"
          size="small"
          icon="mdi-minus"
          variant="text"
          color="primary"
          @click="decrementCount"
          :disabled="task.currentCount === 0"
        ></v-btn>
        <div class="text-center mx-2">
          <span :class="{ 'text-success': isCompleted, 'font-weight-medium': true }">
            {{ task.currentCount }}/{{ task.targetCount }}
          </span>
        </div>
        <v-btn
          density="compact"
          size="small"
          icon="mdi-plus"
          variant="text"
          color="primary"
          @click="incrementCount"
          :disabled="isCompleted"
        ></v-btn>
      </div>
    </template>

    <div class="flex-grow-1">
      <v-list-item-title :class="{'text-decoration-line-through': isCompleted}">
        <div class="d-flex align-center">
          <a
            v-if="task.wowheadData"
            :href="getWowheadUrl(task.wowheadData)"
            target="_blank"
            class="task-link"
            @click.stop
            :class="{'text-decoration-line-through': isCompleted}"
          >
            {{ task.name }}
            <v-icon size="x-small" class="ms-1">mdi-open-in-new</v-icon>
          </a>
          <span v-else>{{ task.name }}</span>
          <div class="tags-container ms-2">
            <v-chip
              v-for="tag in task.tags"
              :key="tag"
              :color="getTagData(tag).color"
              class="ma-1"
              small
              variant="elevated"
              label
              density="compact"
            >
              {{ getTagData(tag).label }}
            </v-chip>
          </div>
        </div>
      </v-list-item-title>
      <v-list-item-subtitle class="d-flex align-center">
        {{ task.subtitle }}
      </v-list-item-subtitle>
    </div>

    <template v-slot:append>
      <div class="d-flex align-center">
        <v-btn
          icon="mdi-note-text"
          variant="text"
          density="comfortable"
          size="small"
          :color="hasNotes ? 'primary' : 'grey'"
          @click="openNotesDialog"
          class="mr-2"
        ></v-btn>
        <!-- More visible delete button -->
        <v-btn
          icon="mdi-delete"
          variant="outlined"
          density="comfortable"
          size="small"
          color="error"
          @click.stop="confirmDelete"
          :title="'Delete task'"
          class="delete-btn"
        ></v-btn>
      </div>
    </template>
  </v-list-item>

  <!-- Notes preview below the task item -->
  <div
    v-if="hasNotes"
    class="note-preview text-caption ms-14 mb-3 text-primary"
    style="margin-top: -8px; padding-left: 40px;"
  >
    <v-icon icon="mdi-note-text" size="x-small" class="mr-1" color="primary"></v-icon>
    {{ props.task.notes }}
  </div>

  <!-- Notes Dialog -->
  <v-dialog v-model="showNotesDialog" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-note-text" class="mr-2"></v-icon>
        Notes for: {{ task.name }}
      </v-card-title>

      <v-card-text>
        <v-textarea
          v-model="taskNotes"
          label="Add your notes here..."
          placeholder="E.g., Remember to use Group Finder for this task"
          auto-grow
          rows="4"
          counter
          variant="outlined"
          class="mt-2"
        ></v-textarea>

        <div class="text-caption text-medium-emphasis mt-2">
          Your notes are saved automatically and will persist across sessions.
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text variant="text" @click="clearNotes">
          Clear Notes
        </v-btn>
        <v-btn color="primary" @click="saveNotes">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="showDeleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5">Delete Task</v-card-title>
      <v-card-text>Are you sure you want to delete this task? This action cannot be undone.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDeleteDialog = false">Cancel</v-btn>
        <v-btn color="error" @click="deleteTask">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits, ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { Task } from '@/types/tasks'
import { TagData } from '@/types/tasks'
import { snackbarService } from '@/services/snackbarService'

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
})

const emit = defineEmits(['update', 'delete:task'])

// Notes dialog state
const showNotesDialog = ref(false)
const taskNotes = ref(props.task.notes || '')
const hasNotes = computed(() => Boolean(props.task.notes?.trim()))

// Check if the task is completed
const isCompleted = computed(() => {
  if (props.task.isCountable && props.task.currentCount !== undefined && props.task.targetCount !== undefined) {
    return props.task.currentCount >= props.task.targetCount
  }
  return props.task.completed
})

// Watch for changes in completion status to show snackbar message
watch(isCompleted, (newValue, oldValue) => {
  if (newValue === true && oldValue === false) {
    snackbarService.showSuccess() // Show random praise message
  }
}, { immediate: true })

// Helper functions for task updates
const updateCompleted = (value: boolean) => {
  const wasCompletedBefore = props.task.completed
  const updatedTask = { ...props.task, completed: value }

  // Show snackbar message if task is now completed (but wasn't before)
  if (value && !wasCompletedBefore) {
    snackbarService.showSuccess()
  } else if (!value && wasCompletedBefore) {
    snackbarService.showInfo('Task marked as incomplete')
  }

  emit('update', updatedTask)
}

const incrementCount = () => {
  if (props.task.isCountable && props.task.currentCount !== undefined && props.task.targetCount !== undefined) {
    if (props.task.currentCount < props.task.targetCount) {
      const newCount = props.task.currentCount + 1
      const newCompleted = newCount >= props.task.targetCount
      const wasCompletedBefore = props.task.currentCount >= props.task.targetCount

      const updatedTask = {
        ...props.task,
        currentCount: newCount,
        completed: newCompleted
      }

      // Show snackbar message if task is now completed (but wasn't before)
      if (newCompleted && !wasCompletedBefore) {
        snackbarService.showSuccess()
      }

      emit('update', updatedTask)
    }
  }
}

const decrementCount = () => {
  if (props.task.isCountable && props.task.currentCount !== undefined && props.task.targetCount !== undefined) {
    if (props.task.currentCount > 0) {
      const newCount = props.task.currentCount - 1
      const newCompleted = newCount >= props.task.targetCount

      emit('update', {
        ...props.task,
        currentCount: newCount,
        completed: newCompleted
      })
    }
  }
}

// Notes handling functions
const openNotesDialog = () => {
  taskNotes.value = props.task.notes || ''
  showNotesDialog.value = true
}

const saveNotes = () => {
  const updatedTask = {
    ...props.task,
    notes: taskNotes.value
  }

  // Show message when notes are saved
  if (taskNotes.value.trim()) {
    snackbarService.showInfo('Notes saved successfully')
  }

  emit('update', updatedTask)
  showNotesDialog.value = false
}

const clearNotes = () => {
  taskNotes.value = ''

  emit('update', {
    ...props.task,
    notes: ''
  })

  snackbarService.showInfo('Notes cleared')
  showNotesDialog.value = false
}

// Get tag data from the central TagData mapping
const getTagData = (tag: string) => {
  return TagData[tag] || { label: tag, color: 'grey' }
}

// Add delete dialog state
const showDeleteDialog = ref(false)

// Open delete confirmation dialog
const confirmDelete = () => {
  showDeleteDialog.value = true
}

// Delete the task
const deleteTask = () => {
  emit('delete:task', props.task.id)
  showDeleteDialog.value = false
  snackbarService.showInfo('Task deleted')
}

// Get the appropriate Wowhead URL based on the data type
const getWowheadUrl = (data: { type: string; id: number }) => {
  switch (data.type) {
    case 'quest':
      return `https://www.wowhead.com/quest=${data.id}`
    case 'npc':
      return `https://www.wowhead.com/npc=${data.id}`
    case 'zone':
      return `https://www.wowhead.com/zone=${data.id}`
    case 'item':
      return `https://www.wowhead.com/item=${data.id}`
    case 'spell':
      return `https://www.wowhead.com/spell=${data.id}`
    case 'achievement':
      return `https://www.wowhead.com/achievement=${data.id}`
    default:
      return 'https://www.wowhead.com/'
  }
}
</script>

<style scoped>
.note-preview {
  max-width: 180px;
  color: rgb(var(--v-theme-info));
  font-style: italic;
}

.note-container {
  background-color: rgba(var(--v-theme-info), 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.notes-button {
  min-width: 36px;
}

.has-notes-button {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-info), 0.2);
}

.position-relative {
  position: relative;
}

.notes-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: rgb(var(--v-theme-info));
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.notes-badge i {
  color: white !important;
  font-size: 14px !important;
}

.notes-dot {
  width: 6px;
  height: 6px;
  background-color: rgb(var(--v-theme-info));
  border-radius: 50%;
  display: inline-block;
  margin-right: 3px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
}

.tags-container .v-chip {
  font-size: 0.75rem;
  height: 20px;
  line-height: 20px;
}

.task-link {
  color: #4F9DFF;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}

.task-link:hover {
  color: #7CB5FF;
  text-decoration: underline;
}

.task-link .v-icon {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.task-link:hover .v-icon {
  opacity: 1;
}
</style>
