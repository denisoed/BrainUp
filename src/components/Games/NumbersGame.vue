<template>
  <div class="numbers-game flex column items-center justify-center">
    <GameHeader 
      :level="levelNumber"
      :difficulty="currentDifficulty"
      :time-left="timeLeft"
      :score="score"
      :winning-streak="WINNING_STREAK"
      :progress="(timeLeft / TIME_LIMIT) * 100"
    />

    <div class="target-text mb-md mt-md">{{ target }}</div>

    <div class="buttons">
      <button
        v-for="number in numbers"
        :key="number"
        class="btn"
        @click="checkAnswer(number)"
      >
        {{ number }}
      </button>
    </div>

    <SuccessCounter :score="score" :winning-streak="WINNING_STREAK" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import GameHeader from '@/components/Games/GameHeader.vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { openModal } from 'jenesius-vue-modal';
import { useGameProgress } from '@/composables/useGameProgress';

const router = useRouter();
const route = useRoute();

// Используем composable для управления прогрессом
const gameId = route.params.game;
const { currentLevel, completeLevel, getDifficultyByLevel } = useGameProgress(gameId);

// Game state
const levelNumber = ref(route.query.level ? Number(route.query.level) : currentLevel.value);

const TIME_LIMIT = 10;
const WINNING_STREAK = 15;

const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const correctStreak = ref(0);
const numbers = ref<number[]>([]);
const target = ref(0);

let timerInterval: ReturnType<typeof setInterval>;

// Определяем сложность на основе текущего уровня
const currentDifficulty = computed(() => getDifficultyByLevel(levelNumber.value));

function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = TIME_LIMIT;
  timerInterval = setInterval(() => {
    timeLeft.value -= 0.1;
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      resetGame();
    }
  }, 100);
}

function resetGame() {
  clearInterval(timerInterval);
  score.value = 0;
  correctStreak.value = 0;
  generateGrid();
}

function generateGrid() {
  numbers.value = Array.from({ length: 9 }, () => Math.floor(Math.random() * 100));
  target.value = numbers.value[Math.floor(Math.random() * numbers.value.length)];
  startTimer();
}

function checkAnswer(selectedNumber) {
  if (selectedNumber === target.value) {
    score.value++;
    correctStreak.value++;
    if (correctStreak.value >= WINNING_STREAK) {
      onOpenGameVictoryDialog();
      return;
    }
    generateGrid();
  } else {
    resetGame();
  }
}

async function onOpenGameVictoryDialog() {
  // Сохраняем прогресс уровня
  completeLevel(levelNumber.value);
  
  const modal = await openModal(GameVictoryDialog, {
    score: score.value,
  })
  modal.on('finish', () => {
    modal.close();
    router.back();
  })
  modal.on('continue', () => {
    modal.close();
    levelNumber.value = levelNumber.value + 1;
    resetGame();
  })
  modal.on('restart', () => {
    modal.close();
    resetGame();
  })
}

onMounted(() => {
  resetGame();
});

onUnmounted(() => {
  resetGame();
});
</script>

<style scoped lang="scss">
.numbers-game {
  height: calc(100vh - 100px);
}

.target-text {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary);
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  width: calc(33% - 5px);
  aspect-ratio: 1/1;
  font-size: 24px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timer, .score {
  font-size: 18px;
}
</style>
