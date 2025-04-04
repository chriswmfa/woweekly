<!-- src/App.vue -->
<template>
  <Layout />
</template>

<script lang="ts" setup>
// Import the Layout component
import Layout from '@/components/MainLayout.vue'
</script>

<style>
/* Global styles with higher specificity */
html, body {
  font-family: 'Nunito', sans-serif !important;
}

/* Target Vuetify components specifically */
.v-application {
  font-family: 'Nunito', sans-serif !important;
}

.v-application [class*='text-'] {
  font-family: 'Nunito', sans-serif !important;
}

/* Keep headings in Cinzel with maximum specificity */
.v-application h1,
.v-application h2,
.v-application h3,
.v-application h4,
.v-application h5,
.v-application h6,
.v-application .text-h1,
.v-application .text-h2,
.v-application .text-h3,
.v-application .text-h4,
.v-application .text-h5,
.v-application .text-h6,
.v-card-title.text-h1,
.v-card-title.text-h2,
.v-card-title.text-h3,
.v-card-title.text-h4,
.v-card-title.text-h5,
.v-card-title.text-h6 {
  font-family: 'Cinzel', serif !important;
  letter-spacing: 0.5px;
}

/* Add specific font for text body classes */
.text-body-1, .text-body-2,
.text-subtitle-1, .text-subtitle-2 {
  font-family: 'Nunito', sans-serif !important;
}

/* Ensure font-weight is preserved for Cinzel */
.font-weight-bold.text-h1,
.font-weight-bold.text-h2,
.font-weight-bold.text-h3,
.font-weight-bold.text-h4,
.font-weight-bold.text-h5,
.font-weight-bold.text-h6 {
  font-family: 'Cinzel', serif !important;
}
</style>
