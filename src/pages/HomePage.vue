<template>
  <div class="home-page">
    <div class="welcome-section container">
      <h1 class="welcome-title">
        {{ $t('home.welcome', { name: userName }) }}
      </h1>
      <p class="welcome-subtitle">{{ $t('home.subtitle') }}</p>
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

const { t } = useI18n();
const userName = ref('');

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
  padding-bottom: 70px; // Space for bottom navigation
}

.welcome-section {
  margin-bottom: 24px;

  .welcome-title {
    font-size: 28px;
    color: var(--white-color);
    margin: 0;
    font-weight: bold;
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
</style>