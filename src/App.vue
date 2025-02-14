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
import { onMounted, onUnmounted } from 'vue';
import AppContainerLayout from '@/layouts/index.vue';

function vibrate() {
  if (window?.Telegram?.WebApp) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

onMounted(() => {
  document.addEventListener('click', vibrate);
})

onUnmounted(() => {
  document.removeEventListener('click', vibrate);
})
</script>
