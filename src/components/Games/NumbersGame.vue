<template>
  <div class="numbers-game flex column items-center justify-center">
    <div class="timer">⏳ {{ t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
    <div class="score">🏆 {{ t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
    <div class="buttons mb-lg mt-lg">
      <div
        v-for="(number, index) in numbers"
        :key="index"
        class="btn"
        @click="checkAnswer(number)"
      >{{ number }}</div>
    </div>
    <div class="target-text">{{ target }}</div>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

import SuccessCounter from '@/components/Games/SuccessCounter.vue';

const { t } = useI18n();

const INITIAL_TIME = 3;
const WINNING_STREAK = 15;

const timeLeft = ref(INITIAL_TIME);
const score = ref(0);
const correctStreak = ref(0);
let timerInterval;

const target = ref(0);
const numbers = ref([]);

function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = INITIAL_TIME;
  timerInterval = setInterval(() => {
    timeLeft.value -= 0.1;
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      resetGame();
    }
  }, 100);
}

function resetGame() {
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
      return;
    }
    generateGrid();
  } else {
    resetGame();
  }
}

onMounted(() => {
  resetGame();
});

onUnmounted(() => {
  resetGame();
  clearInterval(timerInterval);
});
</script>

<style scoped lang="scss">
.numbers-game {
  height: calc(100vh - 100px);
}

.target-text {
  font-size: 56px;
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
  width: calc(33% - 8px);
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

.timer, .score {
  font-size: 18px;
  margin-top: 10px;
}
</style>
