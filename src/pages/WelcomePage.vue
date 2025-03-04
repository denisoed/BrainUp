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
        <h1 class="welcome-title" v-html="$t('welcome.steps.step1.title', { name: userName })"></h1>
        <p class="welcome-text" v-html="$t('welcome.steps.step1.text')"></p>
        <div class="welcome-image">
          <BrainIcon />
        </div>
      </div>

      <!-- Step 2 -->
      <div class="welcome-step">
        <h2 class="welcome-title" v-html="$t('welcome.steps.step2.title')"></h2>
        <p class="welcome-text" v-html="$t('welcome.steps.step2.text')"></p>
        <div class="welcome-image">
           <!-- You can add an illustration or icon here -->
        </div>
      </div>

      <!-- Step 3 -->
      <div class="welcome-step welcome-step-3">
        <h2 class="welcome-title" v-html="$t('welcome.steps.step3.title')"></h2>
        <p class="welcome-text" v-html="$t('welcome.steps.step3.text')"></p>
        <div class="welcome-image">
          <!-- You can add an illustration or icon here -->
          <GrowIcon />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { HAS_SEEN_WELCOME_LOCAL_STORAGE_KEY } from '@/config'
import BrainIcon from '@/components/Icons/BrainIcon.vue'
import GrowIcon from '@/components/Icons/GrowIcon.vue'

const router = useRouter()
const currentStep = ref(0)
const userName = ref('')

// Constants
const TOTAL_STEPS = 3
const MIN_SWIPE_DISTANCE = 30 // minimum swipe distance in pixels
const MIN_SWIPE_SPEED = 0.5 // minimum swipe speed in pixels per millisecond

const isLastStep = computed(() => currentStep.value === TOTAL_STEPS - 1)

// Swipe handling
const touchStart = ref({ x: 0, y: 0, time: 0 })
const touchEnd = ref({ x: 0, y: 0, time: 0 })

const handleTouchStart = (event: TouchEvent) => {
  touchStart.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
    time: Date.now()
  }
  touchEnd.value = { x: 0, y: 0, time: 0 }
}

const handleTouchMove = (event: TouchEvent) => {
  touchEnd.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
    time: Date.now()
  }
}

const handleTouchEnd = () => {
  const deltaX = touchStart.value.x - touchEnd.value.x
  const deltaY = touchStart.value.y - touchEnd.value.y
  const deltaTime = touchEnd.value.time - touchStart.value.time
  const swipeSpeed = Math.abs(deltaX) / deltaTime

  // Check if swipe is horizontal enough and meets minimum speed and distance requirements
  if (
    Math.abs(deltaX) > MIN_SWIPE_DISTANCE && 
    Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && 
    swipeSpeed > MIN_SWIPE_SPEED
  ) {
    if (deltaX > 0 && currentStep.value < TOTAL_STEPS - 1) {
      // Swipe left - next step
      nextStep()
    } else if (deltaX < 0 && currentStep.value > 0) {
      // Swipe right - previous step
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

onMounted(() => {
  // Get user data from Telegram WebApp
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    userName.value = user.first_name || '';
  }
})
</script>

<style lang="scss" scoped>
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
  position: relative;
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

  :deep(span) {
    color: var(--primary);
  }
}

.welcome-image {
  width: 120%;
  position: absolute;
  top: 50%;
  left: 30%;
  opacity: 0.1;
  z-index: -1;
}

.welcome-step-3 {
  .welcome-image {
    width: 65%;
  }
}

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
  z-index: 1;
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