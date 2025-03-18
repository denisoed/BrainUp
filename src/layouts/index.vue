<template>
  <component :is="$route.meta.layoutComponent">
    <slot />
  </component>
  <JenesiusModal />
</template>

<script setup>
import {
  container as JenesiusModal,
  config as configDialog,
} from 'jenesius-vue-modal';

configDialog({
  animation: "slide-bottom"
})
</script>
