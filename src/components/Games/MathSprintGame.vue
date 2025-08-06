<template>
  <div class="math-sprint-game flex column items-center justify-center">
    <GameHeader 
      :level="currentLevel"
      :difficulty="currentDifficulty"
      :time-left="timeLeft"
      :score="score"
      :winning-streak="WINNING_STREAK"
    />
    <ProgressBar :progress="(timeLeft / TIME_LIMIT) * 100" />
    <div class="buttons mb-md mt-md">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import ProgressBar from '@/components/Games/ProgressBar.vue';
import GameHeader from '@/components/Games/GameHeader.vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { openModal } from 'jenesius-vue-modal';
import { useRouter } from 'vue-router';
import { useGameProgress } from '@/composables/useGameProgress';

const router = useRouter();
const route = useRoute();

// Используем composable для управления прогрессом
const gameId = route.params.game;
const { currentLevel, getDifficultyByLevel } = useGameProgress(gameId);

const TIME_LIMIT = 3;
const WINNING_STREAK = 15;

const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const question = ref('');
const correctAnswer = ref(0);
const correctStreak = ref(0);
const answers = ref([]);
let timerInterval;

// Определяем сложность на основе текущего уровня
const currentDifficulty = computed(() => getDifficultyByLevel(currentLevel.value));

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
  timeLeft.value = TIME_LIMIT;
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
      onOpenGameVictoryDialog();
      return;
    }
    timeLeft.value = TIME_LIMIT;
    generateQuestion();
  } else {
    resetGame();
  }
}

async function onOpenGameVictoryDialog() {
  const modal = await openModal(GameVictoryDialog, {
    score: score.value,
  })
  modal.on('finish', () => {
    modal.close();
    router.back();
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
  timeLeft.value = TIME_LIMIT;
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
