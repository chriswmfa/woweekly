import { reactive } from 'vue'

// Define the type for the snackbar state
interface SnackbarState {
  show: boolean
  message: string
  color: string
  timeout: number
}

// Random praise messages for task completion
const praiseMessages = [
  'Great job! Task completed! 🎉',
  'Awesome work! Keep it up! ⭐',
  'You\'re making excellent progress! 💪',
  'Success! One step closer to your goals! 🌟',
  'Task finished! You\'re on a roll! 🔥',
  'Well done! That\'s one less thing to worry about! ✅',
  'Impressive work! Keep the momentum going! 🚀',
  'Fantastic job completing that task! 👏',
  'Success! Your dedication is paying off! 💯'
]

// Create a reactive state object
const state = reactive<SnackbarState>({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
})

// Helper function to get a random praise message
const getRandomPraiseMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * praiseMessages.length)
  return praiseMessages[randomIndex]
}

// Function to show a success message
const showSuccess = (message: string = getRandomPraiseMessage(), timeout = 3000): void => {
  state.message = message
  state.color = 'success'
  state.timeout = timeout
  state.show = true
}

// Function to show an error message
const showError = (message: string, timeout = 3000): void => {
  state.message = message
  state.color = 'error'
  state.timeout = timeout
  state.show = true
}

// Function to show an info message
const showInfo = (message: string, timeout = 3000): void => {
  state.message = message
  state.color = 'info'
  state.timeout = timeout
  state.show = true
}

// Function to close the snackbar
const close = (): void => {
  state.show = false
}

// Export service
export const snackbarService = {
  state,
  showSuccess,
  showError,
  showInfo,
  close,
  getRandomPraiseMessage
}

export default snackbarService
