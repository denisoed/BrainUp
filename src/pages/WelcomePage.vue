<template>
  <div class="container welcome-container">
    <div 
      class="welcome-slider" 
      :style="{ transform: `translateX(-${currentStep * 100}%)` }"
      v-touch:swipe="handleSwipe"
    >
      <div class="welcome-step"
        v-for="(step, index) in STEPS"
        :key="`step-${index}`"
        :class="{ 'welcome-step-active': currentStep === index }"
      >
        <h1 class="welcome-title" v-html="$t(step.title, { name: userName })"></h1>
        <p class="welcome-text" v-html="$t(step.text)"></p>
        <div class="welcome-image">
          <component :is="step.image" />
        </div>
      </div>
    </div>

    <!-- Navigation dots -->
    <div class="welcome-dots flex gap-sm justify-center items-center">
      <div
        v-for="(_, index) in STEPS"
        :key="index"
        class="welcome-dot"
        :class="{ active: currentStep === index }"
        @click="setStep(index)"
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

const STEPS = [
  {
    title: 'welcome.steps.step1.title',
    text: 'welcome.steps.step1.text',
    image: BrainIcon
  },
  {
    title: 'welcome.steps.step2.title',
    text: 'welcome.steps.step2.text',
    image: null
  },
  {
    title: 'welcome.steps.step3.title',
    text: 'welcome.steps.step3.text',
    image: null
  },
  {
    title: 'welcome.steps.step4.title',
    text: 'welcome.steps.step4.text',
    image: GrowIcon
  },
  {
    title: 'welcome.steps.step5.title',
    text: 'welcome.steps.step5.text',
    image: null
  }
]

const isLastStep = computed(() => currentStep.value === STEPS.length - 1)

// Swipe handling
const handleSwipe = (direction: string) => {
  if (direction === 'left' && currentStep.value < STEPS.length - 1) {
    nextStep()
  } else if (direction === 'right' && currentStep.value > 0) {
    previousStep()
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
  height: 100%;
  flex: 1;
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
  color: var(--white-color);
  margin-bottom: 16px;
  font-size: 32px;

  :deep(span) {
    color: var(--primary);
  }
}

.welcome-text {
  color: var(--white-color);
  font-size: 18px;
  line-height: 1.6;
  opacity: 0.8;

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