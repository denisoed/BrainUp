<template>
  <div class="colors-game flex column items-center justify-center">
    <GameHeader 
      :level="levelNumber"
      :difficulty="currentDifficulty"
      :time-left="timeLeft"
      :score="score"
      :winning-streak="WINNING_STREAK"
      :progress="(timeLeft / TIME_LIMIT) * 100"
    />

    <div class="color-text" :style="{ color: currentTextColor }">{{ currentWord }}</div>

    <div class="buttons mb-md mt-md">
      <div
        v-for="color in randomColors"
        :key="color.name"
        class="btn"
        :style="{ backgroundColor: color.color }"
        @click="checkAnswer(color.color)"
      />
    </div>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import GameHeader from '@/components/Games/GameHeader.vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { openModal } from 'jenesius-vue-modal';
import { useI18n } from 'vue-i18n';
import { useGameProgress } from '@/composables/useGameProgress';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// Используем composable для управления прогрессом
const gameId = route.params.game;
const { currentLevel, completeLevel, currentDifficulty } = useGameProgress(gameId);

// Game state
const levelNumber = ref(route.query.level ? Number(route.query.level) : currentLevel.value);

const TIME_LIMIT = 1;
const WINNING_STREAK = 15;

const colors = ref([
  { name: t('games.colors.listColors.red'), color: 'red' },
  { name: t('games.colors.listColors.blue'), color: 'blue' },
  { name: t('games.colors.listColors.green'), color: 'green' },
  { name: t('games.colors.listColors.yellow'), color: 'yellow' },
  { name: t('games.colors.listColors.purple'), color: 'purple' },
  { name: t('games.colors.listColors.orange'), color: 'orange' },
  { name: t('games.colors.listColors.pink'), color: 'pink' },
  { name: t('games.colors.listColors.white'), color: 'white' },
  { name: t('games.colors.listColors.gray'), color: 'gray' },
]);

const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const correctStreak = ref(0);
let timerInterval;

const currentWordObj = ref(getRandomColor());
const currentTextColorObj = ref(getRandomColor());
const randomColors = ref<{ name: string; color: string; }[]>([]);

const currentWord = computed(() => currentWordObj.value.name);
const currentTextColor = computed(() => currentTextColorObj.value.color);

function getRandomColor() {
  return colors.value[Math.floor(Math.random() * colors.value.length)];
}

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
  score.value = 0;
  correctStreak.value = 0;
  generateColorTask();
}

function generateColorTask() {
  currentWordObj.value = getRandomColor();
  currentTextColorObj.value = getRandomColor();
  randomColors.value = [...colors.value].sort(() => Math.random() - 0.5);
  startTimer();
}

function checkAnswer(selectedColor) {
  if (selectedColor === currentTextColor.value) {
    score.value++;
    correctStreak.value++;
    if (correctStreak.value >= WINNING_STREAK) {
      onOpenGameVictoryDialog();
      return;
    }
    generateColorTask();
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
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  width: calc(33% - 5px);
  aspect-ratio: 1/1;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  color: var(--white-color);
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
