import { createMemoryHistory, createRouter } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import ItemPage from '@/pages/ItemPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/item/:type', component: ItemPage },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router