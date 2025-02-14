<template>
  <div class="layout">
    <TheHeader />
    <div class="page">
      <slot />
    </div>
    <TheFooter />
    <JenesiusModal />
  </div>
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import {
  container as JenesiusModal,
  config as configDialog,
} from 'jenesius-vue-modal';

configDialog({
  animation: "slide-bottom"
})
</script>