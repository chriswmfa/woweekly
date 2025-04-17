<template>
  <v-app>
    <!-- Top Banner -->
    <v-app-bar app elevation="6">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="wow-title" style="text-transform: none;">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Add character greeting -->
      <div v-if="characterName" class="mr-4 text-caption font-weight-medium">
        Hello, {{ characterName }}!
      </div>
      <ResetTimer class="mr-4" />
    </v-app-bar>

    <!-- Enhanced Side Menu -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :temporary="$vuetify.display.mdAndDown"
      :permanent="$vuetify.display.lgAndUp"
      :rail="miniVariant"
      elevation="4"
      border="opacity-25"
    >

      <v-divider class="border-opacity-25"></v-divider>

      <!-- Navigation Links -->
      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          link
          :prepend-icon="item.icon"
          :color="item.color || 'primary'"
          rounded="lg"
          class="mb-1"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Pin the Clear All Data button to the bottom -->
      <v-spacer></v-spacer>
      <v-list-item
        v-if="clearDataButton"
        @click="clearDataButton.action"
        link
        :prepend-icon="clearDataButton.icon"
        :color="clearDataButton.color"
        rounded="lg"
        class="mt-3 d-flex align-center justify-center"
        style="position: absolute; bottom: 16px; left: 16px; right: 16px; background-color: red; color: white; text-align: center;"
      >
        <v-list-item-title>{{ clearDataButton.title }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>

    <!-- Content Area -->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <!-- Add Snackbar Component -->
    <SnackbarNotification />
  </v-app>
</template>

<script lang="ts" setup>
// Import necessary Vue and Vuetify features
import { ref, onMounted } from 'vue'
import SnackbarNotification from '@/components/SnackbarNotification.vue'
import ResetTimer from '@/components/ResetTimer.vue'
import { StorageService } from '@/services/storageService';

// State for controlling drawer and mini-variant mode
const drawer = ref(true)
const miniVariant = ref(window.innerWidth < 1600 && window.innerWidth >= 1280)

// Menu items to display in the navigation drawer
const menuItems = ref([
  { title: 'Home', path: '/', icon: 'mdi-home', color: 'alliance' },
  { title: 'Tasks', path: '/tasks', icon: 'mdi-checkbox-marked-circle-outline', color: 'primary' },
  { title: 'Reputations', path: '/reputations', icon: 'mdi-shield-star', color: 'purple' },
  { title: 'Mounts', path: '/mounts', icon: 'mdi-horse', color: 'brown' },
  { title: 'Calendar Events', path: '/calendar', icon: 'mdi-calendar', color: 'blue' },
  { title: 'Settings', path: '/settings', icon: 'mdi-cog', color: 'grey' }
])

// Title for the banner
const title = ref('WoWeekly')

// Add a reactive variable to track the character name
const characterName = ref('')

// Watch for character updates from the storage service
onMounted(() => {
  const storedCharacter = StorageService.getCharacterInfo()
  if (storedCharacter) {
    // Capitalize the first letter of the character name
    characterName.value = storedCharacter.name.charAt(0).toUpperCase() + storedCharacter.name.slice(1)
  }
})

// Handle window resize to update miniVariant
window.addEventListener('resize', () => {
  if (window.innerWidth < 1600 && window.innerWidth >= 1280) {
    miniVariant.value = true
  } else if (window.innerWidth >= 1600) {
    miniVariant.value = false
  }
})

// Add a red button for clearing all data
const clearDataButton = {
  title: 'Clear All Data',
  action: () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      StorageService.clearAllData();
      location.reload();
    }
  },
  icon: 'mdi-delete',
  color: 'red'
};
</script>

<style scoped>
.wow-title {
  font-family: 'Cinzel', serif !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
