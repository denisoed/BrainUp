<template>
  <div class="home-page">
    <TheHeader class="mb-lg" />

    <!-- Daily Training Set -->
    <div class="daily-training mb-lg container">
      <div class="training-card">
        <div class="training-header">
          <h2>{{ $t('home.training.title') }}</h2>
          <div class="training-time">{{ $t('home.training.time', { minutes: 15 }) }}</div>
        </div>
        <div class="training-exercises">
          <div 
            v-for="exercise in dailyExercises" 
            :key="exercise.id" 
            class="exercise-item"
          >
            <div class="exercise-icon">{{ exercise.icon }}</div>
            <div class="exercise-title">{{ exercise.title }}</div>
          </div>
        </div>
        <button class="start-button" @click="startTraining">
          {{ $t('home.training.practise') }}
        </button>
      </div>
    </div>

    <!-- Daily Goals -->
    <div class="daily-goals mb-lg container">
      <div class="section-header">
        <h2>{{ $t('home.goals.title') }}</h2>
        <span class="progress-text">{{ completedGoals }}/{{ totalGoals }}</span>
      </div>
      <div class="goals-grid">
        <div 
          v-for="goal in dailyGoals" 
          :key="goal.id"
          class="goal-item"
          :class="{ 'completed': goal.completed }"
        >
          <div class="goal-icon">{{ goal.icon }}</div>
          <div class="goal-info">
            <div class="goal-title">{{ goal.title }}</div>
            <div class="goal-progress">
              <div 
                class="progress-bar" 
                :style="{ width: `${goal.progress}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Training Cards Slider -->
    <div class="training-cards container">
      <div class="section-header">
        <h2>{{ $t('home.trainingCards.title') }}</h2>
      </div>
      <div class="training-cards_scroll horizontal-scroll">
        <TrainingCardItem
          v-for="card in trainingCards"
          :key="card.id"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
          :route="card.route"
          :premium="card.premium"
          @click="onCardClick(card)"
        />
        <router-link to="/list" class="all-games-card">
          <div class="all-games-card_content">
            <h3 class="card-title">{{ $t('home.more') }}</h3>
          </div>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import TrainingCardItem from '@/components/TrainingCardItem.vue';

import MinesweeperIcon from '@/assets/abstracts/minesweeper.svg';
import ColorsIcon from '@/assets/abstracts/colors.svg';
import NumbersIcon from '@/assets/abstracts/numbers.svg';
import TongueTwisterIcon from '@/assets/abstracts/tongueTwister.svg';
import SequenceIcon from '@/assets/abstracts/sequence.svg';
import MemoryPairsIcon from '@/assets/abstracts/memoryPairs.svg';

const { t } = useI18n();
const router = useRouter();

// Training cards data
const trainingCards = computed(() => ([
  {
    id: 1,
    title: t('home.cards.minesweeper'),
    description: t('games.minesweeper.about.descr'),
    icon: MinesweeperIcon,
    route: '/game-preview/minesweeper',
    premium: false
  },
  {
    id: 2,
    title: t('home.cards.colors'),
    description: t('games.colors.about.descr'),
    icon: ColorsIcon,
    route: '/game-preview/colors',
    premium: false
  },
  {
    id: 3,
    title: t('home.cards.numbers'),
    description: t('games.numbers.about.descr'),
    icon: NumbersIcon,
    route: '/game-preview/numbers',
    premium: true
  },
  {
    id: 4,
    title: t('home.cards.tongueTwister'),
    description: t('games.tongueTwister.about.descr'),
    icon: TongueTwisterIcon,
    route: '/game-preview/tongueTwister',
    premium: false
  },
  {
    id: 5,
    title: t('home.cards.sequence'),
    description: t('games.sequence.about.descr'),
    icon: SequenceIcon,
    route: '/game-preview/sequence',
    premium: true
  },
  {
    id: 6,
    title: t('home.cards.memoryPairs'),
    description: t('games.memoryPairs.about.descr'),
    icon: MemoryPairsIcon,
    route: '/game-preview/memoryPairs',
    premium: false
  },
]));

// Daily goals data
const dailyGoals = computed(() => ([
  { 
    id: 1, 
    icon: '🎯', 
    title: t('home.goals.focus'),
    progress: 60,
    completed: false 
  },
  { 
    id: 2, 
    icon: '🧠', 
    title: t('home.goals.memory'),
    progress: 100,
    completed: true 
  },
  { 
    id: 3, 
    icon: '💭', 
    title: t('home.goals.logic'),
    progress: 30,
    completed: false 
  }
]));

const completedGoals = computed(() => dailyGoals.value.filter(goal => goal.completed).length);
const totalGoals = computed(() => dailyGoals.value.length);

// Daily exercises
const dailyExercises = computed(() => [
  { id: 1, icon: '🎯', title: t('home.training.exercises.focus') },
  { id: 2, icon: '🧩', title: t('home.training.exercises.puzzle') },
  { id: 3, icon: '🗣️', title: t('home.training.exercises.speech') }
]);

function onCardClick(card: any) {
  if (card.premium) {
    router.push('/buy-premium');
  } else {
    router.push(card.route);
  }
}

function startTraining() {
  try {
    router.push('/training');
  } catch (error) {
    console.error('Failed to start training:', error);
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  h2 {
    font-size: 20px;
    color: var(--white-color);
    margin: 0;
  }
  
  .progress-text {
    font-size: 20px;
    color: var(--primary);
    font-weight: 500;
  }
}

.goals-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  
  &.completed {
    background: rgba(var(--primary-rgb), 0.1);
    
    .goal-progress {
      .progress-bar {
        background: var(--primary);
      }
    }
  }
  
  .goal-icon {
    font-size: 24px;
  }
  
  .goal-info {
    flex: 1;
  }
  
  .goal-title {
    color: var(--white-color);
    margin-bottom: 8px;
  }
  
  .goal-progress {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    
    .progress-bar {
      height: 100%;
      background: var(--white-color);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }
}

.all-games-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;

  .card-title {
    color: var(--white-color);
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
  }
}

.training-card {
  background: rgba(var(--primary-rgb), 0.1);
  border: 1px solid var(--primary);
  border-radius: 16px;
  padding: 20px;
  
  .training-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      color: var(--white-color);
      font-size: 20px;
      margin: 0;
    }
    
    .training-time {
      color: var(--primary);
      font-weight: 500;
    }
  }
}

.training-exercises {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .exercise-icon {
    font-size: 24px;
  }
  
  .exercise-title {
    color: var(--white-color);
  }
}

.start-button {
  width: 100%;
  background: var(--white-color);
  border: none;
  border-radius: 12px;
  color: var(--dark-color);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.training-cards {
  &_scroll {
    display: flex;
    gap: 12px;
  }
}
</style>