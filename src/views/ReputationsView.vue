// filepath: /Users/chris/Desktop/woweekly/src/views/ReputationsView.vue
<template>
  <v-container class="reputations py-8">
    <!-- Character Input Dialog -->
    <CharacterInputDialog
      v-if="showCharacterDialog"
      @character-set="onCharacterSet"
    />

    <v-row justify="center" v-if="!showCharacterDialog">
      <v-col cols="12">
        <v-card class="mb-6" elevation="3">
          <div class="bg-overlay position-relative">
            <!-- Cache Status Indicator -->
            <CacheStatusIndicator
              class="cache-status-container position-absolute"
              style="max-width: 350px; top: 10px; right: 10px"
              :cacheKey="characterCacheKey"
              cacheType="Reputation"
              :refreshHandler="refreshReputationsData"
              @refresh-complete="handleRefreshComplete"
            />
            <h1 class="text-h3 font-weight-bold cinzel-font">Reputations</h1>

            <!-- Description section -->
            <p class="description-text mt-3 mx-auto" style="max-width: 800px;">
              Track your faction reputations, manage reputation tasks, and find ways to increase your standing.
              Use the filters below to focus on specific factions or hide completed ones.
              Check off reputation tasks as you complete them to track your progress.
            </p>
            <p class="description-text mt-3 mx-auto" style="max-width: 800px;">Please note that not every single possible method of gaining reputation is listed here, some obscure
              methods may be missing however the most common ones are included.
            </p>
          </div>

          <v-card-text class="pa-6">
            <div v-if="loading" class="text-center pa-6">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
              <p class="mt-4">Loading reputation data...</p>
            </div>

            <div v-else-if="error" class="text-center pa-6">
              <v-icon icon="mdi-alert-circle" color="error" size="64"></v-icon>
              <p class="mt-4 text-error">{{ error }}</p>
              <v-btn color="primary" class="mt-4" @click="loadReputations"
                >Try Again</v-btn
              >
            </div>

            <div v-else>
              <!-- Search and filter controls -->
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-text-field
                      v-model="search"
                      label="Search Reputations"
                      prepend-icon="mdi-magnify"
                      clearable
                      variant="outlined"
                      density="comfortable"
                      class="flex-grow-1"
                      hide-details
                    ></v-text-field>
                    <v-switch
                      v-model="showExalted"
                      color="amber"
                      label="Show Exalted Reputations"
                      hide-details
                      inset
                      density="comfortable"
                      class="ml-4"
                    ></v-switch>
                    <v-switch
                      v-model="showParagon"
                      color="amber-darken-2"
                      label="Show Paragon Reputations"
                      hide-details
                      inset
                      density="comfortable"
                      class="ml-4"
                    ></v-switch>
                  </div>
                </v-col>
              </v-row>

              <!-- Compact Reputation list -->
              <v-row>
                <v-col cols="12">
                  <v-card
                    v-for="reputation in filteredReputations"
                    :key="reputation.faction.id"
                    class="reputation-card mb-3"
                    elevation="2"
                  >
                    <!-- Compact header with all main information -->
                    <v-card-item class="py-2">
                      <div class="d-flex align-center w-100">
                        <!-- Left section with fixed width for name and standing info -->
                        <div
                          class="reputation-info-container d-flex align-center"
                          style="width: 400px; min-width: 250px"
                        >
                          <!-- Left side: icon and faction name (flexible width) -->
                          <div
                            class="d-flex align-center flex-grow-1 text-truncate"
                          >
                            <!-- Status icon -->
                            <v-icon
                              v-if="isExalted(reputation)"
                              :color="
                                isExalted(reputation)
                                  ? 'amber-lighten-3'
                                  : 'secondary'
                              "
                              class="mr-2"
                            >
                              mdi-crown
                            </v-icon>

                            <!-- Faction name with tooltip for long names -->
                            <v-tooltip location="bottom" v-if="reputation.faction.name.length > 30">
                              <template v-slot:activator="{ props }">
                                <div
                                  v-bind="props"
                                  class="font-weight-medium text-body-1 text-truncate"
                                >
                                  {{ truncateName(reputation.faction.name, 30) }}
                                </div>
                              </template>
                              <span>{{ reputation.faction.name }}</span>
                            </v-tooltip>
                            <div
                              v-else
                              class="font-weight-medium text-body-1 text-truncate"
                            >
                              {{ reputation.faction.name }}
                            </div>
                          </div>

                          <!-- Right side: standing info (right aligned) -->
                          <div
                            class="d-flex align-center justify-end ml-2"
                            style="min-width: 100px"
                          >
                            <!-- Standing label -->
                            <span
                              v-if="!isExalted(reputation)"
                              class="text-caption font-weight-medium mr-2"
                            >
                              {{ getRepTierLabel(reputation) }}
                            </span>

                            <!-- Standing chip -->
                            <v-chip
                              :color="
                                getStandingColor(getReputationTier(reputation))
                              "
                              size="x-small"
                              class="font-weight-medium mr-1 standing-chip"
                              style="width: 70px; justify-content: center"
                              variant="elevated"
                            >
                              {{ reputation.standing.name }}
                            </v-chip>
                          </div>
                        </div>

                        <!-- Progress bar separator -->
                        <div class="mr-2">-</div>

                        <!-- Progress bar and paragon section (inline, taking remaining space) -->
                        <div class="flex-grow-1 d-flex align-center mx-2">
                          <!-- Main progress information -->
                          <span class="text-caption mr-2 progress-value nowrap">
                            <span v-if="isExalted(reputation)">Exalted!</span>
                            <span v-else
                              >{{ reputation.standing.value }}/{{
                                reputation.standing.max > 0
                                  ? reputation.standing.max
                                  : "∞"
                              }}
                              - ({{
                                Math.ceil(
                                  isExalted(reputation)
                                    ? 100
                                    : getProgressPercentage(
                                        reputation.standing.value,
                                        reputation.standing.max
                                      )
                                )
                              }}%)</span
                            >
                          </span>

                          <!-- Main progress bar -->
                          <v-progress-linear
                            class="flex-grow-1"
                            :model-value="
                              isExalted(reputation)
                                ? 100
                                : getProgressPercentage(
                                    reputation.standing.value,
                                    reputation.standing.max
                                  )
                            "
                            :color="
                              isExalted(reputation)
                                ? 'amber'
                                : getStandingColor(
                                    getReputationTier(reputation)
                                  )
                            "
                            height="10"
                            rounded
                          ></v-progress-linear>

                          <!-- Paragon progress (if available) inline -->
                          <div
                            v-if="reputation.paragon"
                            class="d-flex align-center ml-2 mr-1"
                          >
                            <v-icon color="amber" size="x-small" class="mr-1"
                              >mdi-star</v-icon
                            >
                            <v-progress-linear
                              style="width: 60px"
                              :model-value="
                                getProgressPercentage(
                                  reputation.paragon.value,
                                  reputation.paragon.max
                                )
                              "
                              color="amber"
                              height="6"
                              rounded
                            ></v-progress-linear>
                            <span class="text-caption ml-1"
                              >{{ reputation.paragon.value }}/{{
                                reputation.paragon.max
                              }}</span
                            >
                          </div>
                        </div>

                        <!-- Expand/collapse button for methods -->
                        <v-btn
                          v-if="
                            reputation.methods && reputation.methods.length > 0
                          "
                          icon
                          size="x-small"
                          variant="text"
                          :color="
                            expandedReputations[reputation.faction.id]
                              ? 'primary'
                              : 'default'
                          "
                          @click="toggleExpanded(String(reputation.faction.id))"
                        >
                          <v-icon>{{
                            expandedReputations[reputation.faction.id]
                              ? "mdi-chevron-up"
                              : "mdi-chevron-down"
                          }}</v-icon>
                        </v-btn>

                        <!-- Methods count badge -->
                        <v-badge
                          v-if="
                            reputation.methods &&
                            reputation.methods.length > 0 &&
                            getCompletableMethodsCount(reputation) > 0
                          "
                          :content="
                            getCompletedMethodsCount(reputation) +
                            '/' +
                            getCompletableMethodsCount(reputation)
                          "
                          color="success"
                          inline
                          class="ml-1"
                        ></v-badge>
                      </div>
                    </v-card-item>

                    <!-- Collapsible Methods Section -->
                    <v-expand-transition>
                      <div
                        v-if="
                          expandedReputations[reputation.faction.id] &&
                          reputation.methods &&
                          reputation.methods.length > 0
                        "
                      >
                        <v-divider></v-divider>
                        <v-card-text class="pa-3">
                          <div
                            class="d-flex align-center mb-2 justify-space-between"
                          >
                            <div class="d-flex align-center">
                              <v-icon color="primary" size="small" class="mr-1"
                                >mdi-arrow-up-bold-circle</v-icon
                              >
                              <span class="text-subtitle-2"
                                >Ways to Increase Reputation</span
                              >
                            </div>
                            <span class="text-caption">
                              <span v-if="getCompletableMethodsCount(reputation) > 0">
                                {{ getCompletedMethodsCount(reputation) }}/{{
                                  getCompletableMethodsCount(reputation)
                                }}
                                completed
                              </span>
                              <span v-else class="text-grey">
                                No completable methods
                              </span>
                            </span>
                          </div>

                          <!-- Methods progress bar -->
                          <v-progress-linear
                            :model-value="
                              getMethodsCompletionPercentage(reputation)
                            "
                            color="success"
                            height="10"
                            rounded
                            class="mb-3"
                          ></v-progress-linear>

                          <v-list density="compact" class="bg-transparent pa-0">
                            <v-list-item
                              v-for="method in reputation.methods"
                              :key="method.id"
                              class="method-item mb-1 rounded-sm px-2"
                              :class="{
                                'bg-success-subtle':
                                  method.completable !== false && methodCompletionTracking[method.id],
                              }"
                            >
                              <template v-slot:prepend>
                                <!-- Info icon for non-completable methods -->
                                <div v-if="method.completable === false" class="d-flex align-center mr-2 ml-1">
                                  <v-icon size="small" color="grey">mdi-information-outline</v-icon>
                                </div>
                                <!-- Checkbox for completable methods -->
                                <v-checkbox
                                  v-else
                                  density="compact"
                                  hide-details
                                  :model-value="
                                    methodCompletionTracking[method.id] || false
                                  "
                                  @click="toggleMethodCompletion(method.id)"
                                  color="success"
                                  class="mr-2"
                                ></v-checkbox>
                              </template>

                              <div class="flex-grow-1">
                                <v-list-item-title
                                  :class="{
                                    'text-decoration-line-through':
                                      methodCompletionTracking[method.id],
                                  }"
                                  class="text-body-2"
                                >
                                  {{ method.name }} - {{ method.description }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-caption">
                                  <v-chip
                                    :color="getMethodTypeColor(method.type)"
                                    size="x-small"
                                    class="mr-1"
                                    label
                                    variant="elevated"
                                  >
                                    {{
                                      method.type.charAt(0).toUpperCase() +
                                      method.type.slice(1)
                                    }}
                                  </v-chip>
                                  <span class="text-success"
                                    >+{{ method.reputation }}</span
                                  >
                                </v-list-item-subtitle>
                              </div>

                              <template v-slot:append>
                                <v-btn
                                  v-if="method.wowheadLink"
                                  size="small"
                                  variant="text"
                                  icon="mdi-link-variant"
                                  color="primary"
                                  :href="`https://www.wowhead.com/${method.wowheadLink}`"
                                  target="_blank"
                                  class="mr-1"
                                ></v-btn>
                              </template>
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </div>
                    </v-expand-transition>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Empty state message -->
              <div
                v-if="filteredReputations.length === 0"
                class="text-center pa-6"
              >
                <v-icon icon="mdi-emoticon-sad" color="grey" size="64"></v-icon>
                <p class="mt-4 text-grey">
                  No reputations match your search criteria.
                </p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { fetchReputations, hasCharacterInfo } from '@/services/reputationService'
import { StorageService } from '@/services/storageService'
import { ReputationMethodsService } from '@/services/reputationMethodsService'
import { type Reputation } from '@/types/reputation'
import { type EnhancedReputation } from '@/types/reputationMethods'
import CacheStatusIndicator from '@/components/CacheStatusIndicator.vue'
import CharacterInputDialog from '@/components/CharacterInputDialog.vue'
import { snackbarService } from '@/services/snackbarService'

// Data loading state
const reputations = ref<EnhancedReputation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showCharacterDialog = ref(!hasCharacterInfo())

// Filter and search
const search = ref('')
const filterTier = ref<number | null>(null)
const showExalted = ref(true) // Default to showing exalted reputations
const showParagon = ref(true) // Default to showing paragon reputations

// Track which reputation cards are expanded
const expandedReputations = ref<Record<string, boolean>>({})

// Method completion tracking
const methodCompletionTracking = ref<Record<string, boolean>>({})

// Load reputations on component mount
onMounted(() => {
  // Only load reputations if we already have character info
  if (!showCharacterDialog.value) {
    loadReputations()
  }

  // Load saved UI settings
  const savedState = StorageService.loadTasksState()
  if (
    savedState?.settings?.uiSettings?.reputationSettings?.showExalted !==
    undefined
  ) {
    showExalted.value =
      savedState.settings.uiSettings.reputationSettings.showExalted
  }

  if (
    savedState?.settings?.uiSettings?.reputationSettings?.showParagon !==
    undefined
  ) {
    showParagon.value =
      savedState.settings.uiSettings.reputationSettings.showParagon
  }

  // Load saved method completion status
  if (
    savedState?.settings &&
    'reputationMethods' in (savedState.settings as Record<string, unknown>)
  ) {
    methodCompletionTracking.value = (
      savedState.settings as Record<string, any>
    ).reputationMethods.completedMethods
  }
})

// Handle character information set
const onCharacterSet = () => {
  showCharacterDialog.value = false
  loadReputations()
}

// Function to load reputation data
const loadReputations = async (forceRefresh = false) => {
  loading.value = true
  error.value = null

  try {
    const data = await fetchReputations(forceRefresh)
    if (data) {
      // Enhance reputations with methods from our mapping file
      const enhancedData =
        ReputationMethodsService.enhanceReputationsWithMethods(data)
      reputations.value = enhancedData
    } else {
      error.value = 'No reputation data returned'
    }
  } catch (err) {
    error.value = 'Failed to load reputation data'
    console.error('Error loading reputations:', err)
  } finally {
    loading.value = false
  }
}

// Function to handle refresh button click on the cache indicator
const refreshReputationsData = async () => {
  return loadReputations(true) // Force refresh from API
}

// Handler for when refresh is complete
const handleRefreshComplete = () => {
  // Can add any post-refresh logic here if needed
  console.log('Reputation data refresh complete')
}

// Generate the character-specific cache key
const characterCacheKey = computed(() => {
  const characterInfo = StorageService.getCharacterInfo()
  if (!characterInfo) return 'character_reputations'

  const { name, realm, region } = characterInfo
  return `character_reputations_${region}_${realm}_${name}`
})

// Filter reputations based on search and tier filter
const filteredReputations = computed(() => {
  let result = [...reputations.value]

  // Apply search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter((rep) =>
      rep.faction.name.toLowerCase().includes(searchLower)
    )
  }

  // Apply tier filter
  if (filterTier.value !== null) {
    result = result.filter((rep) => rep.standing.tier === filterTier.value)
  }

  // Handle exalted and paragon reputations based on user preferences
  if (!showExalted.value || !showParagon.value) {
    result = result.filter((rep) => {
      const isExaltedRep = isExalted(rep)
      const isParagonRep = hasParagon(rep)

      // Keep reputation if:
      // - It's not exalted, OR
      // - It's exalted but has paragon and showParagon is true, OR
      // - It's exalted without paragon and showExalted is true
      return !isExaltedRep ||
             (isExaltedRep && isParagonRep && showParagon.value) ||
             (isExaltedRep && !isParagonRep && showExalted.value)
    })
  }

  // Sort by name
  return result.sort((a, b) => a.faction.name.localeCompare(b.faction.name))
})

