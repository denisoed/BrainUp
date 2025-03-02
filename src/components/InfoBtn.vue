<template>
  <div class="back-btn">
    <InfoIcon />
  </div>
</template>

<script setup>
import InfoIcon from '@/components/Icons/InfoIcon.vue';
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
    width: 20px;
  }
}
</style>