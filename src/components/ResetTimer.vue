<template>
  <div class="d-flex align-center reset-timer">
    <v-icon size="small" color="secondary" class="mr-1">mdi-clock-time-four-outline</v-icon>
    <span class="text-caption font-weight-medium me-1">Reset in:</span>
    <template v-if="timeRemaining">
      <span class="text-caption timer-unit">{{ timeRemaining }}</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Time remaining string
const timeRemaining = ref('')

// Region and reset time
const region = ref('')
const resetTimeLocal = ref('')

// Timer interval reference
let timerInterval: number | null = null

// Detect user's timezone (Europe or US/Oceanic)
function detectRegion () {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return timezone.includes('Europe/') || timezone.includes('CET') || 
           timezone.includes('EET') || timezone.includes('WET')
      ? 'Europe'
      : 'US/Oceanic'
  } catch {
    return 'US/Oceanic'
  }
}

// Get next reset date based on region
function getNextResetDate () {
  const now = new Date()
  const nextReset = new Date(now)
  
  if (region.value === 'Europe') {
    // Europe: Wednesday at 04:00 UTC
    nextReset.setUTCDate(now.getUTCDate() + ((3 + 7 - now.getUTCDay()) % 7)) // Next Wednesday
    nextReset.setUTCHours(4, 0, 0, 0)
  } else {
    // US/Oceanic: Tuesday at 15:00 UTC
    nextReset.setUTCDate(now.getUTCDate() + ((2 + 7 - now.getUTCDay()) % 7)) // Next Tuesday
    nextReset.setUTCHours(15, 0, 0, 0)
  }
  
  // If we're past the reset time for this week, add 7 days
  if (nextReset < now) {
    nextReset.setUTCDate(nextReset.getUTCDate() + 7)
  }
  
  return nextReset
}

// Format the local time string
function formatLocalTime (date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Format time remaining as a string
function formatTimeRemaining (ms: number) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${days}d ${hours}h ${minutes}m`
}

// Update the countdown timer
function updateCountdown () {
  const now = new Date()
  const nextReset = getNextResetDate()
  const difference = nextReset.getTime() - now.getTime()
  
  if (difference > 0) {
    timeRemaining.value = formatTimeRemaining(difference)
    resetTimeLocal.value = formatLocalTime(nextReset)
  } else {
    // Recalculate if we somehow passed the reset time
    updateCountdown()
  }
}

// Initialize the component
onMounted(() => {
  region.value = detectRegion()
  updateCountdown()
  timerInterval = window.setInterval(updateCountdown, 60000) // Update every minute
})

// Cleanup
onBeforeUnmount(() => {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.reset-timer {
  font-size: 0.8rem;
}

.timer-unit {
  white-space: nowrap;
}
</style>
