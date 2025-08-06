<template>
  <div class="sequence-game flex column items-center justify-center">
    
    <template v-if="isStarted">
      <GameHeader 
        :level="levelNumber"
        :difficulty="currentDifficulty"
        :time-left="timeLeft"
        :score="score"
        :winning-streak="WINNING_STREAK"
        :progress="(timeLeft / INITIAL_TIME) * 100"
      />
    </template>

    <template v-if="isStarted">
      <div class="cards mb-md mt-md">
        <div
          v-for="(card, index) in displayCards"
          :key="index"
          class="card"
          :class="{ 
            'card--memorize': isShowingSequence,
            'card--selected': !isShowingSequence && selectedCards.includes(card),
            'card--success': showSuccess,
            'card--error': showError
          }"
          @click="!isShowingSequence && selectCard(card)"
        >
          {{ card }}
          <span 
            v-if="!isShowingSequence && getSelectionOrder(card)" 
            class="card-order"
          >
            {{ getSelectionOrder(card) }}
          </span>
        </div>
      </div>

      <div class="sequence-status sequence-status--memorize" v-if="isShowingSequence">
        {{ $t('games.sequence.memorize') }}
      </div>
      <div class="sequence-status sequence-status--reproduce" v-else>
        {{ $t('games.sequence.reproduce') }}
      </div>
    </template>
    <template v-else>
      <div class="sequence-title mt-lg mb-lg">
        {{ $t('games.sequence.title') }}
      </div>
      <button 
        class="start-button"
        @click="startGame"
      >
        {{ $t('games.sequence.about.btn') }}
      </button>
    </template>

    <SuccessCounter :score="score" :winning-streak="WINNING_STREAK" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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
const { currentLevel, completeLevel, currentDifficulty } = useGameProgress(gameId);

// Game state
const levelNumber = ref(route.query.level ? Number(route.query.level) : currentLevel.value);

const INITIAL_TIME = 4;
const WINNING_STREAK = 10;
const SHOW_SEQUENCE_TIME = 4;

const timeLeft = ref(INITIAL_TIME);
const score = ref(0);
const isStarted = ref(false);
const isShowingSequence = ref(true);
const selectedCards = ref<string[]>([]);
const originalSequence = ref<string[]>([]);
const displayCards = ref<string[]>([]);
const showSuccess = ref(false);
const showError = ref(false);

let timerInterval: ReturnType<typeof setInterval>;
let memorizeTimeout: ReturnType<typeof setTimeout>;

const availableCards = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝'];

function shuffleArray(array: string[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateSequence() {
  const shuffled = shuffleArray(availableCards);
  return shuffled.slice(0, 6);
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
  showError.value = true;
  score.value = 0;
  setTimeout(() => {
    showError.value = false;
    startNewRound();
  }, 500);
}

function getSelectionOrder(card: string): number | null {
  const index = selectedCards.value.indexOf(card);
  return index === -1 ? null : index + 1;
}

function selectCard(card: string) {
  if (selectedCards.value.includes(card)) {
    // Удаляем карту и все карты после неё
    const index = selectedCards.value.indexOf(card);
    selectedCards.value = selectedCards.value.slice(0, index);
  } else if (selectedCards.value.length < originalSequence.value.length) {
    selectedCards.value.push(card);
  }

  if (selectedCards.value.length === originalSequence.value.length) {
    checkSequence();
  }
}

function checkSequence() {
  const isCorrect = selectedCards.value.join('') === displayCards.value.join('');
  
  if (isCorrect) {
    showSuccess.value = true;
    score.value++;
    
    if (score.value >= WINNING_STREAK) {
      onOpenGameVictoryDialog();
      return;
    }

    setTimeout(() => {
      showSuccess.value = false;
      startNewRound();
    }, 500);
  } else {
    showError.value = true;
    score.value = 0;
    setTimeout(() => {
      showError.value = false;
      startNewRound();
    }, 500);
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

function startNewRound() {
  isShowingSequence.value = true;
  selectedCards.value = [];
  originalSequence.value = generateSequence();
  displayCards.value = [...originalSequence.value];
  timeLeft.value = SHOW_SEQUENCE_TIME;

  // Запускаем таймер для фазы запоминания
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0.1) {
      timeLeft.value -= 0.1;
    }
  }, 100);

  clearTimeout(memorizeTimeout);
  memorizeTimeout = setTimeout(() => {
    isShowingSequence.value = false;
    displayCards.value = shuffleArray([...originalSequence.value]);
    startTimer();
  }, SHOW_SEQUENCE_TIME * 1000);
}

function startGame() {
  isStarted.value = true;
  isShowingSequence.value = true;
  selectedCards.value = [];
  originalSequence.value = generateSequence();
  displayCards.value = [...originalSequence.value];
  timeLeft.value = SHOW_SEQUENCE_TIME;
  
  // Запускаем таймер для фазы запоминания
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0.1) {
      timeLeft.value -= 0.1;
    }
  }, 100);

  clearTimeout(memorizeTimeout);
  memorizeTimeout = setTimeout(() => {
    isShowingSequence.value = false;
    displayCards.value = shuffleArray([...originalSequence.value]);
    startTimer();
  }, SHOW_SEQUENCE_TIME * 1000);
}

function resetGame() {
  clearInterval(timerInterval);
  clearTimeout(memorizeTimeout);
  isStarted.value = false;
  isShowingSequence.value = true;
  score.value = 0;
  showSuccess.value = false;
  showError.value = false;
  selectedCards.value = [];
  displayCards.value = [];
  timeLeft.value = INITIAL_TIME;
}

onMounted(() => {
  resetGame();
});

onUnmounted(() => {
  resetGame();
});
</script>

<style scoped lang="scss">
.sequence-game {
  height: calc(100vh - 100px);
}

.sequence-title {
  font-size: 24px;
  text-align: center;
  line-height: 1.4;
  background: var(--card-bg);
  border-radius: 12px;
}

.cards {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.card {
  position: relative;
  width: calc(33% - 5px);
  aspect-ratio: 1/1;
  font-size: 24px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg);
  transition: all 0.3s ease;

  // Стиль для фазы запоминания
  &--memorize {
    background-color: var(--dark-color);
  }

  // Стиль для выбранных карточек
  &--selected {
    background-color: var(--dark-color);
  }

  &-order {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    font-size: 24px;
    color: var(--primary);
    font-weight: bold;
  }

  &--success {
    border-color: rgba(75, 181, 67, 1);
    color: rgba(75, 181, 67, 1);
  }

  &--error {
    border-color: rgba(255, 107, 107, 1);
    color: rgba(255, 107, 107, 1);
  }
}

.sequence-status {
  text-align: center;
  font-size: 24px;
  color: var(--primary);
  margin-top: 20px;

  &--reproduce {
    color: rgba(255, 107, 107, 1);
  }
  
  &--memorize {
    color: var(--yellow-color);
  }
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

.start-button {
  display: block;
  margin: 20px auto;
  padding: 15px 30px;
  font-size: 1.2em;
  background: var(--primary);
  color: var(--dark-color);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
}
</style> 