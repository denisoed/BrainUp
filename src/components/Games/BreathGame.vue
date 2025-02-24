<template>
  <div class="item-page">

    <!-- Info 1 -->
    <div class="info">
      <div class="name">{{ breathingConfig.title }}</div>
      <div class="description">{{ breathingConfig.description }}</div>
      <!-- <span>Cycles: {{ currentCycleIndex + 1 }} / {{ breathingConfig.cycles.length }}</span>
      <span>Repeats: {{ currentRepeatCount + 1 }} / {{ breathingConfig.cycles[currentCycleIndex].repeat }}</span> -->
    </div>

    <!-- Circles -->
    <div class="circle-container">
      <div ref="circleRef" class="circle" :class="[breathingConfig.class]" @click="startBreathe">
        <div class="inner-circle" ref="innerCircleRef">
          <div class="cycle-counter">{{ currentRepeatCount + 1 }}</div>
        </div>
        <BlobCircles />
        <div
          v-if="typeof metronomeStartTimer === 'number'"
          class="cycle-timer"
        >{{ `00:0${metronomeStartTimer}` }}</div>
        <img v-else-if="!isAnimating" class="play-icon" src="@/assets/play-icon.svg" alt="Play" />
      </div>
    </div>

    <!-- Info 2 -->
    <div class="info-2">
      <div class="value">{{ currentRepeatCount + 1 }} / {{ breathingConfig.cycles[currentCycleIndex].repeat }}</div>
      <div class="label">{{ t('games.breath.actions.repeats') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import PlayAudio from '@/core/audio.js';
import BreatheAudioController from '@/core/breatheAudioController.ts';
import { useRoute } from 'vue-router';
import BlobCircles from '@/components/BlobCircles.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const LIST_BREATHING = {
  ['antistress']: {
    title: t('games.breath.types.antistress.title'),
    description: t('games.breath.types.antistress.description'),
    class: 'antistress',
    loop: false,
    cycles: [
      {
        inhale: {
          duration: 1,
          delay: 1,
          speed: 2
        },
        exhale: {
          duration: 1,
          delay: 1,
          speed: 3
        },
        repeat: 20,
        pause: 0
      }
    ]
  },
  ['box']: {
    title: t('games.breath.types.box.title'),
    description: t('games.breath.types.box.description'),
    class: 'box',
    loop: false,
    cycles: [
      {
        inhale: {
          duration: 1,
          delay: 4,
          speed: 4
        },
        exhale: {
          duration: 1,
          delay: 4,
          speed: 4
        },
        repeat: 20,
        pause: 0
      }
    ]
  }
};

const route = useRoute();

const breathingConfig = LIST_BREATHING[route.params.type as keyof typeof LIST_BREATHING || 'antistress'];

const currentCycleIndex = ref(0);
const currentRepeatCount = ref(0);
const currentBreathCount = ref(0);
const scale = ref(1);
const innerScale = ref(0);
const growing = ref(true);
const pause = ref(false);
const isAnimating = ref(false);
const isPlaying = ref(false);
const intervalId = ref();
const metronomeStartTimer = ref<number | null>(null);
const circleRef = ref();
const innerCircleRef = ref();

const bgMusicPlayer = new PlayAudio('music.mp3', {
  volume: 0.2,
  loop: true
});
const breatheAudioController = new BreatheAudioController('inhale2.mp3', 'exhale.mp3');


function changeCircles() {
  requestAnimationFrame(() => {
    if (circleRef.value && innerCircleRef.value) {
      circleRef.value.style.transform = `scale(${scale.value})`;
      innerCircleRef.value.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
    }
  });
}

function calculateStep(speed: number) {
  return (0.5 / (speed * 120));
}

function handleInhaleStep(currentCycle) {
  const step = calculateStep(currentCycle.inhale.speed);
  const innerStep = 1 / (currentCycle.inhale.speed * 60);
  scale.value += step;
  innerScale.value += innerStep;
  if (scale.value >= 1.5) {
    if (currentBreathCount.value + 1 >= currentCycle.inhale.duration) {
      growing.value = false;
      pause.value = true;
      setTimeout(() => {
        breatheAudioController.playExhale(currentCycle.exhale.speed);
        pause.value = false;
      }, currentCycle.inhale.delay * 1000);
    } else {
      scale.value = 1;
      innerScale.value = 0;
      currentBreathCount.value += 1;
      breatheAudioController.playInhale(currentCycle.inhale.speed);
    }
  }
}

function handleExhaleStep(currentCycle) {
  const step = calculateStep(currentCycle.exhale.speed);
  const innerStep = 1 / (currentCycle.exhale.speed * 60);
  scale.value -= step;
  innerScale.value -= innerStep;
  if (scale.value <= 1) {
    currentBreathCount.value += 1;
    if (currentBreathCount.value >= currentCycle.exhale.duration) {
      currentBreathCount.value = 0;
      growing.value = true;
      pause.value = true;
      setTimeout(() => {
        handleCycleCompletion(currentCycle);
      }, currentCycle.exhale.delay * 1000);
    } else {
      scale.value = 1.5; // Reset scale for partial exhales
      innerScale.value = 1;
      breatheAudioController.playExhale(currentCycle.exhale.speed);
    }
  }
}

function handleCycleCompletion(currentCycle) {
  if (currentRepeatCount.value + 1 >= currentCycle.repeat) {
    setTimeout(() => {
      pause.value = false;
      currentRepeatCount.value = 0;
      if (currentCycleIndex.value + 1 < breathingConfig.cycles.length) {
        breatheAudioController.playInhale(currentCycle.inhale.speed);
        currentCycleIndex.value += 1;
      } else if (breathingConfig.loop) {
        breatheAudioController.playInhale(currentCycle.inhale.speed);
        currentCycleIndex.value = 0;
      } else {
        toggleAnimation();
      }
    }, currentCycle.pause * 1000);
  } else {
    breatheAudioController.playInhale(currentCycle.inhale.speed);
    pause.value = false;
    currentRepeatCount.value += 1;
  }
}

const animateBreathing = () => {
  const currentCycle = breathingConfig.cycles[currentCycleIndex.value];
  if (!pause.value) {
    if (growing.value) {
      handleInhaleStep(currentCycle);
    } else {
      handleExhaleStep(currentCycle);
    }
    changeCircles();
  }
};

const stopAnimation = () => {
  isAnimating.value = false;
  isPlaying.value = false;
  bgMusicPlayer.stop();
  breatheAudioController.stopAllSounds();
  scale.value = 1;
  innerScale.value = 0;
  currentCycleIndex.value = 0;
  currentBreathCount.value = 0;
  clearInterval(intervalId.value);
};

const toggleAnimation = () => {
  if (isAnimating.value) {
    stopAnimation();
    changeCircles();
  } else {
    isAnimating.value = true;
    bgMusicPlayer.play();
    breatheAudioController.playInhale(breathingConfig.cycles[0].inhale.speed);
    intervalId.value = setInterval(animateBreathing, 1000 / 120);
  }
};

function runMetronome(callback: () => any) {
  setTimeout(() => {
    if (metronomeStartTimer.value !== null) {
      metronomeStartTimer.value -= 1;
    }
  }, 1000);
  setTimeout(() => {
    if (metronomeStartTimer.value !== null) {
      metronomeStartTimer.value -= 1;
    }
    callback();
  }, 2000);
}

function startBreathe() {
  if (isPlaying.value) return;
  isPlaying.value = true;
  if (isAnimating.value) {
    toggleAnimation();
    return;
  }
  metronomeStartTimer.value = 4;
  metronomeStartTimer.value -= 1;
  runMetronome(() => {
    setTimeout(() => {
      toggleAnimation();
      metronomeStartTimer.value = null;
    }, 1000);
  });
}

onBeforeMount(() => {
  breatheAudioController.initialize();
});

onMounted(() => {
  changeCircles();
});

onUnmounted(() => {
  stopAnimation();
});
</script>

<style lang="scss" scoped>
.item-page {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  width: 30px;
  height: 30px;
  
  img {
    width: 100%;
    display: block;
  }
}

.info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  font-size: 16px;
  color: var(--white-color);
  z-index: 2;
  margin-top: 80px;

  .name {
    font-size: 30px;
    color: var(--white-color);
    font-weight: bold;
  }

  .description {
    max-width: 300px;
    text-align: center;
    font-size: 14px;
    opacity: 0.8;
    color: var(--white-color);
  }
}

.info-2 {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 2;
  margin-bottom: 50px;

  .label {
    font-size: 14px;
    color: var(--white-color);
  }

  .value {
    font-size: 24px;
    color: var(--white-color);
    font-weight: bold;
  }
}

.circle-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.circle {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: transparent;
  position: relative;
  z-index: 1;

  .play-icon {
    width: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
  }
}

.inner-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  transition: transform 0.016s linear;

  .cycle-counter {
    color: var(--white-color);
    font-size: 50px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
    transition: transform 0.016s linear;
  }
}

.box {
  border-radius: 16px;

  .inner-circle {
    border-radius: 16px;
  }
}

.cycle-timer {
  color: var(--white-color);
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.8;
}
</style>
