<template>
  <div class="vocabulary-game flex column items-center justify-center">
    <div class="stats">
      <div class="timer">⏳ {{ $t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
      <div class="score">🏆 {{ $t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
    </div>
    <ProgressBar :progress="(timeLeft / TIME_LIMIT) * 100" />

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

    <div class="translation">{{ currentTranslation }}</div>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import ProgressBar from '@/components/Games/ProgressBar.vue';
import { middleVocabulary, type VocabularyItem } from '@/data/vocabulary';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { useRouter } from 'vue-router';
import {
  openModal
} from 'jenesius-vue-modal';

const { push } = useRouter();

const TIME_LIMIT = 5;
const WINNING_STREAK = 40;

// Game state
const timeLeft = ref(TIME_LIMIT);
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
  timeLeft.value = TIME_LIMIT;
  timerInterval = setInterval(() => {
    timeLeft.value -= 0.1;
    if (timeLeft.value <= 0) {
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
      if (score.value >= WINNING_STREAK) {
        onOpenGameVictoryDialog();
        return;
      }
      startNewRound();
    }, 1000);
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
  timeLeft.value = TIME_LIMIT;
}

async function onOpenGameVictoryDialog() {
  const modal = await openModal(GameVictoryDialog, {
    score: score.value,
  })
  modal.on('finish', () => {
    modal.close();
    push('/list');
  })
  modal.on('restart', () => {
    modal.close();
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
  TIME_LIMIT,
  WINNING_STREAK
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