// Get reputation stats summary counts
const reputationStats = computed(() => {
  if (reputations.value.length === 0) return { exalted: 0, inProgress: 0, total: 0 }

  const exaltedCount = reputations.value.filter(rep => isExalted(rep)).length
  const total = reputations.value.length
  const inProgress = total - exaltedCount

  return { exalted: exaltedCount, inProgress, total }
})

// Helper function to get standing color based on tier
const getStandingColor = (tier: number): string => {
  const colors = {
    0: 'red', // Hated
    1: 'red-lighten-1', // Hostile
    2: 'orange', // Unfriendly
    3: 'amber', // Neutral
    4: 'light-green', // Friendly
    5: 'green', // Honored
    6: 'blue', // Revered
    7: 'purple' // Exalted
  }
  return colors[tier as keyof typeof colors] || 'grey'
}

// Helper function to calculate progress percentage
const getProgressPercentage = (value: number, max: number): number => {
  if (max <= 0) return 100 // If max is 0 or negative, consider it complete
  return Math.min(100, (value / max) * 100)
}

// Helper functions to handle both reputation types

// Get the effective tier/level for a reputation (handles both tier and renown_level)
const getReputationTier = (reputation: Reputation): number => {
  // Use tier if available, otherwise use renown_level, or default to 0
  return reputation.standing.tier !== undefined
    ? reputation.standing.tier
    : reputation.standing.renown_level !== undefined
      ? reputation.standing.renown_level
      : 0
}

