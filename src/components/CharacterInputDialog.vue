<template>
  <v-dialog v-model="dialogVisible" persistent max-width="500">
    <v-card>
      <v-card-title class="text-h5 font-weight-bold cinzel-font">
        Character Information Required
      </v-card-title>
      <v-card-text>
        <p class="mb-4">
          Please enter your World of Warcraft character information to view reputation data.
        </p>
        <v-form ref="form" v-model="formValid" @submit.prevent="submitForm">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="characterName"
                label="Character Name"
                required
                :rules="[v => !!v || 'Character name is required']"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Region Selection -->
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="region"
                label="Region"
                :items="supportedRegions"
                item-title="name"
                item-value="code"
                required
                @update:model-value="handleRegionChange"
                :rules="[v => !!v || 'Region is required']"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Searchable Realm Dropdown -->
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="realm"
                label="Realm"
                :items="filteredRealms"
                item-title="name"
                item-value="slug"
                :loading="loadingRealms"
                :disabled="loadingRealms || !realmsList.length"
                required
                :rules="[v => !!v || 'Realm is required']"
                return-object
              >
                <template v-slot:no-data v-if="!loadingRealms">
                  <v-list-item>
                    <v-list-item-title>
                      No realms found
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="!formValid || loadingRealms"
          @click="submitForm"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, defineEmits } from 'vue'
import { StorageService } from '@/services/storageService'
import { fetchRealms, type Realm } from '@/services/realmService'
import { snackbarService } from '@/services/snackbarService'

const emit = defineEmits(['character-set'])

const dialogVisible = ref(true)
const formValid = ref(false)
const characterName = ref('')
const realm = ref<Realm | null>(null)
const region = ref('eu')
const form = ref<HTMLFormElement | null>(null)
const loadingRealms = ref(false)
const realmsList = ref<Realm[]>([])

// Only support EU and US regions for now since we're implementing realm search
const supportedRegions = [
  { name: 'Europe', code: 'eu' },
  { name: 'Americas', code: 'us' }
]

// Filtered realms based on search
const filteredRealms = computed(() => {
  return realmsList.value
})

// Load realms for the selected region
const loadRealms = async () => {
  loadingRealms.value = true

  try {
    const realms = await fetchRealms(region.value)

    if (realms && realms.length > 0) {
      realmsList.value = realms
    } else {
      snackbarService.showError(`Failed to load realms for ${region.value.toUpperCase()} region`)
      realmsList.value = []
    }
  } catch (error) {
    console.error('Error loading realms:', error)
    snackbarService.showError('Error loading realm data')
    realmsList.value = []
  } finally {
    loadingRealms.value = false
  }
}

// Handle region change
const handleRegionChange = () => {
  realm.value = null
  loadRealms()
}

// Check if character data is already stored
const storedCharacter = StorageService.getCharacterInfo()
if (storedCharacter) {
  characterName.value = storedCharacter.name
  region.value = storedCharacter.region

  // We'll set the realm value after loading realms
}

// Load realms on component mount
onMounted(() => {
  loadRealms().then(() => {
    // If there's stored character data, try to find the matching realm
    if (storedCharacter && realmsList.value.length > 0) {
      const matchingRealm = realmsList.value.find(r =>
        r.slug.toLowerCase() === storedCharacter.realm.toLowerCase()
      )
      if (matchingRealm) {
        realm.value = matchingRealm
      }
    }
  })
})

const submitForm = () => {
  if (!formValid.value || !realm.value) {
    return
  }

  // Save character info in storage
  StorageService.saveCharacterInfo({
    name: characterName.value.toLowerCase(),
    realm: realm.value.slug.toLowerCase(),
    region: region.value.toLowerCase()
  })

  dialogVisible.value = false
  emit('character-set')
}
</script>
