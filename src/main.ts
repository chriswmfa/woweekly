import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify' // Import configured Vuetify from plugins
import '@mdi/font/css/materialdesignicons.css' // Import Material Design Icons
import { loadFonts } from './plugins/webfontloader' // Import webfontloader

// Load fonts before mounting the app
loadFonts()

createApp(App)
  .use(store)
  .use(router)
  .use(vuetify)
  .mount('#app')
