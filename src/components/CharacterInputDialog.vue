// filepath: /Users/chris/Desktop/woweekly/src/components/CharacterInputDialog.vue
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
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="realm"
                label="Realm"
                required
                :rules="[v => !!v || 'Realm is required']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="region"
                label="Region"
                :items="regions"
                required
                :rules="[v => !!v || 'Region is required']"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="!formValid"
          @click="submitForm"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
import { StorageService } from '@/services/storageService'

const emit = defineEmits(['character-set'])

const dialogVisible = ref(true)
const formValid = ref(false)
const characterName = ref('')
const realm = ref('')
const region = ref('eu')
const regions = ['eu', 'us', 'kr', 'tw']
const form = ref<any>(null)

// Check if character data is already stored
const storedCharacter = StorageService.getCharacterInfo()
if (storedCharacter) {
  characterName.value = storedCharacter.name
  realm.value = storedCharacter.realm
  region.value = storedCharacter.region
}

const submitForm = () => {
  if (!formValid.value) {
    return
  }

  // Save character info in storage
  StorageService.saveCharacterInfo({
    name: characterName.value.toLowerCase(),
    realm: realm.value.toLowerCase(),
    region: region.value.toLowerCase()
  })

  dialogVisible.value = false
  emit('character-set')
}
</script>
