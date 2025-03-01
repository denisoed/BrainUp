<template>
  <div class="home-page">
    <!-- Welcome Section -->
    <div class="container">
      <div class="welcome-section">
        <h1 class="welcome-title" v-html="$t('home.welcome', { name: userName })" />
        <p class="welcome-subtitle">{{ $t('home.subtitle') }}</p>
      </div>
      <router-link to="/list" class="home-page_menu-btn">
        <img src="@/assets/burger-menu-right.svg" alt="Menu" />
      </router-link>
    </div>

    <!-- Training Cards Slider -->
    <div class="training-cards container">
      <div class="training-cards_scroll">
        <div 
          v-for="card in trainingCards" 
          :key="card.id"
          class="training-card-item"
          :class="{ 'training-card-item--premium': card.premium }"
          @click="onCardClick(card)"
        >
          <div class="card-icon">
            <img :src="card.icon" :alt="card.title">
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-description" v-html="card.description" />
          </div>
          <div v-if="card.premium" class="premium-badge">
            <span>PRO</span>
          </div>
        </div>
        <router-link to="/list" class="all-games-card">
          <div class="all-games-card_content">
            <h3 class="card-title">{{ $t('home.more') }}</h3>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Daily Goals -->
    <div class="daily-goals container">
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

    <!-- Daily Training Set -->
    <div class="daily-training container">
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
          {{ $t('home.training.start') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import MinesweeperIcon from '@/assets/abstracts/minesweeper.svg';
import ColorsIcon from '@/assets/abstracts/colors.svg';
import NumbersIcon from '@/assets/abstracts/numbers.svg';
import TongueTwisterIcon from '@/assets/abstracts/tongueTwister.svg';
import SequenceIcon from '@/assets/abstracts/sequence.svg';

const { t } = useI18n();
const router = useRouter();
const userName = ref('');

// Training cards data
const trainingCards = ref([
  {
    id: 1,
    title: t('home.cards.minesweeper'),
    description: t('games.minesweeper.about.descr'),
    icon: MinesweeperIcon,
    route: '/game/minesweeper',
    premium: false
  },
  {
    id: 2,
    title: t('home.cards.colors'),
    description: t('games.colors.about.descr'),
    icon: ColorsIcon,
    route: '/game/colors',
    premium: false
  },
  {
    id: 3,
    title: t('home.cards.numbers'),
    description: t('games.numbers.about.descr'),
    icon: NumbersIcon,
    route: '/game/numbers',
    premium: true
  },
  {
    id: 4,
    title: t('home.cards.tongueTwister'),
    description: t('games.tongueTwister.about.descr'),
    icon: TongueTwisterIcon,
    route: '/game/tongueTwister',
    premium: false
  },
  {
    id: 5,
    title: t('home.cards.sequence'),
    description: t('games.sequence.about.descr'),
    icon: SequenceIcon,
    route: '/game/sequence',
    premium: true
  },
]);

function onCardClick(card: any) {
  if (card.premium) {
    router.push('/buy-premium');
  } else {
    router.push(card.route);
  }
}

// Daily goals data
const dailyGoals = ref([
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
]);

const completedGoals = computed(() => dailyGoals.value.filter(goal => goal.completed).length);
const totalGoals = computed(() => dailyGoals.value.length);

// Daily exercises
const dailyExercises = ref([
  { id: 1, icon: '🎯', title: t('home.training.exercises.focus') },
  { id: 2, icon: '🧩', title: t('home.training.exercises.puzzle') },
  { id: 3, icon: '🗣️', title: t('home.training.exercises.speech') }
]);

function startTraining() {
  // Implement training start logic
  console.log('Starting daily training...');
}

onMounted(() => {
  // Get user data from Telegram WebApp
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    userName.value = user.first_name || '';
  }
});
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 20px;

  &_menu-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    width: 60px;
    background: transparent;
    padding: 20px 16px;
    
    img {
      width: 100%;
      display: block;
    }
  }
}

.welcome-section {
  margin-bottom: 24px;

  :deep(h1) {
    font-size: 32px;
    color: var(--white-color);
    font-weight: bold;
    margin: 0;

    span {
      color: var(--primary);
    }
  }
  
  .welcome-subtitle {
    color: var(--white-color);
    opacity: 0.7;
    margin: 8px 0 0;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
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

.daily-training {
  margin-top: 24px;
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
  padding: 16px;
  background: var(--primary);
  border: none;
  border-radius: 12px;
  color: var(--dark-color);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.training-cards {
  margin: 24px 0;
  
  &_scroll {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px;
    -webkit-overflow-scrolling: touch; // Для плавного скролла на iOS
    
    // Скрываем скроллбар
    &::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none;
    -ms-overflow-style: none;
  }
}

.training-card-item {
  flex: 0 0 calc(70% - 8px); // Размер карточки (2.5 карточки на экране)
  scroll-snap-align: start;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-sizing: border-box;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  &--premium {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.1));
    border: 1px solid var(--primary);
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  .card-content {
    position: relative;
    z-index: 1;
  }
  
  .card-title {
    color: var(--white-color);
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    margin: 0 0 8px;
  }
  
  :deep(.card-description) {
    color: var(--gray-color);
    font-size: 12px;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    span {
      color: var(--white-color);
    }
  }
  
  .premium-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--primary);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--dark-color);
  }
}
</style>