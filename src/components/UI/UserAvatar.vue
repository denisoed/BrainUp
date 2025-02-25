<template>
  <div class="user-avatar">
    <img 
      v-if="src" 
      :src="src" 
      :alt="alt"
      @error="handleImageError"
    />
    <div v-else class="user-avatar_placeholder">
      {{ initials || 'N/A' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  src?: string;
  alt?: string;
  name: string;
}>();

const hasImageError = ref(false);

const initials = computed(() => {
  return props.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

function handleImageError() {
  hasImageError.value = true;
}
</script>

<style lang="scss" scoped>
.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--primary);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &_placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dark-color);
    font-size: 24px;
    font-weight: 600;
  }
}
</style> 