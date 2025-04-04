// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

// WoW-inspired theme
export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    defaultTheme: 'wowTheme',
    themes: {
      wowTheme: {
        dark: true,
        colors: {
          primary: '#4F9DFF', // Arcane blue
          secondary: '#CF9B52', // Gold/ornate accent color
          accent: '#A330C9', // Epic purple
          error: '#FF5252', // Red for errors
          info: '#00CAE3', // Frost mage blue
          success: '#4CAF50', // Green for completion
          warning: '#FFC107', // Amber for warnings
          background: '#1E293B', // Dark blue background
          surface: '#283447', // Slightly lighter card background
          alliance: '#0078FF', // Alliance blue
          horde: '#B30000' // Horde red
        }
      }
    }
  },
  defaults: {
    VBtn: {
      fontFamily: 'Nunito, sans-serif'
    },
    VCard: {
      fontFamily: 'Nunito, sans-serif'
    },
    VTextField: {
      fontFamily: 'Nunito, sans-serif'
    },
    VList: {
      fontFamily: 'Nunito, sans-serif'
    },
    VToolbar: {
      fontFamily: 'Nunito, sans-serif'
    }
  }
})
