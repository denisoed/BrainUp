<template>
  <div class="back-btn">
    <ChevronLeftIcon />
  </div>
</template>

<script setup>
import ChevronLeftIcon from '@/components/Icons/ChevronLeftIcon.vue';
</script>

<style lang="scss" scoped>
.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 8px;
  }
}
</style>