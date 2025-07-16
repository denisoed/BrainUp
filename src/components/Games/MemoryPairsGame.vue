<template>
  <div class="memory-pairs-game flex column items-center justify-center">

    <div class="stats">
      <div class="timer">⏳ {{ $t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
      <div class="score">🏆 {{ $t('games.score') }}: <span>{{ score }}/{{ WINNING_SCORE }}</span></div>
    </div>
    <ProgressBar :progress="(timeLeft / INITIAL_TIME) * 100" />

    <div class="cards-grid mb-md mt-md">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="memory-card"
        :class="{ 
          'memory-card--flipped': card.isFlipped || card.isMatched,
          'memory-card--matched': card.isMatched,
          'memory-card--error': showError && selectedCards.includes(index)
        }"
        @click="!card.isFlipped && !card.isMatched && selectCard(index)"
      >
        <div class="memory-card-inner">
          <div class="memory-card-front">❓</div>
          <div class="memory-card-back">{{ card.symbol }}</div>
        </div>
      </div>
    </div>

    <SuccessCounter :value="`${score}/${WINNING_SCORE}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import ProgressBar from '@/components/Games/ProgressBar.vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { openModal } from 'jenesius-vue-modal';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Card {
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const INITIAL_TIME = 60;
const WINNING_SCORE = 8; // 8 pairs to match

const timeLeft = ref(INITIAL_TIME);
const score = ref(0);
const isStarted = ref(false);
const showError = ref(false);

const cards = ref<Card[]>([]);
const selectedCards = ref<number[]>([]);

let timerInterval: ReturnType<typeof setInterval>;

const symbols = [
  '🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝',
  '🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝'
];

function shuffleArray(array: string[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function initializeCards() {
  const shuffledSymbols = shuffleArray(symbols);
  cards.value = shuffledSymbols.map(symbol => ({
    symbol,
    isFlipped: false,
    isMatched: false
  }));
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = INITIAL_TIME;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0.1) {
      timeLeft.value -= 0.1;
    }
    if (timeLeft.value <= 0.1) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 100);
}

function handleTimeout() {
  // Game over due to time out
  resetGame();
}

function selectCard(index: number) {
  // Prevent selecting more than 2 cards at once
  if (selectedCards.value.length >= 2) return;
  
  // Flip the card
  cards.value[index].isFlipped = true;
  selectedCards.value.push(index);
  
  // Check for a match if two cards are selected
  if (selectedCards.value.length === 2) {
    setTimeout(() => checkMatch(), 500);
  }
}

function checkMatch() {
  const [firstIndex, secondIndex] = selectedCards.value;
  const firstCard = cards.value[firstIndex];
  const secondCard = cards.value[secondIndex];
  
  if (firstCard.symbol === secondCard.symbol) {
    // Match found
    firstCard.isMatched = true;
    secondCard.isMatched = true;
    score.value++;
    
    // Check if all pairs are matched
    if (score.value >= WINNING_SCORE) {
      onOpenGameVictoryDialog();
    }
  } else {
    // No match
    showError.value = true;
    setTimeout(() => {
      firstCard.isFlipped = false;
      secondCard.isFlipped = false;
      showError.value = false;
    }, 500);
  }
  
  // Reset selected cards
  selectedCards.value = [];
}

async function onOpenGameVictoryDialog() {
  clearInterval(timerInterval);
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

function startGame() {
  isStarted.value = true;
  initializeCards();
  startTimer();
}

function resetGame() {
  isStarted.value = false;
  score.value = 0;
  selectedCards.value = [];
  clearInterval(timerInterval);
}

onMounted(() => {
  resetGame();
  startGame();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
.memory-pairs-game {
  width: 100%;
  height: 100%;
  padding: 1rem;
}

.stats {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
}

.timer, .score {
  font-size: 1.2rem;
  font-weight: bold;
}

.timer span, .score span {
  color: var(--primary-color);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

.memory-card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
}

.memory-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.memory-card--flipped .memory-card-inner {
  transform: rotateY(180deg);
}

.memory-card-front, .memory-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 2rem;
}

.memory-card-front {
  background-color: var(--card-bg-color, #2c3e50);
  color: white;
}

.memory-card-back {
  background-color: var(--primary-color, #42b983);
  color: white;
  transform: rotateY(180deg);
}

.memory-card--matched .memory-card-back {
  background-color: var(--success-color, #28a745);
}

.memory-card--error .memory-card-back {
  background-color: var(--error-color, #dc3545);
}
</style>