// Get appropriate label for tier display
const getRepTierLabel = (reputation: Reputation): string => {
  const hasRenown = reputation.standing.renown_level !== undefined
  const hasTier = reputation.standing.tier !== undefined

  if (hasRenown) {
    // For renown-based reputations
    const level = reputation.standing.renown_level
    return `Renown ${level}`
  } else if (hasTier) {
    // For traditional tier-based reputations
    const tier = reputation.standing.tier
    return `Tier ${tier}`
  } else {
    // Fallback for any other format
    return ''
  }
}

// Helper function to truncate faction names
const truncateName = (name: string, maxLength: number): string => {
  if (name.length <= maxLength) return name
  return name.substring(0, maxLength) + '...'
}

// Helper function to check if reputation is exalted/max standing
const isExalted = (reputation: Reputation): boolean => {
  // Check for traditional exalted tier or high renown level
  return (
    (reputation.standing.tier !== undefined && reputation.standing.tier >= 7) ||
    (reputation.standing.renown_level !== undefined &&
      reputation.standing.renown_level >= 25) ||
    (reputation.standing.max === 0) ||
    // Handle case for max renown reputations where value is 0 and renown level is maxed
    (reputation.standing.renown_level !== undefined &&
      reputation.standing.value === 0)
  )
}

// Helper function to check if a reputation has paragon levels
const hasParagon = (reputation: Reputation): boolean => {
  return reputation.paragon !== undefined && reputation.paragon !== null
}

