<template>
  <v-card class="mt-4 mb-4" elevation="3" color="surface">
    <v-card-title class="pb-0">
      <v-icon color="secondary" class="mr-2">mdi-filter-variant</v-icon>
      <span class="text-subtitle-1 font-weight-medium">Filter by Task Type</span>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col v-for="type in allTaskTypes" :key="type" cols="auto">
          <v-chip
            :color="enabledTaskTypes.includes(type) ? getTaskTypeColor(type) : ''"
            @click="toggleTaskType(type)"
            class="ma-1"
            filter
            variant="elevated"
            :filter-icon="enabledTaskTypes.includes(type) ? 'mdi-check' : ''"
          >
            <v-icon size="small" class="mr-1">{{ getTaskTypeIcon(type) }}</v-icon>
            {{ type.charAt(0).toUpperCase() + type.slice(1) }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  allTaskTypes: {
    type: Array as PropType<string[]>,
    required: true
  },
  enabledTaskTypes: {
    type: Array as PropType<string[]>,
    required: true
  }
})

const emit = defineEmits(['update:enabledTaskTypes'])

const toggleTaskType = (type: string) => {
  const updated = [...props.enabledTaskTypes]
  const index = updated.indexOf(type)

  if (index >= 0) {
    updated.splice(index, 1)
  } else {
    updated.push(type)
  }

  emit('update:enabledTaskTypes', updated)
}

// Get appropriate icon for task type
const getTaskTypeIcon = (type: string): string => {
  const iconMap: {[key: string]: string} = {
    quest: 'mdi-map-marker',
    dungeon: 'mdi-sword-cross',
    raid: 'mdi-shield',
    pvp: 'mdi-sword',
    reputation: 'mdi-handshake',
    collection: 'mdi-treasure-chest',
    crafting: 'mdi-anvil',
    activity: 'mdi-run',
    profession: 'mdi-hammer'
  }
  return iconMap[type] || 'mdi-checkbox-marked-circle'
}

// Get appropriate color for task type
const getTaskTypeColor = (type: string): string => {
  const colorMap: {[key: string]: string} = {
    quest: 'amber',
    dungeon: 'indigo',
    raid: 'purple',
    pvp: 'red',
    reputation: 'blue',
    collection: 'teal',
    crafting: 'orange',
    activity: 'light-blue',
    profession: 'brown'
  }
  return colorMap[type] || 'grey'
}
</script>
