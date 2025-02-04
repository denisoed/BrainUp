<template>
  <div class="item-page page">

    <router-link to="/exercises" class="back-btn">
      <img src="@/assets/burger-menu-right.svg" alt="Back" />
    </router-link>

    <div class="flex">
      <button @click="runBreathe">Start breathe</button>
      <button @click="pauseBreathing">Pause</button>
      <button @click="stopBreathing">Stop</button>
    </div>

    <!-- Info 1 -->
    <div class="info">
      <div class="name">{{ breathingConfig.title }}</div>
      <div class="action">Exhale 3 seconds...</div>
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
      <div class="label">Repeats</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import PlayAudio from '@/core/audio.js';
import BreatheAudioController from '@/core/breatheAudioController.ts';
import { useRoute } from 'vue-router';
import BlobCircles from '@/components/BlobCircles.vue';

// ----------- V2 ----------- //
const isPaused = ref(false);
const isStopped = ref(false);

const serverData = {
  inhale: { speed: 3, hold: 1 },
  exhale: { speed: 4, hold: 2 },
  repeat: 2,
};

function pauseBreathing() {
  isPaused.value = !isPaused.value;
}

function stopBreathing() {
  isStopped.value = true;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForResume() {
  while (isPaused.value) {
    await delay(10000);
  }
}

async function simulateBreathing(params, onPhaseChange) {
  const { inhale, exhale, repeat } = params;

  for (let i = 0; i < repeat; i++) {
    if (isStopped.value) return;

    onPhaseChange?.('inhale', inhale.speed, i);
    await waitForResume();
    await delay(inhale.speed * 1000);

    if (inhale.hold > 0) {
      onPhaseChange?.('inhale-hold', inhale.hold, i);
      await waitForResume();
      await delay(inhale.hold * 1000);
    }

    onPhaseChange?.('exhale', exhale.speed, i);
    await waitForResume();
    await delay(exhale.speed * 1000);

    if (exhale.hold > 0) {
      onPhaseChange?.('exhale-hold', exhale.hold, i);
      await waitForResume();
      await delay(exhale.hold * 1000);
    }
  }

  onPhaseChange?.('done');
}


async function animateIncrease(start, end, duration, onUpdate) {
  let startTime = performance.now();

  function step(currentTime) {
    if (isStopped.value) return;
    if (isPaused.value) {
      requestAnimationFrame(step);
      return;
    }

    let elapsedTime = (currentTime - startTime) / 1000;
    let progress = Math.min(elapsedTime / duration, 1);
    let value = start + (end - start) * progress;
    
    onUpdate(value);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function animateDecrease(start, end, duration, onUpdate) {
  let startTime = performance.now();

  function step(currentTime) {
    if (isStopped.value) return;
    if (isPaused.value) {
      requestAnimationFrame(step);
      return;
    }

    let elapsedTime = (currentTime - startTime) / 1000;
    let progress = Math.min(elapsedTime / duration, 1);
    let value = start - (start - end) * progress;

    onUpdate(value);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function runBreathe() {
  simulateBreathing(serverData, (phase, speed, cycle) => {
    switch (phase) {
      case 'inhale':
        console.log(`Вдох (#${cycle + 1})`);
        animateIncrease(0, 100, speed, (scale) => {
          console.log('Scale:', scale);
        });
        break;
      case 'inhale-hold':
        console.log(`Задержка после вдоха (#${cycle + 1})`);
        break;
      case 'exhale':
        console.log(`Выдох (#${cycle + 1})`);
        animateDecrease(100, 0, speed, (scale) => {
          console.log('Scale:', scale);
        })
        break;
      case 'exhale-hold':
        console.log(`Задержка после выдоха (#${cycle + 1})`);
        break;
      case 'done':
        console.log("Дыхательный цикл завершён.");
        break;
    }
  });
}
// --------------------------------------------- //

const LIST_BREATHING = {
  ['antistress']: {
    title: 'Antistress',
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
    title: 'Box',
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

const breathingConfig = LIST_BREATHING[route.params.type as keyof typeof LIST_BREATHING];

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
const circleRef = ref();
const innerCircleRef = ref();

const beforeStartMetronome = new PlayAudio('before-start-metronome.mp3');
const bgMusicPlayer = new PlayAudio('music.mp3', {
  volume: 0.2,
  loop: true
});
const breatheAudioController = new BreatheAudioController('inhale2.mp3', 'exhale.mp3');


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
    intervalId.value = setInterval(animateBreathing, 1000 / 60); // 60 FPS
  }
};

function runMetronome(callback: () => any) {
  beforeStartMetronome.play();
  setTimeout(() => {
    metronomeStartTimer.value -= 1;
  }, 1000);
  setTimeout(() => {
    metronomeStartTimer.value -= 1;
    callback();
  }, 2000);
}

function startBreathe() {
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-family: Arial, sans-serif;
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
  color: #3c3c4c;
  z-index: 2;
  margin-top: 80px;

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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 2;
  margin-bottom: 80px;

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

  .cycle-counter {
    color: #3c3c4c;
    font-size: 60px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
}

.box {
  border-radius: 16px;

  .inner-circle {
    border-radius: 16px;
  }
}

.cycle-timer {
  color: #3c3c4c;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.8;
}
</style>
