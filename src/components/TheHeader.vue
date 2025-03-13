<template>
  <header class="header container">
    <div class="welcome-section">
      <h1 class="welcome-title" v-html="$t('home.welcome', { name: userName })" />
      <p class="welcome-subtitle">{{ $t('home.subtitle') }}</p>
    </div>
    <div class="streak-btn" @click="openStreakDialog">
      <span class="streak-icon">🔥</span>
      <span class="streak-count">{{ streak }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStreakStore } from '@/stores/streak';
import { openModal } from 'jenesius-vue-modal';
import StreakDialog from '@/components/Dialogs/StreakDialog.vue';

const userName = ref('');

const streakStore = useStreakStore();
const streak = computed(() => streakStore.getStreak);

async function openStreakDialog() {
  const modal = await openModal(StreakDialog, {
    currentStreak: streakStore.getStreak,
    bestStreak: streakStore.getBestStreak,
    lastDays: streakStore.getLastDays
  });
  modal.on('close', () => {
    modal.close();
  });
}

onMounted(() => {
  streakStore.initializeStreak();

  // Get user data from Telegram WebApp
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    userName.value = user.first_name || '';
  }
});
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.streak-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  .streak-icon {
    font-size: 20px;
  }

  .streak-count {
    color: var(--white-color);
    font-weight: 600;
  }
}

.welcome-section {
  width: 100%;

  :deep(h1) {
    font-size: 32px;
    color: var(--white-color);
    font-weight: bold;
    margin: 0;

    span {
      color: var(--primary);
    }
  }
  
  .welcome-subtitle {
    color: var(--white-color);
    opacity: 0.7;
    margin: 0;
  }
}
</style>