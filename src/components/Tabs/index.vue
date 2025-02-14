<template>
  <div class="tabs">
    <TabComp
      v-for="tab in tabs"
      :key="tab.name"
      :active="tab.name === modelValue"
      @click="() => onClick(tab.name)"
    >
      <div class="flex items-center gap-xs no-wrap">
        {{ tab.title }}
        <span>({{ tab.count }})</span>
      </div>
    </TabComp>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import TabComp from '@/components/Tabs/TabComp.vue';

defineProps({
  tabs: Array as PropType<{ name: string; title: string; count: number }[]>,
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

function onClick(name: string) {
  emit('update:modelValue', name);
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  gap: 8px;

  :deep(span) {
    font-size: 16px;
  }
}
</style>