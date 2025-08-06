<template>
  <div class="vocabulary-game flex column items-center justify-center">
    <GameHeader 
      :level="levelNumber"
      :difficulty="currentDifficulty"
      :time-left="timeLeft"
      :score="score"
      :winning-streak="winningStreak"
      :progress="(timeLeft / timeLimit) * 100"
    />

    <div class="translation">{{ currentTranslation }}</div>

    <div class="cards mb-md mt-md">
      <div
        v-for="(word, index) in displayWords"
        :key="index"
        class="card"
        :class="{
          'card--success': showResults && word === correctWord,
          'card--error': showResults && word === selectedWord && word !== correctWord
        }"
        @click="checkAnswer(word)"
      >
        {{ word }}
      </div>
    </div>

    <SuccessCounter :score="score" :winning-streak="winningStreak" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import GameHeader from '@/components/Games/GameHeader.vue';
import { middleVocabulary, type VocabularyItem } from '@/data/vocabulary';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { useRoute, useRouter } from 'vue-router';
import {
  openModal
} from 'jenesius-vue-modal';
import { levels } from '@/data/vocabulary/index';
import { useGameProgress } from '@/composables/useGameProgress';

const router = useRouter();
const route = useRoute();

// Используем новый composable для управления прогрессом
const gameId = route.params.game;
const { currentLevel, completeLevel, getDifficultyByLevel } = useGameProgress(gameId);

// Game state
const levelNumber = ref(route.query.level ? Number(route.query.level) : currentLevel.value);
const timeLimit = ref(levels[levelNumber.value]?.timeLimit || 5);
const winningStreak = ref(levels[levelNumber.value]?.winningStreak || 1);
const timeLeft = ref(timeLimit.value);
const score = ref(0);
const isStarted = ref(false);
const showResults = ref(false);
const selectedWord = ref('');
const correctWord = ref('');
const currentTranslation = ref('');
const displayWords = ref<string[]>([]);

let timerInterval: ReturnType<typeof setInterval> | null = null;

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateWords() {
  // Get random words
  const shuffledWords = shuffleArray<VocabularyItem>(middleVocabulary);
  const selectedWords = shuffledWords.slice(0, 4);
  
  // Select one word as correct answer
  const correctPair = selectedWords[0];
  correctWord.value = correctPair.en;
  currentTranslation.value = correctPair.ru;
  
  // Display only English words in random order
  displayWords.value = shuffleArray(selectedWords.map(word => word.en));
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timeLeft.value = timeLimit.value;
  timerInterval = setInterval(() => {
    timeLeft.value -= 0.1;
    if (timeLeft.value <= 0) {
      timeLeft.value = 0;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      handleTimeout();
    }
  }, 100);
}

function handleTimeout() {
  showResults.value = true;
  score.value = 0;
  setTimeout(() => {
    startNewRound();
  }, 1000);
}

function checkAnswer(word: string) {
  if (showResults.value) return;
  
  selectedWord.value = word;
  showResults.value = true;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (word === correctWord.value) {
    score.value++;
    setTimeout(() => {
      if (score.value >= winningStreak.value) {
        // Используем новую систему прогресса
        completeLevel(levelNumber.value);
        onOpenGameVictoryDialog();
        return;
      }
      startNewRound();
    }, 500);
  } else {
    score.value = 0;
    setTimeout(() => {
      startNewRound();
    }, 1500);
  }
}

function startNewRound() {
  selectedWord.value = '';
  showResults.value = false;
  generateWords();
  startTimer();
}

function startGame() {
  isStarted.value = true;
  score.value = 0;
  startNewRound();
}

function resetGame() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isStarted.value = false;
  score.value = 0;
  showResults.value = false;
  timeLeft.value = timeLimit.value;
}

async function onOpenGameVictoryDialog() {
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
    timeLimit.value = levels[levelNumber.value]?.timeLimit || 5;
    winningStreak.value = levels[levelNumber.value]?.winningStreak || 1;
    resetGame();
    startGame();
  })
}

onMounted(() => {
  resetGame();
  startGame();
});

onUnmounted(() => {
  resetGame();
});

// Определяем сложность на основе текущего уровня
const currentDifficulty = computed(() => getDifficultyByLevel(levelNumber.value));

// Expose for testing
defineExpose({
  timeLeft,
  score,
  isStarted,
  showResults,
  selectedWord,
  correctWord,
  currentTranslation,
  displayWords,
  startNewRound,
  checkAnswer,
  resetGame,
  timeLimit,
  winningStreak,
  levelNumber,
  currentLevel
});
</script>

<style scoped lang="scss">
.vocabulary-game {
  height: calc(100vh - 100px);
}

.cards {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.card {
  width: 100%;
  font-size: 20px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg);
  transition: all 0.3s ease;
  padding: 10px;

  &--success {
    border-color: rgba(75, 181, 67, 1);
    color: rgba(75, 181, 67, 1);
  }

  &--error {
    border-color: rgba(255, 107, 107, 1);
    color: rgba(255, 107, 107, 1);
  }
}

.translation {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary);
  margin: 20px 0;
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