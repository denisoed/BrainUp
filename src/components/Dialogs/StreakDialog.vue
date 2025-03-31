<template>
  <div class="streak-dialog">
    <div class="streak-dialog_content">
      <div class="streak-dialog_header">
        <div class="streak-dialog_title">
          <span class="streak-dialog_emoji">🔥</span>
          <h2>{{ $t('streak.title') }}</h2>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="streak-dialog_stats">
        <div class="stat">
          <div class="stat_label">{{ $t('streak.current') }}</div>
          <div class="stat_value">{{ currentStreak }} {{ $t('streak.days') }}</div>
        </div>
        <div class="stat">
          <div class="stat_label">{{ $t('streak.best') }}</div>
          <div class="stat_value">{{ bestStreak }} {{ $t('streak.days') }}</div>
        </div>
      </div>

      <div class="streak-calendar">
        <div 
          v-for="(day, index) in lastDays" 
          :key="index"
          class="calendar-day"
          :class="{ 'calendar-day--active': day.completed }"
        >
          <div class="day-dot" />
          <div class="day-label">{{ day.label }}</div>
        </div>
      </div>

      <div class="streak-dialog_footer">
        <button class="btn" @click="goToTraining">
          {{ $t('streak.train') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  currentStreak: number;
  bestStreak: number;
  lastDays: Array<{
    date: Date;
    completed: boolean;
    label: string;
  }>;
}

const router = useRouter();

defineProps<Props>();
const emit = defineEmits(['close']);

const goToTraining = () => {
  emit('close');
  router.push('/training');
};
</script>

<style scoped lang="scss">
.streak-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-shadow: none;

  &_content {
    background: var(--dark-color);
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 400px;
    position: relative;
  }

  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &_title {
    display: flex;
    align-items: center;
    gap: 12px;

    h2 {
      color: var(--white-color);
      margin: 0;
      font-size: 24px;
    }
  }

  &_emoji {
    font-size: 32px;
    animation: bounce 1s infinite;
  }

  &_stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    .stat {
      text-align: center;
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;

      &_label {
        color: var(--white-color);
        opacity: 0.7;
        font-size: 14px;
        margin-bottom: 8px;
      }

      &_value {
        color: var(--primary);
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
}

.streak-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .day-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  .day-label {
    font-size: 12px;
    color: var(--white-color);
    opacity: 0.7;
  }

  &--active {
    .day-dot {
      background: var(--primary);
    }
    .day-label {
      opacity: 1;
    }
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
}

.btn {
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;
  background: var(--white-color);
  color: var(--dark-color);

  &--primary {
    background: var(--primary);
    border: none;

    &:hover {
      opacity: 0.9;
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