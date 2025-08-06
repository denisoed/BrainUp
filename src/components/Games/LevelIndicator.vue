<template>
  <div class="level-indicator">
    <div class="level-badge">
      <span class="level-number">{{ level }}</span>
      <span class="difficulty-badge" :class="`difficulty-${difficulty}`">
        {{ $t(`games.difficulty.${difficulty}`) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
  level: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const props = defineProps<Props>();
const { t } = useI18n();
</script>

<style lang="scss" scoped>
.level-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.level-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.level-number {
  color: var(--primary);
  font-weight: 600;
  font-size: 16px;
}

.difficulty-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &.difficulty-easy {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  &.difficulty-medium {
    background: rgba(255, 152, 0, 0.2);
    color: #FF9800;
    border: 1px solid rgba(255, 152, 0, 0.3);
  }
  
  &.difficulty-hard {
    background: rgba(244, 67, 54, 0.2);
    color: #F44336;
    border: 1px solid rgba(244, 67, 54, 0.3);
  }
}
</style> 