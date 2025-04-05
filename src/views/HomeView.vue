<!-- src/views/Home.vue -->
<template>
  <v-container class="home">
    <v-row justify="center">
      <v-col cols="12">
        <!-- Hero Section -->
        <v-card class="pa-5 hero-card" elevation="10">
          <v-img
            src="/img/bg-texture.jpg"
            cover
            class="align-middle"
          >
            <div class="hero-overlay">
              <h1 class="text-h2 font-weight-bold cinzel-font">WoWeekly</h1>
              <p class="text-h6 mt-2">Track your progress across Azeroth</p>
            </div>
          </v-img>
          <v-card-text class="py-4 text-center">
            <p class="text-body-1">Manage your weekly tasks across all World of Warcraft expansions</p>
            <v-btn
              color="primary"
              class="mt-4"
              size="large"
              to="/tasks"
              prepend-icon="mdi-checkbox-marked-circle-outline"
            >
              Start Tracking Tasks
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Expansions Section (with status indicators) -->
        <h2 class="text-h4 pa-4 text-center font-weight-bold cinzel-font">Supported Expansions</h2>
        <v-row>
          <v-col v-for="(expansion, index) in expansions" :key="index" cols="6" sm="4" md="3">
            <v-card
              class="expansion-card"
              :color="'success-lighten-4'"
              height="100%"
              flat
            >
              <v-card-title class="text-center position-relative">
                <span :class="{ 'text-success': expansion.available }">{{ expansion.name }}</span>
              </v-card-title>
              <v-card-subtitle class="text-center pb-0">
                <v-chip
                  size="small"
                  :color="expansion.available ? 'success' : 'red'"
                  :text="expansion.available ? 'Available' : 'Coming Soon'"
                ></v-chip>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Expansion, ExpansionData } from '@/types/tasks'

// Create expansions array using the ExpansionData object
const expansions = ref([
  { ...ExpansionData.tww, available: true },
  { ...ExpansionData.df, available: false },
  { ...ExpansionData.sl, available: false },
  { ...ExpansionData.bfa, available: false },
  { ...ExpansionData.legion, available: false },
  { ...ExpansionData.wod, available: false },
  { ...ExpansionData.mop, available: false },
  { ...ExpansionData.cata, available: false },
  { ...ExpansionData.wotlk, available: false },
  { ...ExpansionData.tbc, available: false },
  { ...ExpansionData.classic, available: false }
])
</script>

<style scoped>
.home {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.hero-card {
  border-radius: 12px;
  overflow: hidden;
}

.hero-overlay {
  /* padding: 2rem; */
  width: 100%;
  text-align: center;
}

.feature-card {
  transition: transform 0.3s;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.expansion-card {
  transition: all 0.3s;
  text-align: center;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.expansion-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.unavailable-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
}

.how-it-works-card {
  transition: transform 0.3s;
  height: 100%;
}

.how-it-works-card:hover {
  transform: translateY(-5px);
}

h1, h2, h3 {
  font-family: 'Cinzel', serif;
}

/* Explicit Cinzel font styling */
.cinzel-font {
  font-family: 'Cinzel', serif !important;
  letter-spacing: 0.5px;
}
</style>
