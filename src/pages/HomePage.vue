<template>
  <div id="container">
    <CanvasBg />
    <div id="circle" @click="toggleAnimation">
      <div class="inner-circle" id="inner-circle" />
      <div class="inner-circle" id="inner-circle-2" />
      <div class="inner-circle" id="inner-circle-3" />
    </div>
    <!-- <label for="speedControl">Adjust Breathing Speed:</label>
    <input type="range" v-model="speed" min="1" max="10" step="1" />
    <label for="inhaleDelayControl">Adjust Inhale Pause Duration:</label>
    <input type="range" v-model="inhaleDelay" min="0" max="2" step="0.1" />
    <label for="exhaleDelayControl">Adjust Exhale Pause Duration:</label>
    <input type="range" v-model="exhaleDelay" min="0" max="2" step="0.1" /> -->
  </div>
</template>

<script>
import { ref, watch } from "vue";
import PlayAudio from '@/core/audio.js'

import CanvasBg from '@/components/canvasBg.vue'

export default {
  components: {
    CanvasBg,
  },
  setup() {
    const speed = ref(1);
    const inhaleDelay = ref(0);
    const exhaleDelay = ref(0);
    const ticker = ref(null);

    const scale = ref(1);
    const innerScale = ref(1);
    const growing = ref(true);
    const pause = ref(false);
    const isAnimating = ref(false);
    const intervalId = ref(null);

    const inhalePlayer = new PlayAudio('inhale.mp3');
    const exhalePlayer = new PlayAudio('exhale.mp3');
    const bgMusicPlayer = new PlayAudio('music.mp3');

    const animateBreathing = () => {
      const baseStep = 0.01 * speed.value;
      const step = baseStep * Math.max(
        0.2,
        growing.value
          ? 1 - (scale.value - 1) / 0.5
          : 1 - (1.5 - scale.value) / 0.5
      );
      const innerStep = step * 0.5;

      if (!pause.value) {
        if (growing.value) {
          scale.value += step;
          innerScale.value += Math.min(innerStep, 1.5 - innerScale.value);
          if (scale.value >= 1.5) {
            growing.value = false;
            pause.value = true;
            setTimeout(() => {
              ticker.value = 0;
              pause.value = false
            }, exhaleDelay.value * 1000);
          }
        } else {
          scale.value -= step;
          innerScale.value -= Math.min(innerStep, innerScale.value - 1);
          if (scale.value <= 1) {
            growing.value = true;
            pause.value = true;
            setTimeout(() => {
              ticker.value = 1;
              pause.value = false
            }, inhaleDelay.value * 1000);
          }
        }

        const circle = document.getElementById("circle");
        const innerCircle = document.getElementById("inner-circle");
        const innerCircle2 = document.getElementById("inner-circle-2");
        const innerCircle3 = document.getElementById("inner-circle-3");

        circle.style.transform = `scale(${scale.value})`;
        innerCircle.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
        innerCircle2.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
        innerCircle3.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
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
        innerScale.value = 1;
        clearInterval(intervalId.value);
      } else {
        isAnimating.value = true;
        bgMusicPlayer.play();
        inhalePlayer.play()
        intervalId.value = setInterval(animateBreathing, 16); // ~60 FPS
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

    return {
      speed,
      inhaleDelay,
      exhaleDelay,
      isAnimating,
      toggleAnimation
    };
  }
};
</script>

<style>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
}

#circle {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: rgba(0, 0, 255, 0.5);
  margin-bottom: 40px;
  position: relative;
}

.inner-circle {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: rgba(0, 0, 255, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
}

#inner-circle-2 {
  width: 60%;
  height: 60%;
}

#inner-circle-3 {
  width: 40%;
  height: 40%;
}

#speedControl,
#inhaleDelayControl,
#exhaleDelayControl {
  margin-top: 20px;
  width: 50%;
}
</style>
