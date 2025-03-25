<template>
  <div 
    class="timeline" 
    :class="{ 'timeline--vertical': vertical }"
  >
    <div 
      class="timeline-progress" 
      :style="{ 
        [vertical ? 'height' : 'width']: `${progress}%` 
      }" 
    />
    <div 
      v-for="(item, index) in items" 
      :key="index"
      class="timeline-item"
      :class="{
        'completed': item.completed,
        'current': item.current
      }"
    >
      <div class="timeline-icon">{{ item.icon }}</div>
      <div v-if="item.completed" class="timeline-check">
        <CheckIcon />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckIcon from '@/components/Icons/CheckIcon.vue';

interface TimelineItem {
  icon: string;
  completed: boolean;
  current: boolean;
}

interface Props {
  items: TimelineItem[];
  progress: number;
  vertical?: boolean;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }

  .timeline-progress {
    position: absolute;
    top: 50%;
    left: 0;
    height: 2px;
    background: var(--primary);
    z-index: 0;
    transition: width 0.3s ease;
  }

  &--vertical {
    flex-direction: column;
    height: 100%;
    
    &::before {
      top: 0;
      left: 50%;
      bottom: 0;
      width: 2px;
      height: auto;
    }

    .timeline-progress {
      top: 0;
      left: 50%;
      width: 2px;
      height: var(--progress);
      transform: translateX(-50%);
    }
  }
}

.timeline-item {
  position: relative;
  z-index: 1;
  
  .timeline-icon {
    width: 40px;
    height: 40px;
    background: var(--dark-color);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    position: relative;
    line-height: normal;
  }
  
  .timeline-check {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dark-color);
    font-size: 12px;
    font-weight: bold;
    border: 2px solid var(--dark-color);

    :deep(svg) {
      width: 8px;
      height: 8px;
    }
  }
  
  &.completed {
    .timeline-icon {
      background: var(--primary);
      border-color: var(--primary);
      color: var(--dark-color);
    }
  }
  
  &.current {
    .timeline-icon {
      border-color: var(--primary);
      transform: scale(1.2);
    }
  }
}
</style> 