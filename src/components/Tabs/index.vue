<template>
  <div class="tabs">
    <TabComp
      v-for="tab in tabs"
      :key="tab.name"
      :active="tab.name === modelValue"
      @click="() => onClick(tab.name)"
    >
      {{ tab.title }}
    </TabComp>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import TabComp from '@/components/Tabs/TabComp.vue';

defineProps({
  tabs: Array as PropType<{ name: string; title: string; }[]>,
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
}
</style>