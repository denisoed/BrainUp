<template>
  <div class="game-header">
    <div class="game-header__stats">
      <!-- Stats -->
      <div class="flex justify-between full-width">
        <div class="timer">
          <span class="timer-icon">⏳</span>
          <span class="timer-label">{{ $t('games.time') }}:</span>
          <span class="timer-value">{{ timeLeft.toFixed(1) }}</span>
        </div>
        <div class="score">
          <span class="score-icon">🏆</span>
          <span class="score-label">{{ $t('games.score') }}:</span>
          <span class="score-value">{{ score }}/{{ winningStreak }}</span>
        </div>
      </div>

      <!-- Level and difficulty -->
      <div class="flex justify-between full-width game-header__level-difficulty">
        <div class="difficulty-info">
          <span class="difficulty-label">{{ $t('games.difficulty.title') }}:</span>
          <span class="difficulty-value">{{ $t(`games.difficulty.${difficulty}`) }}</span>
        </div>
        <div class="level-info">
          <span class="level-label">{{ $t('games.level') }}:</span>
          <span class="level-value">{{ level }}</span>
        </div>
      </div>
    </div>

    <ProgressBar :progress="progress" class="game-header__progress" />
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/Games/ProgressBar.vue';

interface Props {
  level: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLeft: number;
  score: number;
  winningStreak: number;
  progress: number;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.game-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: calc(100% - 32px);
  max-width: 600px;
  margin: 0 auto;
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
}

.game-header__level-difficulty {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.level-info,
.difficulty-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.level-label,
.difficulty-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.level-value {
  color: var(--primary);
  font-weight: 600;
  font-size: 16px;
}

.difficulty-value {
  color: var(--white-color);
  font-weight: 600;
  font-size: 16px;
}

.game-header__stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.timer,
.score {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.timer-icon,
.score-icon {
  font-size: 16px;
}

.timer-label,
.score-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.timer-value,
.score-value {
  color: var(--white-color);
  font-weight: 600;
  font-size: 16px;
}

.game-header__progress {
  position: absolute;
  top: 0;
  left: 0;
}

@media (max-width: 480px) {
  .game-header__stats {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style> 