<template>
  <div class="math-blocks-game flex column items-center justify-center">
    <div class="stats">
      <div class="timer">⏳ {{ $t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
      <div class="score">🏆 {{ $t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
    </div>
    <ProgressBar :progress="(timeLeft / TIME_LIMIT) * 100" />

    <div class="game-container">
      <div v-if="showError" class="error-message">
        Неправильный ответ!
      </div>
      <div class="blocks-container">
        <div
          v-for="(block, index) in fallingBlocks"
          :key="index"
          class="math-block"
          :class="{ 'clicked': block.isClicked }"
          :style="{
            left: `${block.x}%`,
            top: `${block.y}%`,
            backgroundColor: block.color
          }"
          @click="checkAnswer(block)"
        >
          {{ block.expression }} = {{ block.displayedAnswer }}
        </div>
      </div>
    </div>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import ProgressBar from '@/components/Games/ProgressBar.vue';

// Types
interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  expression: string;
  displayedAnswer: number;
  correctAnswer: number;
  color: string;
  isCorrect: boolean;
  isClicked: boolean;
}

// Constants
const TIME_LIMIT = 10;
const WINNING_STREAK = 20;
const BLOCKS_COUNT = 3;
const CORRECT_ANSWERS_COUNT = 2; // Всегда должно быть 2 правильных ответа
const BASE_FALL_SPEED = 0.2; // Базовая скорость падения
const INITIAL_BLOCK_COLOR = '#757575'; // Серый цвет для всех падающих блоков
const CORRECT_COLOR = '#4CAF50'; // Зеленый цвет для правильного ответа
const ERROR_COLOR = '#FF5252'; // Красный цвет для неправильного ответа
const BLOCK_WIDTH = 20;
const BLOCK_HEIGHT = 15;
const MIN_VERTICAL_GAP = 20;
const CONTAINER_WIDTH = 100;
const CONTAINER_HEIGHT = 100;
const TARGET_FPS = 120;
const FRAME_TIME = 1000 / TARGET_FPS;
const FEEDBACK_DURATION = 1000; // Время показа сообщения об ошибке в мс

// Game state
const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const isGameActive = ref(false);
const fallingBlocks = ref<Block[]>([]);
const lastFrameTime = ref(0);
const showError = ref(false);
const correctAnswersNeeded = ref(0);
const correctAnswersGiven = ref(0);

let animationFrameId: number;
let timerInterval: ReturnType<typeof setInterval>;
let errorTimeout: ReturnType<typeof setTimeout>;

// Generate random math expression
function generateMathExpression(isCorrect: boolean) {
  const operations = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1: number, num2: number, correctAnswer: number;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      correctAnswer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      correctAnswer = num1 - num2;
      break;
    default:
      num1 = 0;
      num2 = 0;
      correctAnswer = 0;
  }

  return {
    expression: `${num1} ${operation} ${num2}`,
    correctAnswer,
    displayedAnswer: isCorrect ? correctAnswer : correctAnswer + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1)
  };
}

// Check if two blocks overlap
function doBlocksOverlap(block1: Block, block2: Block): boolean {
  return !(
    block1.x + block1.width < block2.x ||
    block1.x > block2.x + block2.width ||
    block1.y + block1.height < block2.y ||
    block1.y > block2.y + block2.height
  );
}

// Find a valid position for a new block
function findValidPosition(blockIndex: number): { x: number, y: number } {
  // Разделим контейнер на секции по количеству блоков
  const sectionWidth = CONTAINER_WIDTH / BLOCKS_COUNT;
  
  // Вычисляем границы секции для текущего блока
  const sectionStart = sectionWidth * blockIndex;
  const sectionEnd = sectionStart + sectionWidth - BLOCK_WIDTH;
  
  // Случайная позиция X в пределах секции
  const x = sectionStart + Math.random() * (sectionEnd - sectionStart);
  
  // Случайная начальная высота над контейнером
  const y = -BLOCK_HEIGHT - Math.random() * MIN_VERTICAL_GAP;
  
  return { x, y };
}

// Initialize blocks
function initializeBlocks() {
  fallingBlocks.value = [];
  correctAnswersNeeded.value = CORRECT_ANSWERS_COUNT;
  correctAnswersGiven.value = 0;

  // Создаем массив индексов для случайного распределения блоков
  const indices = Array.from({ length: BLOCKS_COUNT }, (_, i) => i);
  // Перемешиваем индексы
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Создаем блоки с правильными ответами
  for (let i = 0; i < CORRECT_ANSWERS_COUNT; i++) {
    const block = createBlock(true, indices[i]);
    fallingBlocks.value.push(block);
  }

  // Создаем блоки с неправильными ответами
  for (let i = CORRECT_ANSWERS_COUNT; i < BLOCKS_COUNT; i++) {
    const block = createBlock(false, indices[i]);
    fallingBlocks.value.push(block);
  }
}

// Create new falling block
function createBlock(isCorrect: boolean, index: number): Block {
  const { expression, correctAnswer, displayedAnswer } = generateMathExpression(isCorrect);
  const position = findValidPosition(index);
  
  return {
    ...position,
    width: BLOCK_WIDTH,
    height: BLOCK_HEIGHT,
    expression,
    displayedAnswer,
    correctAnswer,
    color: INITIAL_BLOCK_COLOR,
    isCorrect,
    isClicked: false
  };
}

