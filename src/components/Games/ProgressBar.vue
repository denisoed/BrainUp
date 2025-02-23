<template>
  <div class="progress-bar">
    <div 
      class="progress-fill"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100
  }
});
</script>

<style scoped lang="scss">
.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 8px 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  transition: width 0.1s linear;
}
</style> 