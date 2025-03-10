<template>
  <div class="layout">
    <div class="page">
      <slot />
    </div>
    <TheFooter />
    <JenesiusModal />
  </div>
</template>

<script setup>
import TheFooter from '@/components/TheFooter.vue';
import {
  container as JenesiusModal,
  config as configDialog,
} from 'jenesius-vue-modal';

configDialog({
  animation: "slide-bottom"
})
</script>