// Check answer when block is clicked
function checkAnswer(block: Block) {
  if (!isGameActive.value || block.isClicked) return;

  block.isClicked = true;

  if (block.displayedAnswer === block.correctAnswer) {
    block.color = CORRECT_COLOR; // Зеленый цвет для правильного ответа
    correctAnswersGiven.value++;

    // Проверяем, все ли правильные ответы даны
    if (correctAnswersGiven.value === correctAnswersNeeded.value) {
      score.value++;
      
      if (score.value >= WINNING_STREAK) {
        stopGame();
        return;
      }

      // Начинаем новый раунд, сохраняя очки
      setTimeout(() => resetGameAfterSuccess(), 500);
    }
  } else {
    block.color = ERROR_COLOR; // Красный цвет для неправильного ответа
    showError.value = true;
    correctAnswersGiven.value = 0;
    
    // Показываем все правильные ответы
    fallingBlocks.value.forEach(b => {
      if (b.isCorrect) {
        b.color = CORRECT_COLOR;
      }
    });
    
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }

    errorTimeout = setTimeout(() => {
      showError.value = false;
      resetGameAfterError(); // Сбрасываем игру с обнулением очков
    }, FEEDBACK_DURATION);
  }
}

// Update block positions
function updateBlocks() {
  let allBlocksAtBottom = true;

  fallingBlocks.value = fallingBlocks.value.map(block => {
    if (block.y >= CONTAINER_HEIGHT - block.height) {
      // Если правильный блок достиг дна и не был кликнут
      if (block.isCorrect && !block.isClicked) {
        block.color = ERROR_COLOR;
        showError.value = true;
        correctAnswersGiven.value = 0;
        
        // Показываем все правильные ответы
        fallingBlocks.value.forEach(b => {
          if (b.isCorrect) {
            b.color = CORRECT_COLOR;
          }
        });
        
        if (errorTimeout) {
          clearTimeout(errorTimeout);
        }
        
        errorTimeout = setTimeout(() => {
          showError.value = false;
          resetGameAfterError();
        }, FEEDBACK_DURATION);
      }
      return block;
    } else {
      allBlocksAtBottom = false;
      return { ...block, y: block.y + BASE_FALL_SPEED };
    }
  });

  if (allBlocksAtBottom) {
    resetGameAfterError();
  }
}

// Start game timer
function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = TIME_LIMIT;
  timerInterval = setInterval(() => {
    timeLeft.value -= 0.1;
    if (timeLeft.value <= 0) {
      showError.value = true;
      // Показываем все правильные ответы перед сбросом
      fallingBlocks.value.forEach(block => {
        if (block.isCorrect) {
          block.color = CORRECT_COLOR;
        }
      });
      
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
      
      errorTimeout = setTimeout(() => {
        showError.value = false;
        resetGameAfterError(); // Сбрасываем игру и очки когда время вышло
      }, FEEDBACK_DURATION);
    }
  }, 100);
}

// Game animation loop
function animate(currentTime: number) {
  if (!isGameActive.value) return;

  // Вычисляем время, прошедшее с последнего кадра
  const deltaTime = currentTime - lastFrameTime.value;

  // Проверяем, прошло ли достаточно времени для следующего кадра
  if (deltaTime >= FRAME_TIME) {
    // Обновляем время последнего кадра
    lastFrameTime.value = currentTime - (deltaTime % FRAME_TIME);
    
    // Обновляем позиции блоков
    updateBlocks();
  }

  animationFrameId = requestAnimationFrame(animate);
}

// Start game
function startGame() {
  isGameActive.value = true;
  initializeBlocks();
  startTimer();
  animate(0);
}

// Stop game
function stopGame() {
  isGameActive.value = false;
  clearInterval(timerInterval);
  cancelAnimationFrame(animationFrameId);
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }
  showError.value = false;
}

// Reset game after error
function resetGameAfterError() {
  stopGame();
  showError.value = false;
  score.value = 0; // Сбрасываем очки только при ошибке
  startGame();
}

// Reset game after correct answer
function resetGameAfterSuccess() {
  stopGame();
  showError.value = false;
  startGame();
}

// Lifecycle hooks
onMounted(() => {
  score.value = 0;
  startGame();
});

onUnmounted(() => {
  stopGame();
});
</script>

<style lang="scss" scoped>
.math-blocks-game {
  height: calc(100vh - 100px);
  position: relative;
  overflow: hidden;
}

.game-container {
  width: 100%;
  height: 50vh;
  position: relative;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 16px 0;
}

.blocks-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 82, 82, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 22px;
  line-height: normal;
  z-index: 10;
  text-align: center;
}

.math-block {
  position: absolute;
  padding: 8px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: var(--white-color);
  transition: transform 0.2s, background-color 0.3s;
  user-select: none;
  line-height: normal;

  &:hover {
    transform: scale(1.05);
  }

  &.clicked {
    cursor: default;
    &:hover {
      transform: none;
    }
  }
}

.stats {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timer,
.score {
  font-size: 18px;
}
</style> 