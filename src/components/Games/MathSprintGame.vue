<template>
  <div class="math-sprint-game flex column items-center justify-center">
    <div class="timer">⏳ {{ t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
    <div class="score">🏆 {{ t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
    <div class="buttons mb-lg mt-lg">
      <div
        v-for="(answer, index) in answers"
        :key="index"
        class="btn"
        @click="checkAnswer(answer)"
      >{{ answer }}</div>
    </div>
    <div class="current-text">{{ question }}</div>

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
const question = ref('');
const correctAnswer = ref(0);
const correctStreak = ref(0);
const answers = ref([]);
let timerInterval;

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
  generateQuestion();
}

function generateQuestion() {
  let num1 = Math.floor(Math.random() * 50) + 1;
  let num2 = Math.floor(Math.random() * num1) + 1;
  let isAddition = Math.random() > 0.5;
  correctAnswer.value = isAddition ? num1 + num2 : num1 - num2;
  question.value = `${num1} ${isAddition ? '+' : '-'} ${num2}`;
  let answersSet = new Set([correctAnswer.value]);
  while (answersSet.size < 6) {
    let randomAnswer = correctAnswer.value + Math.floor(Math.random() * 21) - 10;
    if (randomAnswer !== correctAnswer.value) {
      answersSet.add(randomAnswer);
    }
  }
  answers.value = [...answersSet].sort(() => Math.random() - 0.5);
  startTimer();
}

function checkAnswer(selectedAnswer) {
  if (selectedAnswer === correctAnswer.value) {
    score.value++;
    correctStreak.value++;
    if (correctStreak.value >= WINNING_STREAK) {
      return;
    }
    generateQuestion();
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
.math-sprint-game {
  height: calc(100vh - 100px);
}

.current-text {
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
