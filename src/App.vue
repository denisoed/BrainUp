<template>
  <AppContainerLayout>
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HomePage']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </AppContainerLayout>
</template>

<script setup>
import { onMounted, onUnmounted, watch, onBeforeMount } from 'vue';
import AppContainerLayout from '@/layouts/index.vue';
import { useRoute } from 'vue-router';
import useUser from '@/composables/useUser';

const route = useRoute();
const { setUser } = useUser();

function vibrate() {
  if (window?.Telegram?.WebApp) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

watch(() => route.path, () => {
  const app = document.getElementById('app');
  app.scrollTo(0, 0);
})

onBeforeMount(() => {
  // @ts-ignore - Telegram Web App API
  const tg = window.Telegram.WebApp;
  if (tg.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    setUser({
      id: user.id,
      name: `${user.first_name} ${user.last_name || ''}`.trim(),
      username: user.username || '',
      photo: user.photo_url || '',
    });
  }
})

onMounted(() => {
  document.addEventListener('click', vibrate);
})

onUnmounted(() => {
  document.removeEventListener('click', vibrate);
})
</script>
