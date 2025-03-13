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
import { onMounted, onUnmounted, watch } from 'vue';
import AppContainerLayout from '@/layouts/index.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

function vibrate() {
  if (window?.Telegram?.WebApp) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

watch(() => route.path, () => {
  const app = document.getElementById('app');
  app.scrollTo(0, 0);
})

onMounted(() => {
  document.addEventListener('click', vibrate);
})

onUnmounted(() => {
  document.removeEventListener('click', vibrate);
})
</script>
