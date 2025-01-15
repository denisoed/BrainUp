<template>
  <div class="container">
    <div class="info">
      <div class="name">Antistress</div>
      <div class="action">Exhale 3 seconds...</div>
      <!-- <span>Cycles: {{ currentCycleIndex + 1 }} / {{ breathingConfig.cycles.length }}</span>
      <span>Repeats: {{ currentRepeatCount + 1 }} / {{ breathingConfig.cycles[currentCycleIndex].repeat }}</span> -->
    </div>
    <div ref="circleRef" class="circle" @click="startBreathe">
      <div class="inner-circle" ref="innerCircleRef">
        <div class="cycle-counter">{{ currentRepeatCount + 1 }}</div>
      </div>
      <div
        v-if="typeof metronomeStartTimer === 'number'"
        class="cycle-timer"
      >{{ `00:0${metronomeStartTimer}` }}</div>
    </div>
    <div class="info-2">
      <div class="value">{{ currentRepeatCount + 1 }} / {{ breathingConfig.cycles[currentCycleIndex].repeat }}</div>
      <div class="label">Repeats</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import PlayAudio from '@/core/audio.js';
import BreatheAudioController from '@/core/breatheAudioController.ts';

const breathingConfig = ref({
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
});

const currentCycleIndex = ref(0);
const currentRepeatCount = ref(0);
const currentBreathCount = ref(0);

const scale = ref(1);
const innerScale = ref(0);
const growing = ref(true);
const pause = ref(false);
const isAnimating = ref(false);
const intervalId = ref();
const metronomeStartTimer = ref<number | null>(null);

const metronomeMusicPlayer = new PlayAudio('metronome-exhale.mp3');
const bgMusicPlayer = new PlayAudio('music.mp3', {
  volume: 0.2,
  loop: true
});
const breatheAudioController = new BreatheAudioController('inhale2.mp3', 'exhale.mp3');

const circleRef = ref();
const innerCircleRef = ref();

function changeCircles() {
  circleRef.value.style.transform = `scale(${scale.value})`;
  innerCircleRef.value.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
}

function calculateStep(speed) {
  return (0.5 / (speed * 60));
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
      setTimeout(() => handleCycleCompletion(currentCycle), currentCycle.exhale.delay * 1000);
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
      if (currentCycleIndex.value + 1 < breathingConfig.value.cycles.length) {
        breatheAudioController.playInhale(currentCycle.inhale.speed);
        currentCycleIndex.value += 1;
      } else if (breathingConfig.value.loop) {
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
  const currentCycle = breathingConfig.value.cycles[currentCycleIndex.value];
  if (!pause.value) {
    if (growing.value) {
      handleInhaleStep(currentCycle);
    } else {
      handleExhaleStep(currentCycle);
    }
    changeCircles();
  }
};

const toggleAnimation = () => {
  if (isAnimating.value) {
    isAnimating.value = false;
    bgMusicPlayer.stop();
    scale.value = 1;
    innerScale.value = 0;
    currentCycleIndex.value = 0;
    currentBreathCount.value = 0;
    clearInterval(intervalId.value);
    changeCircles();
  } else {
    isAnimating.value = true;
    bgMusicPlayer.play();
    breatheAudioController.playInhale(breathingConfig.value.cycles[0].inhale.speed);
    intervalId.value = setInterval(animateBreathing, 1000 / 60); // 60 FPS
  }
};

function startBreathe() {
  if (isAnimating.value) {
    toggleAnimation();
    return;
  }
  metronomeStartTimer.value = 4;
  metronomeStartTimer.value -= 1;
  metronomeMusicPlayer.play();
  setTimeout(() => {
    metronomeStartTimer.value -= 1;
    metronomeMusicPlayer.play();
  }, 1000);
  setTimeout(() => {
    metronomeStartTimer.value -= 1;
    metronomeMusicPlayer.play();
  }, 2000);
  setTimeout(() => {
    metronomeStartTimer.value -= 1;
    metronomeMusicPlayer.play();
    setTimeout(() => {
      toggleAnimation();
      metronomeStartTimer.value = null;
    }, 1000);
  }, 3000);
}

onBeforeMount(() => {
  breatheAudioController.initialize();
});

onMounted(() => {
  changeCircles();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.canvas-bg {
  z-index: -1;
}

.info {
  width: 100%;
  position: fixed;
  top: 10%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  font-size: 16px;
  color: #3c3c4c;
  padding: 8px 12px;
  transform: translateX(-50%);

  .name {
    font-size: 30px;
    color: #3c3c4c;
    font-weight: bold;
  }

  .action {
    font-size: 14px;
    color: #3c3c4c;
  }
}

.info-2 {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .label {
    font-size: 14px;
    color: #3c3c4c;
  }

  .value {
    font-size: 24px;
    color: #3c3c4c;
    font-weight: bold;
  }
}

.circle {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: #c3c2dd;
  position: relative;
}

.inner-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #9b9bc6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);

  .cycle-counter {
    color: white;
    font-size: 60px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
}

.cycle-timer {
  color: white;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.8;
}
</style>
