<template>
  <div class="button" :class="{ 'button--disabled': disabled }">
    <div v-if="loading" class="button-loader-wrapper">
      <div class="button-loader" />
    </div>
    <div class="button-slot" :class="{ 'button-slot--loading': loading }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
.button {
  position: relative;

  &-loader {
    width: 20px;
    height: 20px;
    border: 3px solid #222;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;

    &-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &-slot {
    &--loading {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  } 
}
</style>