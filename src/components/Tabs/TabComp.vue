<template>
  <div class="tab" :class="{ 'tab--active': active }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  active: Boolean,
});
</script>

<style lang="scss" scoped>
.tab {
  padding: 6px 12px;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  line-height: normal;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);

  &.tab--active {
    background-color: #fff;
    color: #212121;
  }
}
</style>