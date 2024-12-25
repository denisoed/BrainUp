<template>
  <div class="container">
    <CanvasBg class="canvas-bg" />
    <div class="info">
      <span>Cycles: {{ currentCycleIndex + 1 }} / {{ breathingConfig.cycles.length }}</span>
      <span>Repeats: {{ currentRepeatCount + 1 }} / {{ breathingConfig.cycles[currentCycleIndex].repeat }}</span>
    </div>
    <div ref="circleRef" class="circle" @click="toggleAnimation">
      <div class="inner-circle" ref="innerCircleRef">
        <div class="cycle-counter">{{ currentRepeatCount + 1 }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import PlayAudio from '@/core/audio.js'
import CanvasBg from '@/components/canvasBg.vue'

const breathingConfig = ref({
  loop: false,
  cycles: [
    { inhaleSpeed: 2, inhaleDelay: 0, exhaleSpeed: 2, exhaleDelay: 0, repeat: 10 },
    { inhaleSpeed: 2, inhaleDelay: 0, exhaleSpeed: 2, exhaleDelay: 0, repeat: 10 }
  ]
});

const currentCycleIndex = ref(0);
const currentRepeatCount = ref(0);
const ticker = ref<number | null>(null);

const scale = ref(1);
const innerScale = ref(0);
const growing = ref(true);
const pause = ref(false);
const isAnimating = ref(false);
const intervalId = ref();

const inhalePlayer = new PlayAudio('inhale2.mp3');
const exhalePlayer = new PlayAudio('exhale2.mp3');
const bgMusicPlayer = new PlayAudio('music.mp3', {
  volume: 0.2,
  loop: true
});

const circleRef = ref();
const innerCircleRef = ref();

function changeCircles() {
  circleRef.value.style.transform = `scale(${scale.value})`;
  innerCircleRef.value.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
}

const animateBreathing = () => {
  const currentCycle = breathingConfig.value.cycles[currentCycleIndex.value];

  const step = growing.value
    ? (0.5 / (currentCycle.inhaleSpeed * 60)) // Inhale step
    : (0.5 / (currentCycle.exhaleSpeed * 60)); // Exhale step
  const innerStep = growing.value
    ? (1 / (currentCycle.inhaleSpeed * 60)) // Inner circle grows fully
    : (1 / (currentCycle.exhaleSpeed * 60)); // Inner circle shrinks fully

  if (!pause.value) {
    if (growing.value) {
      scale.value += step;
      innerScale.value += innerStep; // Grow inner circle
      if (scale.value >= 1.5) {
        growing.value = false;
        pause.value = true;
        setTimeout(() => {
          ticker.value = 0;
          pause.value = false;
        }, currentCycle.inhaleDelay * 1000);
      }
    } else {
      scale.value -= step;
      innerScale.value -= innerStep; // Shrink inner circle
      if (scale.value <= 1) {
        growing.value = true;
        pause.value = true;
        setTimeout(() => {
          ticker.value = 1;
          pause.value = false;
          currentRepeatCount.value += 1;
          if (currentRepeatCount.value >= currentCycle.repeat) {
            currentRepeatCount.value = 0;
            if (currentCycleIndex.value + 1 < breathingConfig.value.cycles.length) {
              currentCycleIndex.value += 1;
            } else if (breathingConfig.value.loop) {
              currentCycleIndex.value = 0;
            } else {
              toggleAnimation();
            }
          }
        }, currentCycle.exhaleDelay * 1000);
      }
    }

    changeCircles(); 
  }
};

const toggleAnimation = () => {
  if (isAnimating.value) {
    isAnimating.value = false;
    bgMusicPlayer.stop();
    inhalePlayer.stop();
    exhalePlayer.stop();
    scale.value = 1;
    ticker.value = null;
    innerScale.value = 0;
    currentCycleIndex.value = 0;
    clearInterval(intervalId.value);
  } else {
    isAnimating.value = true;
    bgMusicPlayer.play();

    // Set initial rates for inhale and exhale sounds
    // const currentCycle = breathingConfig.value.cycles[currentCycleIndex.value];
    // inhalePlayer.rate(1 / currentCycle.inhaleSpeed);
    // exhalePlayer.rate(1 / currentCycle.exhaleSpeed);

    inhalePlayer.play();
    intervalId.value = setInterval(animateBreathing, 1000 / 60); // 60 FPS
  }
};

watch(ticker, (tick) => {
  // const currentCycle = breathingConfig.value.cycles[currentCycleIndex.value];

  if (tick === 1) {
    exhalePlayer.stop();
    // inhalePlayer.rate(1 / currentCycle.inhaleSpeed);
    inhalePlayer.play();
  }
  if (tick === 0) {
    inhalePlayer.stop();
    // exhalePlayer.rate(1 / currentCycle.exhaleSpeed);
    exhalePlayer.play();
  }
});

onMounted(() => {
  changeCircles();
});
</script>

<style lang="scss" scoped>
$circle-color: rgba(0, 0, 255, 0.5);

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
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: white;
  padding: 8px 12px;
}

.circle {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: $circle-color;
  position: relative;
}

.inner-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: $circle-color;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);

  .cycle-counter {
    color: white;
    font-size: 80px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
}
</style>
