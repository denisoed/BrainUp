# Game Components

## GameHeader

Универсальный компонент для отображения информации об игре: уровень, сложность, время и счет.

### Использование

```vue
<template>
  <GameHeader 
    :level="currentLevel"
    :difficulty="currentDifficulty"
    :time-left="timeLeft"
    :score="score"
    :winning-streak="winningStreak"
  />
</template>

<script setup>
import GameHeader from '@/components/Games/GameHeader.vue';
import { useGameProgress } from '@/composables/useGameProgress';

const { currentLevel, getDifficultyByLevel } = useGameProgress(gameId);
const currentDifficulty = computed(() => getDifficultyByLevel(currentLevel.value));
</script>
```

### Props

- `level: number` - текущий уровень
- `difficulty: 'easy' | 'medium' | 'hard'` - сложность
- `timeLeft: number` - оставшееся время
- `score: number` - текущий счет
- `winningStreak: number` - необходимое количество очков для победы

## LevelIndicator

Компактный компонент для отображения только уровня и сложности.

### Использование

```vue
<template>
  <LevelIndicator 
    :level="currentLevel"
    :difficulty="currentDifficulty"
  />
</template>

<script setup>
import LevelIndicator from '@/components/Games/LevelIndicator.vue';
</script>
```

### Props

- `level: number` - текущий уровень
- `difficulty: 'easy' | 'medium' | 'hard'` - сложность

## Интеграция с useGameProgress

Для получения информации об уровне и сложности используйте composable `useGameProgress`:

```typescript
import { useGameProgress } from '@/composables/useGameProgress';

const gameId = route.params.game;
const { 
  currentLevel, 
  getDifficultyByLevel, 
  getLevelInfo 
} = useGameProgress(gameId);

// Определение сложности на основе уровня
const currentDifficulty = computed(() => getDifficultyByLevel(currentLevel.value));

// Получение полной информации об уровне
const levelInfo = getLevelInfo(currentLevel.value);
```

### Логика определения сложности

- **Easy (Новичок)**: уровни 1-8
- **Medium (Профи)**: уровни 9-14
- **Hard (Эксперт)**: уровни 15-20

## Миграция существующих игр

1. Замените блок `.stats` на `GameHeader`
2. Добавьте импорт `useGameProgress`
3. Получите `currentLevel` и `getDifficultyByLevel`
4. Создайте computed свойство для `currentDifficulty`

### Пример миграции

**Было:**
```vue
<div class="stats">
  <div class="timer">⏳ {{ $t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
  <div class="score">🏆 {{ $t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
</div>
```

**Стало:**
```vue
<GameHeader 
  :level="currentLevel"
  :difficulty="currentDifficulty"
  :time-left="timeLeft"
  :score="score"
  :winning-streak="WINNING_STREAK"
/>
``` 