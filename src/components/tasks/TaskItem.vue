<template>
  <v-list-item
    :class="{'bg-success-subtle': isCompleted}"
    rounded="sm"
    class="mb-1 position-relative"
  >
    <template v-slot:prepend>
      <!-- Info for non-completable tasks -->
      <div v-if="task.completable === false" class="d-flex align-center mr-2 ml-1">
        <v-icon size="small" color="grey">mdi-information-outline</v-icon>
      </div>
      <!-- Regular checkbox for completable tasks -->
      <v-checkbox
        v-else
        density="compact"
        hide-details
        :model-value="task.completed"
        @click="updateCompleted(!task.completed)"
        color="success"
        class="mr-2"
      ></v-checkbox>
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
import { computed, defineProps, defineEmits, ref } from 'vue'
import type { PropType } from 'vue'
import type { Task, WowheadData } from '@/types/tasks'
import { TagData } from '@/types/tasks'
import { snackbarService } from '@/services/snackbarService'
import { ReputationMethodsService } from '@/services/reputationMethodsService'

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

// Delete dialog state
const showDeleteDialog = ref(false)

// Check if the task is completed - simplified without countable logic
const isCompleted = computed(() => {
  return props.task.completed
})

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

// Delete task functionality
const confirmDelete = () => {
  showDeleteDialog.value = true
}

const deleteTask = () => {
  emit('delete:task', props.task)
  showDeleteDialog.value = false
  snackbarService.showInfo('Task deleted')
}

// Get tag data from the central TagData mapping
const getTagData = (tag: string) => {
  // Check if this is a reputation tag with a faction ID (format: "reputation:ID")
  if (tag.startsWith('reputation:')) {
    // Extract the faction ID from the tag
    const factionId = parseInt(tag.split(':')[1])

    // Get all factions from our reputations.json via the ReputationMethodsService
    const factions = ReputationMethodsService.getAllReputationMethods()

    // Find the faction with the matching ID
    const faction = factions.find(f => f.id === factionId)

    if (faction) {
      // Return formatted tag data with the faction name
      return {
        label: `Rep: ${faction.name}`,
        color: 'blue' // Keep the same color as regular reputation tags
      }
    }
  }

  // Otherwise look up from TagData
  return TagData[tag] || { label: tag, color: 'grey' }
}

// Generate Wowhead URL based on the wowheadData object
const getWowheadUrl = (wowheadData: WowheadData) => {
  const baseUrl = 'https://www.wowhead.com/'

  switch (wowheadData.type) {
    case 'quest':
      return `${baseUrl}quest=${wowheadData.id}`
    case 'item':
      return `${baseUrl}item=${wowheadData.id}`
    case 'npc':
      return `${baseUrl}npc=${wowheadData.id}`
    case 'achievement':
      return `${baseUrl}achievement=${wowheadData.id}`
    case 'zone':
      return `${baseUrl}zone=${wowheadData.id}`
    default:
      return `${baseUrl}${wowheadData.type}=${wowheadData.id}`
  }
}
</script>

<style scoped>
.task-link {
  text-decoration: none;
  color: inherit;
}

.task-link:hover {
  text-decoration: underline;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
}

.delete-btn {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.v-list-item:hover .delete-btn {
  opacity: 1;
}
</style>
