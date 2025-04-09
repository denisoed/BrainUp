<template>
  <div class="pattern-creator-game flex column items-center justify-center">
    <div class="stats">
      <div class="timer">⏳ {{ $t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
      <div class="score">🏆 {{ $t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
    </div>
    <ProgressBar :progress="(timeLeft / TIME_LIMIT) * 100" />

    <div class="game-container mt-md mb-md">
      <div v-if="gameState === 'pattern'" class="pattern-display">
        <div class="pattern-instruction mb-sm">{{ currentInstruction }}</div>
        <div 
          class="pattern-grid"
          :style="{
            'grid-template-columns': `repeat(${gridSize}, 1fr)`,
            'grid-template-rows': `repeat(${gridSize}, 1fr)`
          }"
        >
          <div 
            v-for="(cell, index) in patternCells"
            :key="`pattern-${index}`"
            class="pattern-cell"
            :class="{ 'pattern-cell--filled': cell === 1 }"
          ></div>
        </div>
      </div>

      <div v-else-if="gameState === 'create'" class="create-container">
        <div class="pattern-instruction mb-sm">{{ $t('games.patternCreator.recreate') }}</div>
        <div 
          class="pattern-grid"
          :style="{
            'grid-template-columns': `repeat(${gridSize}, 1fr)`,
            'grid-template-rows': `repeat(${gridSize}, 1fr)`
          }"
        >
          <div 
            v-for="(cell, index) in userPattern"
            :key="`user-${index}`"
            class="pattern-cell"
            :class="{ 'pattern-cell--filled': cell === 1, 'pattern-cell--error': showError }"
            @click="toggleCell(index)"
          ></div>
        </div>
      </div>

      <div v-if="gameState === 'create'" class="game-actions">
        <button 
          class="submit-btn"
          @click="checkPattern"
        >
          {{ $t('games.patternCreator.check') }}
        </button>
      </div>
    </div>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import ProgressBar from '@/components/Games/ProgressBar.vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { openModal } from 'jenesius-vue-modal';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

// Game constants
const TIME_LIMIT = 30;
const WINNING_STREAK = 15;
const MIN_GRID_SIZE = 4;
const MAX_GRID_SIZE = 6;

// Game state
const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const gridSize = ref(MIN_GRID_SIZE);
const patternCells = ref<number[]>([]);
const userPattern = ref<number[]>([]);
const gameState = ref<'pattern' | 'create'>('pattern');
const showError = ref(false);
const level = ref(1);
const currentRuleIndex = ref(0);

// Timer
let timerInterval: ReturnType<typeof setInterval>;

// Pattern generation rules
const patternRules = [
  'games.patternCreator.rules.symmetry',
  'games.patternCreator.rules.diagonal',
  'games.patternCreator.rules.spiral',
  'games.patternCreator.rules.checkerboard',
  'games.patternCreator.rules.border'
];

// Get current instruction based on rule
const currentInstruction = computed(() => {
  return t(patternRules[currentRuleIndex.value]);
});

// Initialize the pattern and user cells based on grid size
function initializeGrid() {
  const size = gridSize.value;
  const totalCells = size * size;
  patternCells.value = Array(totalCells).fill(0);
  userPattern.value = Array(totalCells).fill(0);
}

// Generate pattern based on current rule
function generatePattern() {
  initializeGrid();
  const size = gridSize.value;
  const totalCells = size * size;
  
  // Reset pattern
  patternCells.value = Array(totalCells).fill(0);
  
  switch (currentRuleIndex.value) {
    case 0: // Symmetry pattern
      generateSymmetryPattern();
      break;
    case 1: // Diagonal pattern
      generateDiagonalPattern();
      break;
    case 2: // Spiral pattern
      generateSpiralPattern();
      break;
    case 3: // Checkerboard pattern with variations
      generateCheckerboardPattern();
      break;
    case 4: // Border pattern
      generateBorderPattern();
      break;
    default:
      generateRandomPattern();
  }
}

// Pattern generation methods
function generateSymmetryPattern() {
  const size = gridSize.value;
  // Fill left half randomly
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < Math.floor(size / 2); col++) {
      const index = row * size + col;
      const value = Math.random() > 0.5 ? 1 : 0;
      patternCells.value[index] = value;
      
      // Mirror to right half
      const mirrorCol = size - 1 - col;
      const mirrorIndex = row * size + mirrorCol;
      patternCells.value[mirrorIndex] = value;
    }
  }
  
  // Handle center column for odd sizes
  if (size % 2 !== 0) {
    const centerCol = Math.floor(size / 2);
    for (let row = 0; row < size; row++) {
      const index = row * size + centerCol;
      patternCells.value[index] = Math.random() > 0.5 ? 1 : 0;
    }
  }
}

function generateDiagonalPattern() {
  const size = gridSize.value;
  // Create diagonal lines
  for (let i = 0; i < size; i++) {
    // Main diagonal
    patternCells.value[i * size + i] = 1;
    // Counter diagonal
    patternCells.value[i * size + (size - 1 - i)] = 1;
    
    // Additional diagonal elements (randomly)
    if (Math.random() > 0.6) {
      const offset = Math.floor(Math.random() * (size - 2)) + 1;
      if (i + offset < size) {
        patternCells.value[i * size + (i + offset)] = 1;
      }
      if (i - offset >= 0) {
        patternCells.value[i * size + (i - offset)] = 1;
      }
    }
  }
}

