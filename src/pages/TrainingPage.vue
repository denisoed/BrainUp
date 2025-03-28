<template>
  <div class="training-page full-height">
    <div class="container full-height">
      <!-- Header -->
      <div class="header">
        <div class="progress">{{ currentExerciseIndex + 1 }}/{{ exercises.length }}</div>
        <h1>{{ $t('training.title') }}</h1>
        <BackBtn @click="$router.back()" />
      </div>

      <!-- Current Exercise Card -->
      <div class="exercise-card hidden">
        <div class="exercise-icon">{{ currentExercise?.icon }}</div>
        <h2 class="exercise-title">{{ currentExercise?.title }}</h2>
        <p class="exercise-description">{{ $t('training.exerciseDescription') }}</p>
      </div>

      <!-- Progress Timeline -->
      <div class="flex gap-md items-center timeline-container">
        <Timeline 
          :items="exercises"
          :progress="progressWidth"
          vertical
          class="timeline-vertical"
        />
        <!-- Games List for Current Category -->
        <div class="flex column items-start gap-md games-list">
          <TrainingCardItem
            v-for="(game, index) in currentExercise?.games" 
            :key="index"
            :title="game.title"
            :description="t(`games.${game.iconKey}.about.descr`)"
            :icon="getGameIcon(game.iconKey)"
            :locked="game.locked"
            :current="game.current"
            :route="game.route"
          />
        </div>
      </div>

      <Button @click="startExercise" class="start-exercise-btn mt-auto">
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
import Timeline from '@/components/Timeline.vue';
import gameIcons from '@/data/gameIcons';
import Button from '@/components/Button.vue';

interface Game {
  iconKey: string;
  title: string;
  route: string;
  locked: boolean;
  current: boolean;
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
        locked: false,
        current: false
      },
      {
        iconKey: 'gridSequence',
        title: t('games.names.gridSequence'),
        route: '/game-preview/gridSequence',
        locked: false,
        current: false
      },
      {
        iconKey: 'colors',
        title: t('games.names.colors'),
        route: '/game-preview/colors',
        locked: false,
        current: false
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
        locked: false,
        current: false
      },
      {
        iconKey: 'mathBlocks',
        title: t('games.names.mathBlocks'),
        route: '/game-preview/mathBlocks',
        locked: false,
        current: true
      },
      {
        iconKey: 'numbers',
        title: t('games.names.numbers'),
        route: '/game-preview/numbers',
        locked: true,
        current: false
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
        locked: true,
        current: false
      },
      {
        iconKey: 'spelling',
        title: t('games.names.spelling'),
        route: '/game-preview/spelling',
        locked: true,
        current: false
      },
      {
        iconKey: 'vocabulary',
        title: t('games.names.vocabulary'),
        route: '/game-preview/vocabulary',
        locked: true,
        current: false
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
    margin: 0 0 8px;
  }
}

.start-exercise-btn {
  width: 100%;
  position: sticky;
  bottom: 0;
  background: var(--white-color);
  color: var(--dark-color);
}

.timeline-container {
  margin-bottom: 16px;

  .timeline-vertical {
    height: 370px;
  }

  .games-list {
    .training-card-item {
      width: 100%;
      flex: inherit;
    }
  }
}
</style> 