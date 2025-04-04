<template>
  <v-card
    v-if="showBanner"
    class="mb-4 completion-banner text-center"
    color="success"
    elevation="3"
  >
    <v-card-text class="py-5 white--text d-flex flex-column align-center">
      <v-icon
        icon="mdi-trophy"
        size="x-large"
        color="yellow"
        class="mb-2"
      ></v-icon>
      <h2 class="text-h4 font-weight-bold mb-2">Congratulations!</h2>
      <p class="text-subtitle-1">You've completed all weekly tasks for this expansion.</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  weeklyCompletion: {
    type: Number,
    required: true
  },
  expansionName: {
    type: String,
    required: true
  }
})

// Show banner only when 100% complete
const showBanner = computed(() => {
  return props.weeklyCompletion === 100
})
</script>

<style scoped>
.completion-banner {
  position: relative;
  overflow: hidden;
  animation: glow 1.5s infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px 0 rgba(76, 175, 80, 0.7);
  }
  to {
    box-shadow: 0 0 15px 5px rgba(76, 175, 80, 0.7);
  }
}
</style>
