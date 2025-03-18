<template>
  <div class="layout">
    <div class="page">
      <slot />
    </div>
    <TheFooter />
  </div>
</template>

<script setup>
import TheFooter from '@/components/TheFooter.vue';
</script>