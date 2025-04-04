<template>
  <v-row class="mb-5">
    <v-col cols="12" md="6">
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="mr-2">mdi-calendar-week</v-icon>
        <h3 class="text-subtitle-1 font-weight-bold">Weekly Progress</h3>
      </div>
      <v-progress-linear
        :model-value="weeklyCompletion"
        color="primary"
        height="20"
        striped
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
    <v-col cols="12" md="6">
      <div class="d-flex align-center mb-2">
        <v-icon color="success" class="mr-2">mdi-calendar-today</v-icon>
        <h3 class="text-subtitle-1 font-weight-bold">Daily Progress</h3>
      </div>
      <v-progress-linear
        :model-value="dailyCompletion"
        color="success"
        height="20"
        striped
        rounded
      >
        <template v-slot:default="{ value }">
          <strong class="text-caption">
            {{ dailyCompleted }}/{{ dailyTotal }}
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
  },
  dailyCompletion: {
    type: Number,
    required: true
  },
  dailyCompleted: {
    type: Number,
    required: true
  },
  dailyTotal: {
    type: Number,
    required: true
  }
})
</script>
