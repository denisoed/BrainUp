<template>
  <div class="container welcome-container">
    <div 
      class="welcome-slider" 
      :style="{ transform: `translateX(-${currentStep * 100}%)` }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Step 1 -->
      <div class="welcome-step">
        <h1 class="welcome-title">{{ $t('welcome.steps.step1.title') }}</h1>
        <p class="welcome-text">{{ $t('welcome.steps.step1.text') }}</p>
        <div class="welcome-image">
          <!-- You can add an illustration or icon here -->
        </div>
      </div>

      <!-- Step 2 -->
      <div class="welcome-step">
        <h2 class="welcome-title">{{ $t('welcome.steps.step2.title') }}</h2>
        <p class="welcome-text">{{ $t('welcome.steps.step2.text') }}</p>
        <div class="welcome-image">
          <!-- You can add an illustration or icon here -->
        </div>
      </div>

      <!-- Step 3 -->
      <div class="welcome-step">
        <h2 class="welcome-title">{{ $t('welcome.steps.step3.title') }}</h2>
        <p class="welcome-text">{{ $t('welcome.steps.step3.text') }}</p>
        <div class="welcome-image">
          <!-- You can add an illustration or icon here -->
        </div>
      </div>
    </div>

    <!-- Navigation dots -->
    <div class="welcome-dots flex gap-sm justify-center items-center">
      <div
        v-for="step in totalSteps"
        :key="step"
        class="welcome-dot"
        :class="{ active: currentStep === step - 1 }"
        @click="setStep(step - 1)"
      ></div>
    </div>

    <!-- Navigation buttons -->
    <div class="welcome-buttons flex justify-between items-center gap-sm">
      <button
        v-if="currentStep > 0"
        class="welcome-button welcome-back-button"
        @click="previousStep"
      >
        {{ $t('welcome.buttons.back') }}
      </button>
      <button
        class="welcome-button full-width"
        :class="{ 'ml-auto': currentStep > 0 }"
        @click="nextStep"
      >
        {{ isLastStep ? $t('welcome.buttons.start') : $t('welcome.buttons.next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { HAS_SEEN_WELCOME_LOCAL_STORAGE_KEY } from '@/config'

const router = useRouter()
const { t } = useI18n()
const currentStep = ref(0)
const totalSteps = 3

const isLastStep = computed(() => currentStep.value === totalSteps - 1)

// Swipe handling
const touchStart = ref({ x: 0, y: 0 })
const touchEnd = ref({ x: 0, y: 0 })
const minSwipeDistance = 50 // минимальное расстояние для свайпа

const handleTouchStart = (event: TouchEvent) => {
  touchStart.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }
  touchEnd.value = { x: 0, y: 0 }
}

const handleTouchMove = (event: TouchEvent) => {
  touchEnd.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }
}

const handleTouchEnd = () => {
  const deltaX = touchStart.value.x - touchEnd.value.x
  const deltaY = touchStart.value.y - touchEnd.value.y

  // Проверяем, что свайп был достаточно длинным и более горизонтальный, чем вертикальный
  if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && currentStep.value < totalSteps - 1) {
      // Свайп влево - следующий шаг
      nextStep()
    } else if (deltaX < 0 && currentStep.value > 0) {
      // Свайп вправо - предыдущий шаг
      previousStep()
    }
  }
}

const setStep = (step: number) => {
  currentStep.value = step
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const nextStep = () => {
  if (isLastStep.value) {
    // Save to localStorage that user has seen the welcome page
    localStorage.setItem(HAS_SEEN_WELCOME_LOCAL_STORAGE_KEY, 'true')
    // Redirect to home page
    router.push('/')
  } else {
    currentStep.value++
  }
}
</script>

<style scoped>
.welcome-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 16px;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
}

.welcome-slider {
  display: flex;
  transition: transform 0.3s ease;
  flex: 1;
  touch-action: none;
  user-select: none;
}

.welcome-step {
  min-width: 100%;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.welcome-title {
  color: var(--primary);
  margin-bottom: 16px;
  font-size: 2em;
}

.welcome-text {
  color: var(--white-color);
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* .welcome-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  margin: 32px 0;
} */

.welcome-button {
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
}

.welcome-back-button {
  width: 100px;
  background: var(--white-color);
}

.welcome-dots {
  margin: 24px 0;
}

.welcome-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--gray-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.welcome-dot.active {
  background-color: var(--primary);
  transform: scale(1.2);
}

.welcome-buttons {
  margin-top: 24px;
}
</style> 