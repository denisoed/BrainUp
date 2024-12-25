<template>
  <div id="container">
    <CanvasBg />
    <div ref="circleRef" class="circle" @click="toggleAnimation">
      <div class="inner-circle" ref="innerCircleRef" />
      <div class="inner-circle inner-circle-2" ref="innerCircle2Ref" />
      <div class="inner-circle inner-circle-3" ref="innerCircle3Ref" />
    </div>
    <!-- <label for="speedControl">Inhale Speed:</label>
    <input type="range" v-model="inhaleSpeed" min="1" max="10" step="1" />
    <label for="speedControl">Exhale Speed:</label>
    <input type="range" v-model="exhaleSpeed" min="1" max="10" step="1" />
    <label for="inhaleDelayControl">Adjust Inhale Pause Duration:</label>
    <input type="range" v-model="inhaleDelay" min="0" max="5" step="1" />
    <label for="exhaleDelayControl">Adjust Exhale Pause Duration:</label>
    <input type="range" v-model="exhaleDelay" min="0" max="5" step="1" /> -->
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import PlayAudio from '@/core/audio.js'
import CanvasBg from '@/components/canvasBg.vue'

export default {
  components: {
    CanvasBg,
  },
  setup() {
    const inhaleSpeed = ref(3); // Time for inhale in seconds
    const exhaleSpeed = ref(3); // Time for exhale in seconds
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
    const bgMusicPlayer = new PlayAudio('music.mp3', {
      volume: 0.2,
      loop: true
    });

    const circleRef = ref();
    const innerCircleRef = ref();
    const innerCircle2Ref = ref();
    const innerCircle3Ref = ref();

    function changeCircles() {
      circleRef.value.style.transform = `scale(${scale.value})`;
      innerCircleRef.value.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
      innerCircle2Ref.value.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
      innerCircle3Ref.value.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
    }

    const animateBreathing = () => {
      const step = growing.value
        ? (0.5 / (inhaleSpeed.value * 60)) // Inhale step
        : (0.5 / (exhaleSpeed.value * 60)); // Exhale step
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
              pause.value = false;
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
              pause.value = false;
            }, inhaleDelay.value * 1000);
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
        innerScale.value = 1;
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

    return {
      inhaleSpeed,
      exhaleSpeed,
      inhaleDelay,
      exhaleDelay,
      isAnimating,
      toggleAnimation,

      circleRef,
      innerCircleRef,
      innerCircle2Ref,
      innerCircle3Ref
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

.circle {
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

.inner-circle-2 {
  width: 60%;
  height: 60%;
}

.inner-circle-3 {
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
