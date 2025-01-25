import { createWebHashHistory, createRouter } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import ItemPage from '@/pages/ItemPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/item/:type', component: ItemPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router