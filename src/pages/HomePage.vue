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
import { onMounted, ref, watch } from 'vue';
import PlayAudio from '@/core/audio.js';
import CanvasBg from '@/components/canvasBg.vue';

const breathingConfig = ref({
  loop: true,
  cycles: [
    {
      inhale: {
        duration: 4,
        delay: 3,
        speed: 1
      },
      exhale: {
        duration: 6,
        delay: 0,
        speed: 1
      },
      repeat: 3,
      pause: 5
    }
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

function calculateStep(speed) {
  return (0.5 / (speed * 60));
}

function handleInhaleStep(currentCycle) {
  const step = calculateStep(currentCycle.inhale.speed);
  const innerStep = 1 / (currentCycle.inhale.speed * 60);
  scale.value += step;
  innerScale.value += innerStep;
  if (scale.value >= 1.5) {
    growing.value = false;
    pause.value = true;
    setTimeout(() => {
      ticker.value = 0;
      pause.value = false;
    }, currentCycle.inhale.delay * 1000);
  }
}

function handleExhaleStep(currentCycle) {
  const step = calculateStep(currentCycle.exhale.speed);
  const innerStep = 1 / (currentCycle.exhale.speed * 60);
  scale.value -= step;
  innerScale.value -= innerStep;
  if (scale.value <= 1) {
    growing.value = true;
    pause.value = true;
    setTimeout(() => handleCycleCompletion(currentCycle), currentCycle.exhale.delay * 1000);
  }
}

function handleCycleCompletion(currentCycle) {
  if (currentRepeatCount.value + 1 >= currentCycle.repeat) {
    setTimeout(() => {
      ticker.value = 1;
      pause.value = false;
      currentRepeatCount.value = 0;
      if (currentCycleIndex.value + 1 < breathingConfig.value.cycles.length) {
        currentCycleIndex.value += 1;
      } else if (breathingConfig.value.loop) {
        currentCycleIndex.value = 0;
      } else {
        toggleAnimation();
      }
    }, currentCycle.pause * 1000);
  } else {
    ticker.value = 1;
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
    inhalePlayer.play();
    intervalId.value = setInterval(animateBreathing, 1000 / 60); // 60 FPS
  }
};

watch(ticker, (tick) => {
  if (tick === 1) {
    exhalePlayer.stop();
    inhalePlayer.play();
  }
  if (tick === 0) {
    inhalePlayer.stop();
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