// Function to get color for reputation method type
const getMethodTypeColor = (type: string): string => {
  const colors = {
    daily: 'blue',
    weekly: 'purple',
    'one-time': 'orange',
    repeatable: 'green'
  }
  return colors[type as keyof typeof colors] || 'grey'
}

// Function to toggle method completion status
const toggleMethodCompletion = (methodId: string) => {
  // Toggle completion status
  methodCompletionTracking.value[methodId] =
    !methodCompletionTracking.value[methodId]

  // Save to localStorage
  saveMethodCompletionStatus()

  // Show snackbar notification when marking as complete
  if (methodCompletionTracking.value[methodId]) {
    snackbarService.showSuccess('Reputation task marked as complete!')
  }
}

// Function to toggle a reputation card's expanded state
const toggleExpanded = (reputationId: string) => {
  expandedReputations.value[reputationId] =
    !expandedReputations.value[reputationId]
}

// Function to get the number of completed methods for a reputation
const getCompletedMethodsCount = (reputation: EnhancedReputation): number => {
  if (!reputation.methods) return 0

  // Only count completable methods that are marked as completed
  return reputation.methods.filter(
    (method) => method.completable !== false && methodCompletionTracking.value[method.id]
  ).length
}

// Count total completable methods
const getCompletableMethodsCount = (reputation: EnhancedReputation): number => {
  if (!reputation.methods) return 0

  // Only count methods that can be completed (not marked with completable: false)
  return reputation.methods.filter(
    (method) => method.completable !== false
  ).length
}

