import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import i18n from '@/i18n'
import initBoots from '@/boots';
import { createPinia } from 'pinia'
import Vue3TouchEvents from 'vue3-touch-events';
import { initYandexMetrika } from 'yandex-metrika-vue3';

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Vue3TouchEvents)
app.use(initYandexMetrika, {
  id: 98321229,
  router: router,
  env: process.env.NODE_ENV,
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:true
})

initBoots({ app })

app.mount('#app')
