<template>
  <div class="layout">
    <div class="page">
      <TheHeader />
      <slot />
    </div>
  </div>
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
</script>