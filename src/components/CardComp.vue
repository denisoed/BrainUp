<template>
  <router-link :to="to || '/'" class="card">
    <div class="card-title">{{ title }}</div>
    <img v-if="icon" :src="icon" alt="icon" class="card-icon">
  </router-link>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  to: String,
  icon: String,
});
</script>

<style lang="scss" scoped>
.card {
  min-height: 100px;
  border-radius: 12px;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px;
  color: #fff;
  position: relative;
  overflow: hidden;

  .card-icon {
    width: 120px;
    height: 120px;
    position: absolute;
    bottom: -40px;
    right: -20px;
    opacity: 0.1;
  }
}
</style>