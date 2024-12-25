<template>
  <div class="container">
    <CanvasBg />
    <div ref="circleRef" class="circle" @click="toggleAnimation">
      <div class="inner-circle" ref="innerCircleRef" />
    </div>
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
    const breathingConfig = ref({
      loop: false,
      cycles: [
        { inhaleSpeed: 2, inhaleDelay: 0, exhaleSpeed: 2, exhaleDelay: 0 },
        { inhaleSpeed: 2, inhaleDelay: 0, exhaleSpeed: 2, exhaleDelay: 0 }
      ]
    });

    const currentCycleIndex = ref(0);
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

    function changeCircles() {
      circleRef.value.style.transform = `scale(${scale.value})`;
      innerCircleRef.value.style.transform = `translate(-50%, -50%) scale(${innerScale.value})`;
    }

    const animateBreathing = () => {
      const currentCycle = breathingConfig.value.cycles[currentCycleIndex.value];

      const step = growing.value
        ? (0.5 / (currentCycle.inhaleSpeed * 60)) // Inhale step
        : (0.5 / (currentCycle.exhaleSpeed * 60)); // Exhale step
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
            }, currentCycle.exhaleDelay * 1000);
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

              // Move to the next cycle or stop if loop is disabled
              if (currentCycleIndex.value + 1 < breathingConfig.value.cycles.length) {
                currentCycleIndex.value += 1;
              } else if (breathingConfig.value.loop) {
                currentCycleIndex.value = 0;
              } else {
                toggleAnimation(); // Stop animation
              }
            }, currentCycle.inhaleDelay * 1000);
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

        // const currentCycle = breathingConfig.value.cycles[currentCycleIndex.value];
        // Set initial rates for inhale and exhale sounds
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

    return {
      breathingConfig,
      isAnimating,
      toggleAnimation,

      circleRef,
      innerCircleRef,
    };
  }
};
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

.circle {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: $circle-color;
  position: relative;
}

.inner-circle {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: $circle-color;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
}
</style>
