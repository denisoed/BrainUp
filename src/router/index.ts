import { createMemoryHistory, createRouter } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import ExercisesPage from '@/pages/ExercisesPage.vue'
import ItemPage from '@/pages/ItemPage.vue'

const routes = [
  { path: '/', component: HomePage, meta: { layout: 'MainLayout' }},
  { path: '/list', component: HomePage, meta: { layout: 'MainLayout' }},
  { path: '/activity', component: HomePage, meta: { layout: 'MainLayout' }},
  { path: '/settings', component: HomePage, meta: { layout: 'MainLayout' }},
  { path: '/exercises', component: ExercisesPage, meta: { layout: 'MainLayout' }},
  { path: '/item/:type', component: ItemPage, meta: { layout: 'BreatheLayout' }},
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