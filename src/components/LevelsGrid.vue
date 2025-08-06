<template>
  <section class="game-preview__levels mb-md">
    <!-- Селектор сложности -->
    <div class="difficulty-selector mb-md">
      <h3>{{ $t('games.difficulty.title') }}</h3>
      <div class="difficulty-buttons">
        <button
          v-for="difficulty in difficulties"
          :key="difficulty.value"
          class="difficulty-btn"
          :class="{
            'difficulty-btn--active': currentDifficulty === difficulty.value
          }"
          @click="handleDifficultyChange(difficulty.value)"
        >
          {{ $t(`games.difficulty.${difficulty.value}`) }}
        </button>
      </div>
    </div>

    <h2>{{ $t('games.levels') }}</h2>
    <div class="levels-scroll" ref="levelsScrollRef">
      <div class="levels-grid">
        <div
          v-for="level in totalLevels"
          :key="level"
          class="level-item"
                      :class="{
              'level-item--completed': isLevelCompleted(level, currentDifficulty),
              'level-item--current': level === currentLevel,
              'level-item--locked': level > currentLevel
            }"
          @click="handleLevelClick(level)"
          :ref="el => setCurrentLevelRef(el, level)"
        >
          <div class="level-icon">
            <span v-if="isLevelCompleted(level, currentDifficulty)" class="flex items-center justify-center check-icon">
              <CheckIcon />
            </span>
            <span v-else-if="level === currentLevel" class="flex items-center justify-center play-icon">
              <PlayIcon />
            </span>
            <span v-else class="flex items-center justify-center lock-icon">
              <LockIcon />
            </span>
          </div>
          <span class="level-number">{{ level }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, ComponentPublicInstance, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CheckIcon from '@/components/Icons/CheckIcon.vue'
import PlayIcon from '@/components/Icons/PlayIcon.vue'
import LockIcon from '@/components/Icons/LockIcon.vue'
import { useGameProgress, type Difficulty } from '@/composables/useGameProgress'

interface Props {
  gameId: string
  totalLevels: number
  onLevelClick: (level: number) => void
}

const props = defineProps<Props>()
const { t } = useI18n()

// Используем composable для управления прогрессом
const {
  currentDifficulty,
  currentLevel,
  setDifficulty,
  isLevelCompleted
} = useGameProgress(props.gameId)

const levelsScrollRef = ref<HTMLElement | null>(null)
const currentLevelRef = ref<HTMLElement | null>(null)

// Массив сложностей
const difficulties = computed(() => [
  { value: 'easy' as Difficulty, label: 'easy' },
  { value: 'medium' as Difficulty, label: 'medium' },
  { value: 'hard' as Difficulty, label: 'hard' }
])

// Функция для установки ref текущего уровня
const setCurrentLevelRef = (el: Element | ComponentPublicInstance | null, level: number): void => {
  if (el instanceof HTMLElement && level === currentLevel.value) {
    currentLevelRef.value = el;
  }
}

// Обработчик клика по уровню
const handleLevelClick = (level: number): void => {
  if (level <= currentLevel.value) {
    props.onLevelClick(level)
  }
}

// Обработчик смены сложности
const handleDifficultyChange = (difficulty: Difficulty): void => {
  setDifficulty(difficulty)
}

// Функция для прокрутки к текущему уровню
const scrollToCurrentLevel = (): void => {
  if (levelsScrollRef.value && currentLevelRef.value) {
    const scrollContainer = levelsScrollRef.value;
    const currentLevelElement = currentLevelRef.value;
    
    // Получаем позицию элемента относительно контейнера
    const containerRect = scrollContainer.getBoundingClientRect();
    const elementRect = currentLevelElement.getBoundingClientRect();
    
    // Вычисляем позицию для прокрутки (центрирование элемента)
    const scrollLeft = elementRect.left - containerRect.left - 
                      (containerRect.width / 2) + (elementRect.width / 2);
    
    // Плавная прокрутка к элементу
    scrollContainer.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  }
}

onMounted(() => {
  setTimeout(scrollToCurrentLevel, 100);
});
</script>

<style lang="scss" scoped>
.game-preview__levels {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 20px;
}

h2, h3 {
  color: var(--white-color);
  margin: 0;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 600;
}

h3 {
  font-size: 18px;
  margin-bottom: 12px;
}

.difficulty-selector {
  margin-bottom: 20px;
}

.difficulty-buttons {
  display: flex;
  gap: 8px;
}

.difficulty-btn {
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--gray-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &--active {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--dark-color);
    font-weight: 600;
  }
}

.levels-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.levels-grid {
  display: flex;
  gap: 8px;
}

.level-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.level-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--white-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }
}

.level-number {
  font-size: 14px;
  color: var(--gray-color);
}

.level-item--completed .level-icon {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--dark-color);
}

.level-item--current .level-icon {
  background: rgba(var(--primary-rgb), 0.2);
  border-color: var(--primary);
  color: var(--primary);
}

.level-item--locked {
  cursor: not-allowed;
  
  .level-icon,
  .level-number {
    opacity: 0.5;
  }

  &:hover {
    transform: none;
  }
}
</style> 