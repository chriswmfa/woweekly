<template>
  <v-card flat color="background">
    <v-tabs
      v-model="selectedExpansion"
      bg-color="surface"
      centered
      slider-color="secondary"
    >
      <v-tab
        v-for="(expansion, key) in expansions"
        :key="key"
        :value="key"
      >
        <v-icon :color="getExpansionColor(key)" class="mr-2">{{ getExpansionIcon(key) }}</v-icon>
        {{ expansion.name }}
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'
import type { TasksData } from '@/types/tasks'

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

watch(() => props.modelValue, (newVal) => {
  selectedExpansion.value = newVal
})

watch(selectedExpansion, (newVal) => {
  emit('update:modelValue', newVal)
})

// Helper functions for expansion display
const getExpansionColor = (key: string | number): string => {
  return String(key) === 'tww' ? 'blue' : 'orange'
}

const getExpansionIcon = (key: string | number): string => {
  return String(key) === 'tww' ? 'mdi-pickaxe' : 'mdi-dragon'
}
</script>
