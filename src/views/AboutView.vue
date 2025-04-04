<template>
  <v-container class="about py-8">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="mb-6" elevation="3">
          <v-img
            src="/img/bg-texture.jpg"
            height="150"
            cover
            class="align-end"
          >
            <div class="bg-overlay">
              <h1 class="text-h3 font-weight-bold cinzel-font">About Weekly WoW Tasks</h1>
            </div>
          </v-img>

          <v-card-text class="pa-6">
            <p class="text-body-1 mb-4">
              Weekly WoW Tasks is a task tracking application designed to help World of Warcraft players keep
              track of their daily and weekly activities across all expansions. Never miss an important task again!
            </p>

            <v-divider class="my-6"></v-divider>

            <h2 class="text-h5 mb-4 cinzel-font">Features</h2>
            <v-row>
              <v-col cols="12" sm="6">
                <v-list>
                  <v-list-item v-for="(feature, index) in features.slice(0, 3)" :key="index">
                    <template v-slot:prepend>
                      <v-icon :color="feature.color" class="mr-2">{{ feature.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ feature.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ feature.description }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" sm="6">
                <v-list>
                  <v-list-item v-for="(feature, index) in features.slice(3)" :key="index + 3">
                    <template v-slot:prepend>
                      <v-icon :color="feature.color" class="mr-2">{{ feature.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ feature.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ feature.description }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h2 class="text-h5 mb-4 cinzel-font">How To Use</h2>
            <v-timeline>
              <v-timeline-item
                v-for="(step, i) in steps"
                :key="i"
                :dot-color="step.color"
                size="small"
              >
                <div class="mb-4">
                  <div class="font-weight-bold text-subtitle-1">{{ step.title }}</div>
                  <div>{{ step.description }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>

            <v-divider class="my-6"></v-divider>

            <h2 class="text-h5 mb-4 cinzel-font">About This Project</h2>
            <p class="text-body-1 mb-3">
              This project was created to help World of Warcraft players keep track of their tasks across all expansions.
              It's built using Vue.js, Vuetify, and TypeScript, with local storage to persist your progress.
            </p>

            <p class="text-body-1 mb-5">
              The app is a personal project and is not affiliated with or endorsed by Blizzard Entertainment.
              All World of Warcraft content and references are property of Blizzard Entertainment.
            </p>

            <h3 class="text-h6 mb-2">Version Info</h3>
            <p class="text-body-2">Version: 1.0.0</p>
            <p class="text-body-2">Last Updated: April 2025</p>
            <p class="text-body-2">Created by: A WoW Enthusiast</p>
          </v-card-text>
        </v-card>

        <v-card class="text-center" color="surface-variant" variant="outlined">
          <v-card-text>
            <p class="text-body-1">Have questions or suggestions?</p>
            <v-btn
              color="primary"
              class="mt-2"
              prepend-icon="mdi-email"
              href="mailto:contact@example.com"
              target="_blank"
            >
              Contact Us
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const features = ref([
  {
    title: 'Task Tracking',
    description: 'Track daily and weekly tasks across all expansions',
    icon: 'mdi-checkbox-marked-circle-outline',
    color: 'primary'
  },
  {
    title: 'Progress Saving',
    description: 'Your progress is saved automatically in your browser',
    icon: 'mdi-content-save',
    color: 'success'
  },
  {
    title: 'Task Filtering',
    description: 'Filter tasks by type to focus on what matters',
    icon: 'mdi-filter',
    color: 'info'
  },
  {
    title: 'Multiple Expansions',
    description: 'Support for all WoW expansions',
    icon: 'mdi-book-open-variant',
    color: 'warning'
  },
  {
    title: 'Progress Visualization',
    description: 'See your completion progress at a glance',
    icon: 'mdi-chart-line',
    color: 'secondary'
  },
  {
    title: 'Task Notes',
    description: 'Add personal notes to any task',
    icon: 'mdi-note-text',
    color: 'accent'
  }
])

const steps = ref([
  {
    title: '1. Select an Expansion',
    description: 'Choose which WoW expansion you want to track tasks for',
    color: 'primary'
  },
  {
    title: '2. Filter Tasks (Optional)',
    description: 'Use the task type filters to show only specific types of tasks',
    color: 'secondary'
  },
  {
    title: '3. Track Your Progress',
    description: 'Check off tasks as you complete them in-game',
    color: 'success'
  },
  {
    title: '4. Add Notes (Optional)',
    description: 'Add personal notes to tasks for additional information',
    color: 'info'
  },
  {
    title: '5. Monitor Your Progress',
    description: 'Watch the progress bars fill up as you complete more tasks',
    color: 'warning'
  }
])
</script>

<style scoped>
.about {
  padding-bottom: 4rem;
}

.bg-overlay {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 2rem;
  width: 100%;
  text-align: center;
}

.cinzel-font {
  font-family: 'Cinzel', serif !important;
  letter-spacing: 0.5px;
}
</style>
