<template>
  <div class="minesweeper-game flex column items-center justify-center">
    <div class="score">🏆 {{ t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>

    <div class="game-board mt-lg mb-lg">
      <div class="grid">
        <div 
          v-for="(row, rowIndex) in board" 
          :key="rowIndex" 
          class="row"
        >
          <div 
            v-for="(cell, colIndex) in row" 
            :key="colIndex"
            class="cell"
            :class="{
              'revealed': cell.isRevealed,
              'mine': cell.isMine && cell.isRevealed,
              'flagged': cell.isFlagged,
              [`nearby-${cell.nearbyMines}`]: cell.isRevealed && cell.nearbyMines > 0
            }"
            @click="revealCell(rowIndex, colIndex)"
            @contextmenu.prevent="toggleFlag(rowIndex, colIndex)"
          >
            <template v-if="cell.isRevealed">
              <span v-if="cell.isMine">💣</span>
              <span v-else-if="cell.nearbyMines > 0">{{ cell.nearbyMines }}</span>
            </template>
            <span v-else-if="cell.isFlagged">🚩</span>
          </div>
        </div>
      </div>
    </div>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';

const { t } = useI18n();

const BOARD_SIZE = 8;
const MINES_COUNT = 10;
const WINNING_STREAK = 15;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  nearbyMines: number;
}

const score = ref(0);
const board = ref<Cell[][]>([]);
const isGameStarted = ref(false);
const remainingCells = ref(0);

function createBoard(): Cell[][] {
  const newBoard: Cell[][] = Array(BOARD_SIZE).fill(null).map(() =>
    Array(BOARD_SIZE).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      nearbyMines: 0
    }))
  );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < MINES_COUNT) {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);
    if (!newBoard[row][col].isMine) {
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate nearby mines
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!newBoard[row][col].isMine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < BOARD_SIZE && 
                col + j >= 0 && col + j < BOARD_SIZE &&
                newBoard[row + i][col + j].isMine) {
              count++;
            }
          }
        }
        newBoard[row][col].nearbyMines = count;
      }
    }
  }

  return newBoard;
}

function revealCell(row: number, col: number) {
  if (!isGameStarted.value || board.value[row][col].isFlagged) return;

  const cell = board.value[row][col];
  if (cell.isRevealed) return;

  cell.isRevealed = true;
  remainingCells.value--;

  if (cell.isMine) {
    handleGameOver(false);
    return;
  }

  if (cell.nearbyMines === 0) {
    revealAdjacentCells(row, col);
  }

  checkWinCondition();
}

function revealAdjacentCells(row: number, col: number) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (row + i >= 0 && row + i < BOARD_SIZE && 
          col + j >= 0 && col + j < BOARD_SIZE) {
        const adjacentCell = board.value[row + i][col + j];
        if (!adjacentCell.isRevealed && !adjacentCell.isFlagged) {
          revealCell(row + i, col + j);
        }
      }
    }
  }
}

function toggleFlag(row: number, col: number) {
  if (!isGameStarted.value) return;
  
  const cell = board.value[row][col];
  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged;
  }
}

function checkWinCondition() {
  if (remainingCells.value === MINES_COUNT) {
    handleGameOver(true);
  }
}

function handleGameOver(won: boolean) {
  if (won) {
    score.value++;
    if (score.value < WINNING_STREAK) {
      setTimeout(startGame, 1000);
    }
  } else {
    // Reveal all mines
    board.value.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      });
    });
    score.value = 0;
    setTimeout(() => {
      startGame();
    }, 2000);
  }
}

function startGame() {
  board.value = createBoard();
  remainingCells.value = BOARD_SIZE * BOARD_SIZE - MINES_COUNT;
  isGameStarted.value = true;
}

onMounted(() => {
  startGame();
});
</script>

<style scoped lang="scss">
.minesweeper-game {
  height: calc(100vh - 100px);
  padding: 20px;
}

.game-board {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row {
  display: flex;
  gap: 4px;
}

.cell {
  aspect-ratio: 1;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &.revealed {
    background: rgba(255, 255, 255, 0.05);
  }

  &.mine {
    background: rgba(255, 107, 107, 0.3);
  }

  &.nearby-1 { color: #45B7D1; }
  &.nearby-2 { color: #4ECDC4; }
  &.nearby-3 { color: #FFD93D; }
  &.nearby-4 { color: #FF6B6B; }
  &.nearby-5 { color: #FF8E3C; }
  &.nearby-6 { color: #FF5733; }
  &.nearby-7 { color: #C70039; }
  &.nearby-8 { color: #900C3F; }
}

.score {
  font-size: 18px;
  margin-top: 10px;
}
</style> 