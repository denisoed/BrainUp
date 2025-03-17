<template>
  <span>{{ displayNumber }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  value: number;
  duration?: number;
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1000,
  delay: 0
});

const displayNumber = ref(0);

/**
 * Animates a number from start to end value
 * @param start - Starting number
 * @param end - Ending number
 * @param duration - Animation duration in milliseconds
 */
function animateValue(start: number, end: number, duration: number): void {
  const startTime = performance.now();
  
  function update() {
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    
    if (elapsed < duration) {
      const progress = elapsed / duration;
      displayNumber.value = Math.round(start + (end - start) * progress);
      requestAnimationFrame(update);
    } else {
      displayNumber.value = end;
    }
  }
  
  setTimeout(() => {
    update();
  }, props.delay);
}

watch(() => props.value, (newValue) => {
  animateValue(displayNumber.value, newValue, props.duration);
});

onMounted(() => {
  animateValue(0, props.value, props.duration);
});
</script> 