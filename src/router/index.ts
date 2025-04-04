import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/tasks', name: 'Tasks', component: () => import('../views/TasksView.vue') },
  { path: '/about', name: 'About', component: () => import('../views/AboutView.vue') }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
