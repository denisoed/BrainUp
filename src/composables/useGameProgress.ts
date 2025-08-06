import { ref, computed, readonly } from 'vue'

export type Difficulty = 'easy' | 'medium' | 'hard'

interface GameProgress {
  currentLevel: number
  difficulty: Difficulty
  completedLevels: {
    easy: number[]
    medium: number[]
    hard: number[]
  }
}

interface GameProgressStorage {
  [gameId: string]: GameProgress
}

const STORAGE_KEY = 'game-progress'

export function useGameProgress(gameId: string) {
  const progress = ref<GameProgress>({
    currentLevel: 1,
    difficulty: 'easy',
    completedLevels: {
      easy: [],
      medium: [],
      hard: []
    }
  })

  // Загрузка прогресса из localStorage
  const loadProgress = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const allProgress: GameProgressStorage = JSON.parse(stored)
        if (allProgress[gameId]) {
          progress.value = allProgress[gameId]
          // Убеждаемся, что currentLevel соответствует текущей сложности
          const storedLevel = getCurrentLevelForDifficulty(progress.value.difficulty)
          progress.value.currentLevel = storedLevel
        }
      }
    } catch (error) {
      console.error('Error loading game progress:', error)
    }
  }

  // Сохранение прогресса в localStorage
  const saveProgress = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const allProgress: GameProgressStorage = stored ? JSON.parse(stored) : {}
      allProgress[gameId] = progress.value
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
    } catch (error) {
      console.error('Error saving game progress:', error)
    }
  }

  // Установка сложности
  const setDifficulty = (difficulty: Difficulty): void => {
    progress.value.difficulty = difficulty
    // Восстанавливаем прогресс для выбранной сложности
    const storedLevel = getCurrentLevelForDifficulty(difficulty)
    progress.value.currentLevel = storedLevel
    saveProgress()
  }

  // Установка текущего уровня
  const setCurrentLevel = (level: number): void => {
    progress.value.currentLevel = level
    saveProgress()
  }

  // Завершение уровня
  const completeLevel = (level: number): void => {
    const { difficulty } = progress.value
    if (!progress.value.completedLevels[difficulty].includes(level)) {
      progress.value.completedLevels[difficulty].push(level)
      progress.value.currentLevel = Math.max(progress.value.currentLevel, level + 1)
      saveProgress()
    }
  }

  // Получение текущего уровня для сложности
  const getCurrentLevelForDifficulty = (difficulty: Difficulty): number => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const allProgress: GameProgressStorage = JSON.parse(stored)
        if (allProgress[gameId] && allProgress[gameId].completedLevels[difficulty]) {
          // Если есть завершенные уровни, возвращаем следующий доступный
          const completedLevels = allProgress[gameId].completedLevels[difficulty]
          return completedLevels.length > 0 ? Math.max(...completedLevels) + 1 : 1
        }
        // Если есть сохраненный currentLevel для этой сложности, используем его
        if (allProgress[gameId] && allProgress[gameId].currentLevel) {
          return allProgress[gameId].currentLevel
        }
      }
    } catch (error) {
      console.error('Error getting current level for difficulty:', error)
    }
    return 1
  }

  // Получение завершенных уровней для сложности
  const getCompletedLevelsForDifficulty = (difficulty: Difficulty): number[] => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const allProgress: GameProgressStorage = JSON.parse(stored)
      if (allProgress[gameId]) {
        return allProgress[gameId].completedLevels[difficulty] || []
      }
    }
    return []
  }

  // Проверка, завершен ли уровень
  const isLevelCompleted = (level: number, difficulty: Difficulty): boolean => {
    const completedLevels = progress.value.completedLevels[difficulty]
    return completedLevels ? completedLevels.includes(level) : false
  }

  // Получение максимального доступного уровня для сложности
  const getMaxAvailableLevel = (difficulty: Difficulty): number => {
    const completedLevels = progress.value.completedLevels[difficulty]
    return completedLevels.length > 0 ? Math.max(...completedLevels) + 1 : 1
  }

  // Вычисляемые свойства
  const currentDifficulty = computed(() => progress.value.difficulty)
  const currentLevel = computed(() => progress.value.currentLevel)
  const completedLevels = computed(() => progress.value.completedLevels[progress.value.difficulty])

  // Инициализация при создании
  loadProgress()

  return {
    // Состояние
    progress: readonly(progress),
    currentDifficulty,
    currentLevel,
    completedLevels,
    
    // Методы
    setDifficulty,
    setCurrentLevel,
    completeLevel,
    loadProgress,
    saveProgress,
    getCurrentLevelForDifficulty,
    getCompletedLevelsForDifficulty,
    isLevelCompleted,
    getMaxAvailableLevel
  }
} 