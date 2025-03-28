<template>
  <div 
    class="training-card-item"
    :class="{ 
      'training-card-item--premium': premium,
      'training-card-item--locked': locked,
      'training-card-item--current': current
    }"
    @click="handleClick"
  >
    <div class="card-icon">
      <img :src="icon" :alt="title">
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description" v-html="description" />
    </div>
    <div v-if="premium" class="premium-badge">
      <span>PRO</span>
    </div>
    <div v-if="locked" class="locked-overlay">
      <LockIcon />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LockIcon from '@/components/Icons/LockIcon.vue';

interface Props {
  title: string;
  description: string;
  icon: string;
  premium?: boolean;
  locked?: boolean;
  route?: string;
  current?: boolean;
}

const props = defineProps<Props>();
const router = useRouter();

defineEmits<{
  (e: 'click'): void;
}>();

function handleClick() {
  if (props.locked) return;
  if (props.premium) {
    router.push('/buy-premium');
  } else if (props.route) {
    router.push(props.route);
  }
}
</script>

<style lang="scss" scoped>
.training-card-item {
  flex: 0 0 calc(70% - 8px);
  scroll-snap-align: start;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-sizing: border-box;
  text-align: left;
  
  &--premium {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.1));
    border: 1px solid var(--primary);
  }

  &--locked {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &--current {
    border: 1px solid var(--primary);
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  .card-content {
    position: relative;
    z-index: 1;
  }
  
  .card-title {
    color: var(--white-color);
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    margin: 0 0 8px;
  }
  
  :deep(.card-description) {
    color: var(--gray-color);
    font-size: 12px;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    span {
      color: var(--white-color);
    }
  }
  
  .premium-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--primary);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--dark-color);
  }

  .locked-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: var(--white-color);
    font-size: 24px;
    opacity: 0.5;

    svg {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 12px;
      top: 12px;
    }
  }
}
</style> 