<template>
  <component
    :is="to ? 'router-link' : 'div'" :to="to || '/'"
    class="card"
    :class="{ locked, active }"
  >
    <div class="card-title">{{ title }}</div>
    <img v-if="icon" :src="icon" alt="icon" class="card-icon">
    <LockIcon v-if="locked" class="card-lock" />
  </component>
</template>

<script setup lang="ts">
import LockIcon from '@/components/Icons/LockIcon.vue';

defineProps({
  title: String,
  to: String,
  icon: String,
  locked: Boolean,
  active: Boolean,
});
</script>

<style lang="scss" scoped>
.card {
  min-height: 100px;
  border-radius: 12px;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
  position: relative;
  overflow: hidden;
  
  &-title {
    position: relative;
    color: var(--gray-color);
    z-index: 2;
    text-align: left;
  }

  &.locked {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
    user-select: none;
  }

  &-icon {
    width: 80px;
    height: 80px;
    position: absolute;
    bottom: 0;
    right: 10px;
    opacity: 0.4;
    z-index: 1;
  }

  &-lock {
    width: 15px;
    position: absolute;
    bottom: 16px;
    left: 16px;
    opacity: 0.5;
  }

  &.active {
    background: rgba(var(--primary-rgb), 0.1);
  	border: 1px solid var(--primary);
  }
}
</style>