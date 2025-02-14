<template>
  <div
    ref="SwipeToCloseRef"
    v-touch:swipe.bottom="handlePan"
  >
    <slot />
  </div>
</template>

<script>
import {
  defineComponent,
} from 'vue';

export default defineComponent({
  name: 'SwipeToClose',
  emits: ['on-close'],
  setup(props, { emit }) {

    function handlePan() {
      emit('on-close')
    }

    return {
      handlePan
    }
  },
});
</script>

<style lang="scss" scoped>
.swipe-to-close {
  transition: transform 300ms;
  position: relative;

  &--swiping {
    transition: transform 0ms !important;
  }
}
</style>