function generateSpiralPattern() {
  const size = gridSize.value;
  let rowStart = 0, rowEnd = size - 1;
  let colStart = 0, colEnd = size - 1;
  
  while (rowStart <= rowEnd && colStart <= colEnd) {
    // Fill top row
    for (let col = colStart; col <= colEnd; col++) {
      patternCells.value[rowStart * size + col] = 1;
    }
    rowStart++;
    
    // Fill rightmost column
    for (let row = rowStart; row <= rowEnd; row++) {
      patternCells.value[row * size + colEnd] = 1;
    }
    colEnd--;
    
    // Fill bottom row
    if (rowStart <= rowEnd) {
      for (let col = colEnd; col >= colStart; col--) {
        patternCells.value[rowEnd * size + col] = 1;
      }
      rowEnd--;
    }
    
    // Fill leftmost column
    if (colStart <= colEnd) {
      for (let row = rowEnd; row >= rowStart; row--) {
        patternCells.value[row * size + colStart] = 1;
      }
      colStart++;
    }
    
    // Skip some cells (to make it look like a spiral, not a full square)
    if (Math.random() > 0.5) {
      break;
    }
  }
}

function generateCheckerboardPattern() {
  const size = gridSize.value;
  // Basic checkerboard
  const offset = Math.random() > 0.5 ? 0 : 1; // Random start with 0 or 1
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if ((row + col) % 2 === offset) {
        patternCells.value[row * size + col] = 1;
      }
    }
  }
  
  // Add random variations to make it more interesting
  const variations = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < variations; i++) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    patternCells.value[row * size + col] = patternCells.value[row * size + col] === 1 ? 0 : 1;
  }
}

function generateBorderPattern() {
  const size = gridSize.value;
  
  // Fill border
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (row === 0 || row === size - 1 || col === 0 || col === size - 1) {
        patternCells.value[row * size + col] = 1;
      }
    }
  }
  
  // Add some interior elements
  const interiorElements = Math.floor(Math.random() * (size * size / 4)) + 1;
  for (let i = 0; i < interiorElements; i++) {
    const row = Math.floor(Math.random() * (size - 2)) + 1;
    const col = Math.floor(Math.random() * (size - 2)) + 1;
    patternCells.value[row * size + col] = 1;
  }
}

function generateRandomPattern() {
  const size = gridSize.value;
  const totalCells = size * size;
  
  // Fill approximately 40-60% of cells
  const fillRatio = 0.4 + Math.random() * 0.2;
  const cellsToFill = Math.floor(totalCells * fillRatio);
  
  for (let i = 0; i < cellsToFill; i++) {
    const index = Math.floor(Math.random() * totalCells);
    patternCells.value[index] = 1;
  }
}

// Toggle cell state when user clicks
function toggleCell(index: number) {
  if (gameState.value !== 'create') return;
  userPattern.value[index] = userPattern.value[index] === 1 ? 0 : 1;
}

// Check if user pattern matches the target pattern
function checkPattern() {
  const isCorrect = patternCells.value.every((cell, index) => cell === userPattern.value[index]);
  
  if (isCorrect) {
    score.value++;
    if (score.value >= WINNING_STREAK) {
      onOpenGameVictoryDialog();
      return;
    }
    nextLevel();
  } else {
    showError.value = true;
    score.value = 0;
    setTimeout(() => {
      showError.value = false;
      resetGame();
    }, 1000);
  }
}

// Start the game timer
function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = TIME_LIMIT;
  timerInterval = setInterval(() => {
    timeLeft.value -= 0.1;
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      timeOut();
    }
  }, 100);
}

// Handle time out
function timeOut() {
  showError.value = true;
  score.value = 0;
  setTimeout(() => {
    showError.value = false;
    resetGame();
  }, 1000);
}

// Move to next level
function nextLevel() {
  level.value++;
  
  // Increase grid size every 3 levels
  if (level.value % 3 === 0 && gridSize.value < MAX_GRID_SIZE) {
    gridSize.value++;
  }
  
  // Change rule type every 2 levels
  if (level.value % 2 === 0) {
    currentRuleIndex.value = (currentRuleIndex.value + 1) % patternRules.length;
  }
  
  startNewRound();
}

// Start a new round
function startNewRound() {
  gameState.value = 'pattern';
  generatePattern();
  userPattern.value = Array(gridSize.value * gridSize.value).fill(0);
  startTimer();
  
  // Show pattern for a few seconds, then let user create
  setTimeout(() => {
    gameState.value = 'create';
  }, 5000);
}

// Reset the game
function resetGame() {
  clearInterval(timerInterval);
  level.value = 1;
  score.value = 0;
  gridSize.value = MIN_GRID_SIZE;
  currentRuleIndex.value = 0;
  startNewRound();
}

// Open victory dialog
async function onOpenGameVictoryDialog() {
  const modal = await openModal(GameVictoryDialog, {
    score: score.value,
  });
  modal.on('finish', () => {
    modal.close();
    router.back();
  });
  modal.on('restart', () => {
    modal.close();
    resetGame();
  });
}

// Lifecycle hooks
onMounted(() => {
  resetGame();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped lang="scss">
.pattern-creator-game {
  height: calc(100vh - 100px);
}

.game-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
}

.pattern-instruction {
  font-size: 18px;
  color: var(--primary);
  text-align: center;
  width: 100%;
}

.pattern-grid {
  display: grid;
  gap: 4px;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1/1;
}

.pattern-cell {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  aspect-ratio: 1/1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &--filled {
    background-color: var(--primary);
  }

  &--error {
    background-color: rgba(255, 107, 107, 0.6);
  }
}

.game-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.submit-btn {
  padding: 12px 24px;
  background: var(--primary);
  color: var(--dark-color);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
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

</style>
