<template>
  <v-snackbar
    v-model="snackbarService.state.show"
    :color="snackbarService.state.color"
    :timeout="snackbarService.state.timeout"
    location="bottom"
    rounded="pill"
  >
    <div class="d-flex align-center">
      <v-icon v-if="snackbarService.state.color === 'success'" icon="mdi-check-circle" class="mr-2"></v-icon>
      <v-icon v-else-if="snackbarService.state.color === 'error'" icon="mdi-alert-circle" class="mr-2"></v-icon>
      <v-icon v-else-if="snackbarService.state.color === 'info'" icon="mdi-information" class="mr-2"></v-icon>
      {{ snackbarService.state.message }}
    </div>

    <template v-slot:actions>
      <v-btn
        color="white"
        icon="mdi-close"
        variant="text"
        @click="snackbarService.close()"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { snackbarService } from '@/services/snackbarService'
</script>
