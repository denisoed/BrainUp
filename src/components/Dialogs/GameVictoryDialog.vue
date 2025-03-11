<template>
  <div 
    class="victory-dialog"
    v-touch:swipe.up="onFinish"
    v-touch:swipe.down="onFinish"
  >
    <div class="victory-dialog_content flex column items-center">
      <button class="close-btn" @click="onFinish">×</button>
      <div class="victory-dialog_icon">🏆</div>
      <h2 class="victory-dialog_title">{{ $t('games.victory.title') }}</h2>
      <div class="victory-dialog_stats-and-text flex column items-center">
        <div class="victory-dialog_stats">
          <div class="stat">
            <div class="stat_label">{{ $t('games.victory.earned') }}</div>
            <div class="stat_value flex items-center gap-xs">
              <span>+{{ score }}</span>
              <span>{{ GAME_SCORE_NAME }}</span>
            </div>
          </div>
        </div>
        <div class="victory-dialog_text">{{ $t('games.victory.text') }}</div>
      </div>
      <div class="victory-dialog_actions">
        <button 
          class="btn btn--secondary"
          @click="onFinish"
        >
          {{ $t('games.victory.finish') }}
        </button>
        <button 
          class="btn btn--primary"
          @click="onRestart"
        >
          {{ $t('games.victory.restart') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import confetti from 'canvas-confetti';
import { GAME_SCORE_NAME } from '@/config';
import { useStreakStore } from '@/stores/streak';

defineProps<{
  score: number;
}>();

const emit = defineEmits<{
  (e: 'finish'): void;
  (e: 'restart'): void;
}>();

const streakStore = useStreakStore();

function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function onFinish() {
  emit('finish');
}

function onRestart() {
  emit('restart');
}

onMounted(() => {
  setTimeout(fireConfetti, 300);
  streakStore.completeDay();
});
</script>

<style scoped lang="scss">
.victory-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: none;

  &_content {
    background: var(--dark-color);
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 400px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &_icon {
    font-size: 64px;
    margin-bottom: 16px;
    animation: bounce 1s infinite;
  }

  &_title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 8px;
    color: var(--primary);
  }

  &_stats-and-text {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
  }

  &_stats {
    margin-bottom: 8px;

    .stat {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      line-height: normal;
      text-align: center;

      &_label {
        color: var(--white-color);
        font-size: 22px;
      }
      
      &_value {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--primary);
        font-size: 24px;
        font-weight: bold;
      }
    }
  }

  &_text {
    text-align: center;
    max-width: 234px;
    font-size: 14px;
    color: var(--white-color);
    opacity: 0.7;
    margin: 0 auto;
  }

  &_actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    width: 100%;
  }
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &--primary {
    background: var(--primary);
    color: var(--dark-color);
    border: none;
  }

  &--secondary {
    background: var(--white-color);
    color: var(--dark-color);
    border: none;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.close-btn {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--white-color);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
  position: absolute;
  top: 12px;
  right: 12px;

  &:hover {
    opacity: 1;
  }
}
</style> 