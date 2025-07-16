<template>
  <div class="articulation-game">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner">⏳</div>
      <p class="loading-text">{{ $t('games.articulation.initializing') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">{{ $t('games.articulation.error') }}</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <button class="retry-button" @click="initializeController">
        {{ $t('games.articulation.retry') }}
      </button>
    </div>

    <!-- Demo Phase -->
    <div v-else-if="currentPhase === 'demo'" class="demo-phase">
      <div class="exercise-info">
        <h2 class="exercise-title">{{ currentExercise?.title }}</h2>
        <p class="exercise-description">{{ currentExercise?.description }}</p>
      </div>
      
      <div class="demo-video-container">
        <video 
          v-if="currentExercise?.media"
          :src="currentExercise.media"
          autoplay
          loop
          muted
          class="demo-video"
        />
        <div v-else class="demo-placeholder">
          <div class="demo-icon">👄</div>
          <p>{{ currentExercise?.title }}</p>
        </div>
      </div>

      <button 
        class="start-button"
        @click="startExercise"
        :disabled="!cameraReady"
      >
        {{ cameraReady ? $t('games.articulation.ready') : $t('games.articulation.loading') }}
      </button>
    </div>

    <!-- Wait Ready Phase -->
    <div v-else-if="currentPhase === 'waitReady'" class="wait-ready-phase">
      <div class="countdown-container">
        <div class="countdown">{{ countdown }}</div>
        <p class="countdown-text">{{ $t('games.articulation.getReady') }}</p>
      </div>
    </div>

    <!-- Running, Success, Fail Phases -->
    <div v-show="!isLoading" class="exercise-phase">
      <div class="stats">
        <div class="timer">
          ⏱️ {{ $t('games.time') }}: 
          <span>{{ formatTime(holdTimer) }}</span> / {{ formatTime(currentExercise?.holdMs || 0) }}
        </div>
        <div class="score">
          🏆 {{ $t('games.score') }}: <span>{{ score }}</span>
        </div>
      </div>

      <ProgressBar 
        :progress="holdProgress" 
        :color="targetsAchieved ? '#00ff00' : '#ff6b6b'"
      />

      <!-- Video and Canvas Container -->
      <div class="video-container">
        <video 
          ref="videoRef"
          autoplay
          playsinline
          muted
          class="video-feed"
        />
        <canvas 
          ref="canvasRef"
          class="video-overlay"
        />
        
        <!-- Status Indicator -->
        <div 
          class="status-indicator"
          :class="{
            'status-success': targetsAchieved,
            'status-fail': !targetsAchieved && currentPhase === 'running'
          }"
        >
          <div v-if="targetsAchieved" class="status-text">✅ {{ $t('games.articulation.perfect') }}</div>
          <div v-else-if="currentPhase === 'running'" class="status-text">
            🎯 {{ $t('games.articulation.keepTrying') }}
          </div>
        </div>
      </div>

      <!-- Metrics Display -->
      <div v-if="currentMetrics" class="metrics-display">
        <div class="metric">
          <span class="metric-label">{{ $t('games.articulation.metrics.smile') }}:</span>
          <div class="metric-bar">
            <div 
              class="metric-fill"
              :style="{ width: `${currentMetrics.lipStretch * 100}%` }"
            />
          </div>
          <span class="metric-value">{{ Math.round(currentMetrics.lipStretch * 100) }}%</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">{{ $t('games.articulation.metrics.pucker') }}:</span>
          <div class="metric-bar">
            <div 
              class="metric-fill"
              :style="{ width: `${currentMetrics.lipRound * 100}%` }"
            />
          </div>
          <span class="metric-value">{{ Math.round(currentMetrics.lipRound * 100) }}%</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">{{ $t('games.articulation.metrics.open') }}:</span>
          <div class="metric-bar">
            <div 
              class="metric-fill"
              :style="{ width: `${currentMetrics.jawOpen * 100}%` }"
            />
          </div>
          <span class="metric-value">{{ Math.round(currentMetrics.jawOpen * 100) }}%</span>
        </div>
      </div>

      <!-- Success/Fail Messages -->
      <div v-if="currentPhase === 'success'" class="result-message success">
        <div class="result-icon">🎉</div>
        <h3>{{ $t('games.articulation.success') }}</h3>
        <button class="next-button" @click="nextExercise">
          {{ $t('games.articulation.next') }}
        </button>
      </div>

      <div v-if="currentPhase === 'fail'" class="result-message fail">
        <div class="result-icon">💪</div>
        <h3>{{ $t('games.articulation.tryAgain') }}</h3>
        <button class="retry-button" @click="retryExercise">
          {{ $t('games.articulation.retry') }}
        </button>
      </div>
    </div>

    <SuccessCounter :value="score" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { openModal } from 'jenesius-vue-modal';

import { ArticulationController } from '@/core/articulationController';
import { articulationExercises, getRandomExercise } from '@/data/articulationExercises';
import { ArticulationPhase } from '@/types/articulation';
import type { ArticulationExercise, ArticulationState, FaceMetrics } from '@/types/articulation';

import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import ProgressBar from '@/components/Games/ProgressBar.vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';

const { t } = useI18n();
const router = useRouter();

// Refs
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// Reactive state
const currentExercise = ref<ArticulationExercise | null>(null);
const currentPhase = ref<ArticulationPhase>(ArticulationPhase.Demo);
const holdTimer = ref(0);
const currentMetrics = ref<FaceMetrics | null>(null);
const score = ref(0);
const targetsAchieved = ref(false);
const cameraReady = ref(false);
const countdown = ref(3);
const exerciseIndex = ref(0);
const errorMessage = ref('');
const isLoading = ref(true);

// Controller instance
let controller: ArticulationController | null = null;

// Computed
const holdProgress = computed(() => {
  if (!currentExercise.value) return 0;
  return Math.min(100, (holdTimer.value / currentExercise.value.holdMs) * 100);
});

// Methods
const initializeController = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    controller = new ArticulationController();
    
    controller.setCallbacks({
      onStateChange: (state: ArticulationState) => {
        currentPhase.value = state.phase;
        holdTimer.value = state.holdTimer;
        score.value = state.score;
        targetsAchieved.value = state.targetsAchieved;
      },
      onMetricsUpdate: (metrics: FaceMetrics) => {
        currentMetrics.value = metrics;
      },
      onExerciseComplete: (exercise: ArticulationExercise, success: boolean) => {
        if (success) {
          setTimeout(() => {
            if (score.value >= 5) {
              showVictoryDialog();
            } else {
              nextExercise();
            }
          }, 2000);
        }
      },
      onError: (error: string) => {
        console.error('Controller error:', error);
        errorMessage.value = error;
        isLoading.value = false;
        cameraReady.value = false;
      }
    });

    console.log('🚀 Starting controller initialization...');
    await controller.init();
    
    await nextTick();
    if (videoRef.value && canvasRef.value) {
      console.log('🎯 Setting up video and canvas elements...');
      await controller.setupElements(videoRef.value, canvasRef.value);
      cameraReady.value = true;
      isLoading.value = false;
      console.log('✅ Controller initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize controller:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    errorMessage.value = `Initialization failed: ${errorMsg}`;
    isLoading.value = false;
    cameraReady.value = false;
  }
};

const startExercise = () => {
  if (!controller || !currentExercise.value) return;
  
  currentPhase.value = ArticulationPhase.WaitReady;
  countdown.value = 3;
  
  const countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval);
      controller!.startExercise(currentExercise.value!);
    }
  }, 1000);
};

