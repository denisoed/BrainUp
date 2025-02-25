import { createMemoryHistory, createRouter } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import GamePage from '@/pages/GamePage.vue'
import LeaderboardPage from '@/pages/LeaderboardPage.vue'

const routes = [
  { path: '/', component: HomePage, meta: { layout: 'MainLayout' }},
  { path: '/list', component: HomePage, meta: { layout: 'MainLayout' }},
  { path: '/leaderboard', component: LeaderboardPage, meta: { layout: 'MainLayout' }},
  { path: '/settings', component: () => import('@/pages/SettingsPage.vue'), meta: { layout: 'MainLayout' }},
  { path: '/game/:game', component: GamePage, meta: { layout: 'MainLayout' }},
  { 
    path: '/buy-premium', 
    component: () => import('@/pages/BuyPremiumPage.vue'),
    meta: { layout: 'MainLayout' }
  },
]

export async function loadLayoutMiddleware(route) {
  const layout = route.meta.layout || 'MainLayout'
  const layoutComponent = await import(`../layouts/${layout}.vue`)  
  route.meta.layoutComponent = layoutComponent.default
}

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach(loadLayoutMiddleware)

export default router