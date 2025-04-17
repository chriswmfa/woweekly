<template>
  <v-card class="cache-status-card pa-2" flat>
    <div class="d-flex align-center">
      <v-icon
        :color="isCached ? 'success' : 'error'"
        class="mr-2"
      >
        {{ isCached ? 'mdi-database-check' : 'mdi-database-remove' }}
      </v-icon>      <div class="cache-status-text">
        <div class="font-weight-medium d-flex align-center">
          {{ isCached ? 'Cache Active' : 'No Cache' }}
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                size="x-small"
                class="ml-1"
                color="info"
              >
                mdi-help-circle-outline
              </v-icon>
            </template>
            <div class="pa-2" style="max-width: 300px;">
              <p>Caching stores data locally to reduce API calls and speed up loading times.</p>
              <p class="mb-0">Data is cached for 1 hour to ensure a balance between responsiveness and freshness.</p>
            </div>
          </v-tooltip>
        </div>

        <div v-if="isCached" class="text-caption">
          <template v-if="isExpired">
            <span class="text-error">Cache Expired - Please Reload</span>
          </template>
          <template v-else>
            Expires in {{ formattedTimeRemaining }}
          </template>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue'
import { cacheState } from '@/services/cacheService'

const props = defineProps<{
  cacheKey: string
  cacheType: string
  refreshHandler:() => Promise<void>
}>()

const timeRemaining = ref(0)
const updateInterval = ref<number | null>(null)

// Computed property to check if data is cached
const isCached = computed(() => {
  return cacheState[props.cacheKey]?.isCached || false
})

// Computed property to check if cache is expired
const isExpired = computed(() => {
  if (!isCached.value) return false
  return timeRemaining.value <= 0
})

// Format the time remaining in a human-readable format
const formattedTimeRemaining = computed(() => {
  // Return empty if not cached
  if (!isCached.value) return ''

  const totalSeconds = Math.floor(timeRemaining.value / 1000)

  if (totalSeconds <= 0) return 'Expired'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
})

// Get the current time remaining and update it
function updateTimeRemaining () {
  if (!isCached.value) {
    timeRemaining.value = 0
    return
  }

  // Calculate time remaining from cache state
  const expiresAt = cacheState[props.cacheKey]?.expiresAt || 0
  timeRemaining.value = Math.max(0, expiresAt - Date.now())
}

// Set up interval to update time remaining
onMounted(() => {
  updateTimeRemaining()

  // Update every second
  updateInterval.value = window.setInterval(() => {
    updateTimeRemaining()
  }, 1000)
})

// Clean up interval when component is unmounted
onUnmounted(() => {
  if (updateInterval.value !== null) {
    clearInterval(updateInterval.value)
  }
})
</script>

<style scoped>
.cache-status-card {
  border-radius: 8px;
  /* Border removed */
}

.cache-status-text {
  line-height: 1.2;
}
</style>
