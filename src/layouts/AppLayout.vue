<template>
  <router-view v-slot="{ Component }" class="page">
    <keep-alive :include="['HomePage', 'GamePage']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { VIBRATION_LOCAL_STORAGE_KEY } from '@/config';

configDialog({
  animation: "slide-bottom"
})

function vibrate() {
  const vibrationIsEnabled = localStorage.getItem(VIBRATION_LOCAL_STORAGE_KEY) === 'true';
  if (window?.Telegram?.WebApp && vibrationIsEnabled) {
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

<style lang="scss" scoped>
.page {
  position: relative;
  z-index: 1;
}
</style>