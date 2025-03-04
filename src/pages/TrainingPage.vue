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
        <div class="exercise-icon">{{ currentExercise.icon }}</div>
        <h2 class="exercise-title">{{ currentExercise.title }}</h2>
        <p class="exercise-description">{{ $t('training.exerciseDescription') }}</p>
        <button class="start-exercise-btn" @click="startExercise">
          {{ $t('training.startExercise') }}
        </button>
      </div>

      <!-- Progress Timeline -->
      <div class="timeline">
        <div 
          v-for="(exercise, index) in exercises" 
          :key="exercise.id"
          class="timeline-item"
          :class="{
            'completed': index < currentExerciseIndex,
            'current': index === currentExerciseIndex
          }"
        >
          <div class="timeline-icon">{{ exercise.icon }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BackBtn from '@/components/BackBtn.vue';

interface Exercise {
  id: number;
  icon: string;
  title: string;
  route: string;
}

const router = useRouter();
const { t } = useI18n();

// Training exercises data
const exercises = ref<Exercise[]>([
  { 
    id: 1, 
    icon: '🎯', 
    title: t('training.exercises.focus'),
    route: '/game/minesweeper'
  },
  { 
    id: 2, 
    icon: '🧩', 
    title: t('training.exercises.puzzle'),
    route: '/game/sequence'
  },
  { 
    id: 3, 
    icon: '🗣️', 
    title: t('training.exercises.speech'),
    route: '/game/tongueTwister'
  }
]);

const currentExerciseIndex = ref(0);
const currentExercise = computed(() => exercises.value[currentExerciseIndex.value]);

function startExercise() {
  router.push(currentExercise.value.route);
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
  padding: 24px;
  text-align: center;
  margin-bottom: 32px;
  
  .exercise-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .exercise-title {
    color: var(--white-color);
    font-size: 24px;
    margin: 0 0 12px;
  }
  
  .exercise-description {
    color: var(--gray-color);
    margin-bottom: 24px;
  }
}

.start-exercise-btn {
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

.timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  position: relative;
  
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
  }
  
  &.completed {
    .timeline-icon {
      background: var(--primary);
      border-color: var(--primary);
    }
  }
  
  &.current {
    .timeline-icon {
      border-color: var(--primary);
      transform: scale(1.2);
    }
  }
}
</style> 