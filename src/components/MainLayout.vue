<template>
  <v-app>
    <!-- Top Banner -->
    <v-app-bar app elevation="6">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="wow-title" style="text-transform: none;">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
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
import { ref } from 'vue'
import SnackbarNotification from '@/components/SnackbarNotification.vue'
import ResetTimer from '@/components/ResetTimer.vue'

// State for controlling drawer and mini-variant mode
const drawer = ref(true)
const miniVariant = ref(window.innerWidth < 1600 && window.innerWidth >= 1280)

// Menu items to display in the navigation drawer
const menuItems = ref([
  { title: 'Home', path: '/', icon: 'mdi-home', color: 'alliance' },
  { title: 'Tasks', path: '/tasks', icon: 'mdi-checkbox-marked-circle-outline', color: 'primary' },
  { title: 'Reputations', path: '/reputations', icon: 'mdi-shield-star', color: 'purple' }
])

// Title for the banner
const title = ref('WoWeekly')

// Handle window resize to update miniVariant
window.addEventListener('resize', () => {
  if (window.innerWidth < 1600 && window.innerWidth >= 1280) {
    miniVariant.value = true
  } else if (window.innerWidth >= 1600) {
    miniVariant.value = false
  }
})
</script>

<style scoped>
.wow-title {
  font-family: 'Cinzel', serif !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
