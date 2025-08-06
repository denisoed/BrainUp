<template>
  <div class="grid-sequence-game flex column items-center justify-center">
    <GameHeader 
      :level="currentLevel"
      :difficulty="currentDifficulty"
      :time-left="timeLeft"
      :score="score"
      :winning-streak="WINNING_STREAK"
      :progress="(timeLeft / TIME_LIMIT) * 100"
    />

    <div 
      class="grid mb-md mt-md" 
      :style="{ 
        '--grid-rows': gridSize.rows,
        '--grid-cols': gridSize.cols
      }"
    >
      <div
        v-for="(number, index) in numbers"
        :key="index"
        class="cell"
        :class="{
          'cell--success': selectedNumbers.includes(number) && isCorrectSequence(number),
          'cell--error': selectedNumbers.includes(number) && !isCorrectSequence(number)
        }"
        @click="selectNumber(number)"
      >
        {{ number }}
        <span v-if="selectedNumbers.includes(number)" class="selection-order">
          {{ selectedNumbers.indexOf(number) + 1 }}
        </span>
      </div>
    </div>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import GameHeader from '@/components/Games/GameHeader.vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { openModal } from 'jenesius-vue-modal';
import { useRouter } from 'vue-router';
import { useGameProgress } from '@/composables/useGameProgress';

const router = useRouter();
const route = useRoute();

// Используем composable для управления прогрессом
const gameId = route.params.game;
const { currentLevel, completeLevel, currentDifficulty } = useGameProgress(gameId);

// Game state
const levelNumber = ref(route.query.level ? Number(route.query.level) : currentLevel.value);
const TIME_LIMIT = 15;
const WINNING_STREAK = 15;
const MIN_GRID_SIZE = { rows: 2, cols: 3 };

const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const gridSize = ref({ ...MIN_GRID_SIZE });
const numbers = ref<number[]>([]);
const selectedNumbers = ref<number[]>([]);
let timerInterval: ReturnType<typeof setInterval>;

// Вычисляем отсортированные числа для проверки правильной последовательности
const sortedNumbers = computed(() => [...numbers.value].sort((a, b) => a - b));

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

function generateGrid() {
  const totalCells = gridSize.value.rows * gridSize.value.cols;
  const newNumbers: number[] = [];
  
  // Генерируем уникальные числа для сетки
  while (newNumbers.length < totalCells) {
    const num = Math.floor(Math.random() * 99) + 1;
    if (!newNumbers.includes(num)) {
      newNumbers.push(num);
    }
  }
  
  numbers.value = newNumbers;
  selectedNumbers.value = [];
  startTimer();
}

function selectNumber(number: number) {
  if (selectedNumbers.value.includes(number)) {
    return;
  }

  selectedNumbers.value.push(number);
  
  // Проверяем правильность последовательности
  if (!isCorrectSequence(number)) {
    resetGame();
    return;
  }

  // Если все числа выбраны в правильном порядке
  if (selectedNumbers.value.length === numbers.value.length) {
    handleLevelComplete();
  }
}

function isCorrectSequence(number: number): boolean {
  const index = selectedNumbers.value.indexOf(number);
  return index === -1 || number === sortedNumbers.value[index];
}

function handleLevelComplete() {
  score.value++;
  if (score.value >= WINNING_STREAK) {
    onOpenGameVictoryDialog();
    return;
  }

  // Увеличиваем размер сетки каждые 3 уровня
  if (score.value % 3 === 0) {
    // Чередуем увеличение строк и столбцов
    if (score.value % 6 === 0) {
      gridSize.value.rows++;
    } else {
      gridSize.value.cols++;
    }
  }

  generateGrid();
}

function resetGame() {
  score.value = 0;
  gridSize.value = { ...MIN_GRID_SIZE };
  generateGrid();
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
  clearInterval(timerInterval);
});
</script>

<style scoped lang="scss">
.grid-sequence-game {
  height: calc(100vh - 100px);
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols), 1fr);
  grid-template-rows: repeat(var(--grid-rows), 1fr);
  gap: 8px;
  width: 100%;
  max-width: 600px;
}

.cell {
  aspect-ratio: 1/1;
  font-size: 24px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg);
  position: relative;
  transition: all 0.3s ease;

  &--success {
    border-color: rgba(75, 181, 67, 1);
    color: rgba(75, 181, 67, 1);
  }

  &--error {
    border-color: rgba(255, 107, 107, 1);
    color: rgba(255, 107, 107, 1);
  }
}

.selection-order {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  font-size: 24px;
  color: var(--primary);
  font-weight: bold;
}

.level-info {
  margin-top: 16px;
  font-size: 18px;
  color: var(--primary);
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