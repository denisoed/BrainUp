<template>
  <div 
    class="victory-dialog"
  >
    <div class="victory-dialog_content">
      <div class="victory-dialog_icon">🏆</div>
      <h2 class="victory-dialog_title">{{ $t('games.victory.title') }}</h2>
      <div class="victory-dialog_text">{{ $t('games.victory.text') }}</div>
      <div class="victory-dialog_stats">
        <div class="stat">
          <div class="stat_label">{{ $t('games.victory.earned') }}</div>
          <div class="stat_value">+{{ score }} xp</div>
        </div>
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

defineProps<{
  score: number;
}>();

const emit = defineEmits<{
  (e: 'finish'): void;
  (e: 'restart'): void;
}>();

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
});
</script>

<style scoped lang="scss">
.victory-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent !important;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;

  &_content {
    background: var(--card-bg);
    border-radius: 16px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    transition: transform 0.3s ease;
    transform: translateY(0);
  }

  &_icon {
    font-size: 64px;
    margin-bottom: 16px;
    animation: bounce 1s infinite;
  }

  &_title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: var(--primary);
  }

  &_text {
    font-size: 16px;
    margin-bottom: 24px;
    color: var(--white-color);
  }

  &_stats {
    margin-bottom: 24px;

    .stat {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &_label {
        font-size: 22px;
        color: var(--white-color);
      }
      
      &_value {
        font-size: 22px;
        font-weight: bold;
        color: var(--primary);
        background: linear-gradient(45deg, var(--primary), #45B7D1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  &_actions {
    display: flex;
    gap: 16px;
    justify-content: center;

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.9;
      }

      &--primary {
        background: var(--primary);
        color: var(--dark-color);
        border: none;
      }

      &--secondary {
        background: transparent;
        color: var(--white-color);
        border: 1px solid var(--white-color);
      }
    }
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
</style> 