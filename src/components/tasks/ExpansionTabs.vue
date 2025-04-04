<template>
  <v-card flat color="background">
    <v-tabs
      v-model="selectedExpansion"
      bg-color="surface"
      centered
      slider-color="secondary"
    >
      <!-- Available expansions -->
      <v-tab
        v-for="(expansion, key) in expansions"
        :key="key"
        :value="key"
      >
        <v-icon :color="getExpansionColor(key)" class="mr-2">{{ getExpansionIcon(key) }}</v-icon>
        {{ expansion.name }}
      </v-tab>

      <!-- Unavailable expansions -->
      <v-tab
        v-for="unavailableKey in unavailableExpansionKeys"
        :key="unavailableKey"
        disabled
        :value="unavailableKey"
      >
        <v-icon color="grey" class="mr-2">{{ getExpansionIcon(unavailableKey) }}</v-icon>
        <span class="text-grey">{{ ExpansionData[unavailableKey].name }}</span>
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import type { PropType } from 'vue'
import type { TasksData } from '@/types/tasks'
import { ExpansionData } from '@/types/tasks'

const props = defineProps({
  expansions: {
    type: Object as PropType<TasksData['expansions']>,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedExpansion = ref(props.modelValue)

// Compute keys of expansions that aren't in the expansions prop
const unavailableExpansionKeys = computed(() => {
  const availableKeys = Object.keys(props.expansions)
  return Object.keys(ExpansionData).filter(key => !availableKeys.includes(key))
})

watch(() => props.modelValue, (newVal) => {
  selectedExpansion.value = newVal
})

watch(selectedExpansion, (newVal) => {
  emit('update:modelValue', newVal)
})

// Helper functions that use the centralized ExpansionData
const getExpansionColor = (key: string | number): string => {
  const keyStr = String(key)
  return ExpansionData[keyStr as keyof typeof ExpansionData]?.color || 'grey'
}

const getExpansionIcon = (key: string | number): string => {
  const keyStr = String(key)
  return ExpansionData[keyStr as keyof typeof ExpansionData]?.icon || 'mdi-warcraft'
}
</script>
