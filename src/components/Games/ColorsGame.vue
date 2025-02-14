<template>
  <div class="colors-game flex column items-center justify-center">
    <div class="timer">⏳ {{ t('games.colors.time') }}: <span>{{ timeLeft.toFixed(1) }}</span> {{ t('games.colors.time') }}</div>
    <div class="score">🏆 {{ t('games.colors.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
    <div class="buttons mb-lg mt-lg">
      <div
        v-for="color in shuffledColors"
        :key="color.name"
        class="btn"
        :style="{ backgroundColor: color.color }"
        @click="checkAnswer(color.color)"
      />
    </div>
    <div class="color-text" :style="{ color: currentTextColor }">{{ currentWord }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const INITIAL_TIME = 1;
const WINNING_STREAK = 10;
const colors = [
  { name: t('games.colors.listColors.red'), color: 'red' },
  { name: t('games.colors.listColors.blue'), color: 'blue' },
  { name: t('games.colors.listColors.green'), color: 'green' },
  { name: t('games.colors.listColors.yellow'), color: 'yellow' },
  { name: t('games.colors.listColors.purple'), color: 'purple' },
  { name: t('games.colors.listColors.orange'), color: 'orange' },
  { name: t('games.colors.listColors.pink'), color: 'pink' },
  { name: t('games.colors.listColors.white'), color: 'white' },
  { name: t('games.colors.listColors.gray'), color: 'gray' },
];

const timeLeft = ref(INITIAL_TIME);
const score = ref(0);
const correctStreak = ref(0);
let timerInterval;

const currentWordObj = ref(getRandomColor());
const currentTextColorObj = ref(getRandomColor());

const currentWord = computed(() => currentWordObj.value.name);
const currentTextColor = computed(() => currentTextColorObj.value.color);
const shuffledColors = computed(() => [...colors].sort(() => Math.random() - 0.5));

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

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
  generateColorTask();
}

function generateColorTask() {
  currentWordObj.value = getRandomColor();
  currentTextColorObj.value = getRandomColor();
  startTimer();
}

function checkAnswer(selectedColor) {
  if (selectedColor === currentTextColor.value) {
    score.value++;
    correctStreak.value++;
    if (correctStreak.value >= WINNING_STREAK) {
      return;
    }
    generateColorTask();
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
.colors-game {
  height: calc(100vh - 100px);
}

.color-text {
  font-size: 36px;
  font-weight: bold;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  min-width: 80px;
  height: 50px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  color: var(--white-color);
}

.timer, .score {
  font-size: 18px;
  margin-top: 10px;
}
</style>