// Function to calculate completion percentage for methods
const getMethodsCompletionPercentage = (
  reputation: EnhancedReputation
): number => {
  if (!reputation.methods || reputation.methods.length === 0) return 0

  // Get count of completable methods
  const completableCount = getCompletableMethodsCount(reputation)

  // If no completable methods, return 0
  if (completableCount === 0) return 0

  // Calculate percentage using only completable methods
  return (getCompletedMethodsCount(reputation) / completableCount) * 100
}

// Save method completion status to localStorage
const saveMethodCompletionStatus = () => {
  // Get current saved state or create a new one
  const currentState = StorageService.loadTasksState() || {} // Initialize the settings structure if it doesn't exist
  if (!currentState.settings) {
    currentState.settings = {}
  }

  // Use type assertion to add the reputationMethods property
  if (!('reputationMethods' in (currentState.settings as Record<string, unknown>))) {
    (currentState.settings as Record<string, unknown>).reputationMethods = {
      completedMethods: {}
    }
  }

  // Update the reputation method completion tracking
  const settingsWithMethods = currentState.settings as Record<string, unknown>
  if (settingsWithMethods.reputationMethods) {
    (settingsWithMethods.reputationMethods as Record<string, unknown>).completedMethods =
      methodCompletionTracking.value
  }

  // Save the updated state
  StorageService.saveTasksState(currentState)
}