const nextExercise = () => {
  exerciseIndex.value = (exerciseIndex.value + 1) % articulationExercises.length;
  currentExercise.value = articulationExercises[exerciseIndex.value];
  currentPhase.value = ArticulationPhase.Demo;
  holdTimer.value = 0;
  targetsAchieved.value = false;
  currentMetrics.value = null;
};

const retryExercise = () => {
  if (!controller || !currentExercise.value) return;
  controller.reset();
  currentPhase.value = ArticulationPhase.Demo;
  holdTimer.value = 0;
  targetsAchieved.value = false;
  currentMetrics.value = null;
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  return `${seconds}s`;
};

const showVictoryDialog = async () => {
  await openModal(GameVictoryDialog, {
    score: score.value,
    onFinish: () => router.push('/'),
    onRestart: () => {
      score.value = 0;
      exerciseIndex.value = 0;
      nextExercise();
    }
  });
};

// Lifecycle
onMounted(async () => {
  currentExercise.value = articulationExercises[0];
  await initializeController();
});

onUnmounted(() => {
  if (controller) {
    controller.destroy();
  }
});
</script>

<style scoped>
.articulation-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.demo-phase {
  text-align: center;
  max-width: 500px;
}

.exercise-info {
  margin-bottom: 2rem;
}

.exercise-title {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.exercise-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.4;
}

.demo-video-container {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
}

.demo-video {
  width: 100%;
  max-width: 300px;
  height: auto;
}

.demo-placeholder {
  padding: 3rem;
  color: white;
  text-align: center;
}

.demo-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.start-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
}

.start-button:disabled {
  background: #666;
  cursor: not-allowed;
}

.wait-ready-phase {
  text-align: center;
  color: white;
}

.countdown-container {
  padding: 2rem;
}

.countdown {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #FFD700;
}

.countdown-text {
  font-size: 1.2rem;
  opacity: 0.9;
}

.exercise-phase {
  width: 100%;
  max-width: 800px;
}

.stats {
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: white;
}

.timer, .score {
  font-weight: bold;
}

.timer span, .score span {
  color: #FFD700;
}

.video-container {
  position: relative;
  margin: 1rem 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.video-feed {
  width: 100%;
  height: auto;
  display: block;
  transform: scaleX(-1); /* Mirror the video */
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.status-indicator {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  text-align: center;
}

.status-text {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  font-weight: bold;
}

.status-success .status-text {
  background: rgba(0, 255, 0, 0.8);
}

.status-fail .status-text {
  background: rgba(255, 107, 107, 0.8);
}

.metrics-display {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.metric {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: white;
}

.metric-label {
  width: 80px;
  font-size: 0.9rem;
}

.metric-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin: 0 0.5rem;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
  transition: width 0.2s ease;
}

.metric-value {
  width: 40px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: bold;
}

.result-message {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  margin: 1rem 0;
  color: white;
}

.result-message.success {
  background: rgba(76, 175, 80, 0.2);
}

.result-message.fail {
  background: rgba(255, 107, 107, 0.2);
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.next-button, .retry-button {
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.next-button:hover, .retry-button:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: white;
}

.loading-spinner, .error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.loading-spinner {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.2rem;
  opacity: 0.8;
}

.error-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ff6b6b;
}

.error-message {
  font-size: 1rem;
  margin-bottom: 2rem;
  max-width: 500px;
  line-height: 1.5;
  background: rgba(255, 107, 107, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.retry-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .metrics-display {
    padding: 0.5rem;
  }
  
  .metric-label {
    width: 60px;
    font-size: 0.8rem;
  }
  
  .loading-state, .error-state {
    padding: 2rem 1rem;
  }
  
  .loading-spinner, .error-icon {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 1.3rem;
  }
  
  .error-message {
    font-size: 0.9rem;
  }
}
</style> 