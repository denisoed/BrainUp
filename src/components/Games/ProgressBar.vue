<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: `${progress}%`, backgroundColor: getColor() }"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  progress: number;
}>();

function getColor() {
  if (props.progress > 60) return '#4CAF50';
  if (props.progress > 30) return '#FFC107';
  return '#F44336';
}
</script>

<style scoped lang="scss">
.progress-container {
  width: 100%;
  height: 8px;
  background-color: var(--card-bg);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.1s linear, background-color 0.3s ease;
}
</style> 