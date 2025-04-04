<template>
  <v-row>
    <v-col cols="12">
      <v-progress-linear
        :model-value="weeklyCompletion"
        color="success"
        height="20"
        rounded
      >
        <template v-slot:default="{ value }">
          <strong class="text-caption">
            {{ weeklyCompleted }}/{{ weeklyTotal }}
            ({{ Math.ceil(value) }}%)
          </strong>
        </template>
      </v-progress-linear>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  weeklyCompletion: {
    type: Number,
    required: true
  },
  weeklyCompleted: {
    type: Number,
    required: true
  },
  weeklyTotal: {
    type: Number,
    required: true
  }
})
</script>