// Save UI settings when showExalted changes
watch(showExalted, (newValue) => {
  // Get current saved state or create a new one
  const currentState = StorageService.loadTasksState() || {}

  // Initialize the settings structure if it doesn't exist
  if (!currentState.settings) {
    currentState.settings = {}
  }
  if (!currentState.settings.uiSettings) {
    currentState.settings.uiSettings = {
      reputationSettings: { showExalted: true, showParagon: true }
    }
  } else if (!currentState.settings.uiSettings.reputationSettings) {
    currentState.settings.uiSettings.reputationSettings = { showExalted: true, showParagon: true }
  }

  // Update the reputation settings
  currentState.settings.uiSettings.reputationSettings.showExalted = newValue

  // Save the updated state
  StorageService.saveTasksState(currentState)
})

// Save UI settings when showParagon changes
watch(showParagon, (newValue) => {
  // Get current saved state or create a new one
  const currentState = StorageService.loadTasksState() || {}

  // Initialize the settings structure if it doesn't exist
  if (!currentState.settings) {
    currentState.settings = {}
  }
  if (!currentState.settings.uiSettings) {
    currentState.settings.uiSettings = {
      reputationSettings: { showExalted: true, showParagon: true }
    }
  } else if (!currentState.settings.uiSettings.reputationSettings) {
    currentState.settings.uiSettings.reputationSettings = { showExalted: true, showParagon: true }
  }

  // Update the reputation settings
  currentState.settings.uiSettings.reputationSettings.showParagon = newValue

  // Save the updated state
  StorageService.saveTasksState(currentState)
})
</script>

<style scoped>
.bg-overlay {
  padding: 2rem;
  width: 100%;
  text-align: center;
}

.cinzel-font {
  font-family: "Cinzel", serif !important;
  letter-spacing: 0.5px;
}

.reputation-card {
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.1);
}

.reputation-card:hover {
  transform: translateY(-2px);
}

.method-item {
  border-left: 3px solid transparent;
}

.method-item:hover {
  border-left-color: var(--v-primary-base);
  background-color: rgba(255, 255, 255, 0.05);
}

.bg-success-subtle {
  background-color: rgba(76, 175, 80, 0.12) !important;
}

.nowrap {
  white-space: nowrap;
}
</style>
