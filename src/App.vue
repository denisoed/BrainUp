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
import { VIBRATION_LOCAL_STORAGE_KEY } from '@/config';
import AppContainerLayout from '@/layouts/index.vue';

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
