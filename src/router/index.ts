import { createMemoryHistory, createRouter } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import GamePage from '@/pages/GamePage.vue'
import LeaderboardPage from '@/pages/LeaderboardPage.vue'
import ListPage from '@/pages/ListPage.vue'
import WelcomePage from '@/pages/WelcomePage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import BuyPremiumPage from '@/pages/BuyPremiumPage.vue'
import TrainingPage from '@/pages/TrainingPage.vue'
import { HAS_SEEN_WELCOME_LOCAL_STORAGE_KEY } from '@/config'

const routes = [
  { path: '/welcome', component: WelcomePage, meta: { layout: 'SimpleLayout' } },
  { path: '/', component: HomePage, meta: { layout: 'MainLayout' }},
  { path: '/list', component: ListPage, meta: { layout: 'MainLayout' }},
  { path: '/leaderboard', component: LeaderboardPage, meta: { layout: 'MainLayout' }},
  { path: '/settings', component: SettingsPage, meta: { layout: 'MainLayout' }},
  { path: '/game/:game', component: GamePage, meta: { layout: 'MainLayout' }},
  { 
    path: '/buy-premium', 
    component: BuyPremiumPage,
    meta: { layout: 'MainLayout' }
  },
  {
    path: '/training',
    name: 'Training',
    component: TrainingPage,
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

router.beforeEach(async (to, from, next) => {
  // Check if user has seen welcome page
  const hasSeenWelcome = localStorage.getItem(HAS_SEEN_WELCOME_LOCAL_STORAGE_KEY)

  if (!hasSeenWelcome && to.path !== '/welcome') {
    // Redirect to welcome page if user hasn't seen it
    next('/welcome')
  } else {
    await loadLayoutMiddleware(to)
    next()
  }
})

export default router