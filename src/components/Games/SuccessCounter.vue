<script setup>
import { watch, ref } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  show: {
    type: Boolean,
    default: false
  }
})

const pulse = ref(false);
const pulseTimer = ref(0);

watch(() => props.value, () => {
  pulse.value = false;
  if (props.value > 2) {
    if (pulseTimer.value) {
      clearTimeout(pulseTimer.value);
    }
    pulse.value = true;
    pulseTimer.value = setTimeout(() => {
      pulse.value = false;
    }, 300);
  }
});
</script>

<template>
  <div class="success-counter" :class="{ 'success-counter--active': show }">
    <div class="success-counter-text" :class="{ pulse }">
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.success-counter {
  position: fixed;
  bottom: 85px;
  left: -80px;
  transform: translateY(-50%);
  border-radius: 10px;
  color: var(--white-color);
  z-index: 2;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-shadow: 0 0 12px rgba($color: #000000, $alpha: 0.1);

  &--active {
    left: 20px;
  }

  &-text {
    display: block;
    transition: all 0.5s ease;

    span {
      font-size: 40px;
    }
  }
}

.pulse {
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
