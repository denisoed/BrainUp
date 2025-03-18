<template>
  <div class="training-page">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="progress">{{ currentExerciseIndex + 1 }}/{{ exercises.length }}</div>
        <h1>{{ $t('training.title') }}</h1>
        <BackBtn @click="$router.back()" />
      </div>

      <!-- Current Exercise Card -->
      <div class="exercise-card">
        <div class="exercise-icon">{{ currentExercise?.icon }}</div>
        <h2 class="exercise-title">{{ currentExercise?.title }}</h2>
        <p class="exercise-description">{{ $t('training.exerciseDescription') }}</p>

        <!-- Games List for Current Category -->
        <div class="games-list">
          <div class="games-scroll">
            <TrainingCardItem
              v-for="(game, index) in currentExercise?.games" 
              :key="index"
              :title="game.title"
              :description="t(`games.${game.iconKey}.about.descr`)"
              :icon="getGameIcon(game.iconKey)"
              :locked="!game.active"
              :route="game.route"
            />
          </div>
        </div>
      </div>

      <!-- Progress Timeline -->
      <div class="timeline">
        <div class="timeline-progress" :style="{ width: `${progressWidth}%` }" />
        <div 
          v-for="(exercise, index) in exercises" 
          :key="index"
          class="timeline-item"
          :class="{
            'completed': exercise.completed,
            'current': exercise.current
          }"
        >
          <div class="timeline-icon">{{ exercise.icon }}</div>
          <div v-if="exercise.completed" class="timeline-check">
            <CheckIcon />
          </div>
        </div>
      </div>

      <Button @click="startExercise" class="start-exercise-btn">
        {{ $t('training.startExercise') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BackBtn from '@/components/BackBtn.vue';
import TrainingCardItem from '@/components/TrainingCardItem.vue';
import gameIcons from '@/data/gameIcons';
import CheckIcon from '@/components/Icons/CheckIcon.vue';
import Button from '@/components/Button.vue';

interface Game {
  iconKey: string;
  title: string;
  route: string;
  active: boolean;
}

interface Exercise {
  icon: string;
  title: string;
  route: string;
  games: Game[];
  completed: boolean;
  current: boolean;
}

const router = useRouter();
const { t } = useI18n();

// Training exercises data
const exercises = computed<Exercise[]>(() => ([
  {
    icon: '🎯', 
    title: t('training.exercises.focus'),
    route: '/game/minesweeper',
    completed: true,
    current: false,
    games: [
      {
        iconKey: 'minesweeper',
        title: t('games.names.minesweeper'),
        route: '/game-preview/minesweeper',
        active: true
      },
      {
        iconKey: 'gridSequence',
        title: t('games.names.gridSequence'),
        route: '/game-preview/gridSequence',
        active: false
      },
      {
        iconKey: 'colors',
        title: t('games.names.colors'),
        route: '/game-preview/colors',
        active: false
      }
    ]
  },
  {
    icon: '🧩', 
    title: t('training.exercises.puzzle'),
    route: '/game-preview/sequence',
    completed: false,
    current: true,
    games: [
      {
        iconKey: 'sequence',
        title: t('games.names.sequence'),
        route: '/game-preview/sequence',
        active: true
      },
      {
        iconKey: 'mathBlocks',
        title: t('games.names.mathBlocks'),
        route: '/game-preview/memory',
        active: false
      },
      {
        iconKey: 'numbers',
        title: t('games.names.numbers'),
        route: '/game-preview/numbers',
        active: false
      }
    ]
  },
  {
    icon: '🗣️', 
    title: t('training.exercises.speech'),
    route: '/game/tongueTwister',
    completed: false,
    current: false,
    games: [
      {
        iconKey: 'tongueTwister',
        title: t('games.names.tongueTwister'),
        route: '/game-preview/tongueTwister',
        active: true
      },
      {
        iconKey: 'spelling',
        title: t('games.names.spelling'),
        route: '/game-preview/spelling',
        active: false
      },
      {
        iconKey: 'vocabulary',
        title: t('games.names.vocabulary'),
        route: '/game-preview/vocabulary',
        active: false
      }
    ]
  }
]));

const currentExercise = computed(() => exercises.value.find(exercise => exercise.current));
const currentExerciseIndex = computed(() => exercises.value.findIndex(exercise => exercise.current));

const progressWidth = computed(() => {
  const currentIndex = exercises.value.findIndex(ex => ex.current);
  
  // Расчет с учетом отступов:
  // Первый шаг - 15%
  // Второй шаг - 50%
  // Третий шаг - 85%
  // Все завершены - 100%
  if (exercises.value.every(ex => ex.completed)) {
    return 100;
  }
  
  const positions = [15, 50, 85];
  return positions[currentIndex];
});

function startExercise() {
  if (currentExercise.value) {
    router.push(currentExercise.value.route);
  }
}

function getGameIcon(iconKey: string) {
  return gameIcons[iconKey as keyof typeof gameIcons];
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    flex: 1;
    text-align: center;
    color: var(--white-color);
    font-size: 20px;
    margin: 0;
  }
  
  .progress {
    color: var(--primary);
    font-weight: 500;
  }
}

.exercise-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  margin-bottom: 32px;
  
  .exercise-icon {
    font-size: 48px;
  }
  
  .exercise-title {
    color: var(--white-color);
    font-size: 24px;
    margin: 0 0 8px;
  }
  
  .exercise-description {
    color: var(--gray-color);
    margin: 0 0 16px;
  }
}

.start-exercise-btn {
  width: 100%;
  background: var(--primary);
  color: var(--dark-color);
}

.timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  position: relative;
  margin-bottom: 32px;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }

  .timeline-progress {
    position: absolute;
    top: 50%;
    left: 0;
    height: 2px;
    background: var(--primary);
    z-index: 0;
    transition: width 0.3s ease;
  }
}

.timeline-item {
  position: relative;
  z-index: 1;
  
  .timeline-icon {
    width: 40px;
    height: 40px;
    background: var(--dark-color);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    position: relative;
    line-height: normal;
  }
  
  .timeline-check {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dark-color);
    font-size: 12px;
    font-weight: bold;
    border: 2px solid var(--dark-color);

    :deep(svg) {
      width: 8px;
      height: 8px;
    }
  }
  
  &.completed {
    .timeline-icon {
      background: var(--primary);
      border-color: var(--primary);
      color: var(--dark-color);
    }
  }
  
  &.current {
    .timeline-icon {
      border-color: var(--primary);
      transform: scale(1.2);
    }
  }
}

/* Games List Styles */
.games-list {
  .games-list-title {
    color: var(--white-color);
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .games-scroll {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--primary);
      border-radius: 4px;
    }
  }
}
</style> 