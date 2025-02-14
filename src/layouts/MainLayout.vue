<template>
  <div class="layout">
    <TheHeader />
    <div class="page">
      <slot />
    </div>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>