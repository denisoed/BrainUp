<template>
  <div class="exercises-page">
    <div class="exercises-page_list mt-lg">
      <div
        v-for="(item, index) in LIST"
        :key="index"
        class="exercises-page_list-item"
      >
        <div class="flex justify-between items-center">
          <h2>{{ item.name }}</h2>
        </div>
        <router-link
          class="exercises-page_list-link"
          :to="item.link"
          :class="item.type"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const LIST = [
  {
    name: 'Antistress Technique',
    link: '/item/antistress',
    type: 'antistress',
    descripion: 'Antistress breathing is a simple breathing technique that can help you relax and reduce stress. It involves taking slow, deep breaths to help calm your nervous system and reduce anxiety.',
    method: '<span>Inhale for 2 seconds</span><span>hold for 1 seconds</span><span>exhale for 3 seconds</span><span>hold for 1 seconds</span><span>repeat</span>',
  },
  {
    name: 'Box Technique',
    link: '/item/box',
    type: 'box',
    descripion: 'Box breathing, also referred to as square breathing, is a deep breathing technique that can help you slow down your breathing. It works by distracting your mind as you count to four, calming your nervous system, and decreasing stress in your body.',
    method: '<span>Inhale for 4 seconds</span><span>hold for 4 seconds</span><span>exhale for 4 seconds</span><span>hold for 4 seconds</span><span>repeat</span>',
  }
]

const openedItemType = ref(null);

function openItem(item) {
  if (openedItemType.value === item) {
    openedItemType.value = null;
  } else {
    openedItemType.value = item;
  }
}
</script>

<style lang="scss" scoped>
.exercises-page {
  &_list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    &-item {
      display: flex;
      flex-direction: column;
      gap: 8px;

      h2 {
        color: #3c3c4c;
        font-size: 14px;
        margin: 0;
      }
    }

    &-info {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      cursor: pointer;
      margin-left: 8px;

      img {
        width: 100%;
      }
    }

    &-link {
      width: 100%;
      height: 130px;
      display: block;
      background: #9b9bc6;
      border-radius: 20px;
      position: relative;
      background-position: 150%;
      background-size: 70%;
      background-repeat: no-repeat;;
      overflow: hidden;
    }
    
    .antistress {
      background-image: url('@/assets/circle-bg.svg');
    }
    
    .box {
      background-image: url('@/assets/cube-bg.svg');
      background-size: 90%;
      background-position: 150% 40px;
    }

    &-description {
      color: #3c3c4c;
      font-size: 14px;
      margin: 0;
      line-height: 1.5;
      padding: 0 16px;
      margin-top: 8px;
    }

    &-title-method {
      color: #3c3c4c;
      font-size: 14px;
      margin: 0;
      line-height: 1.8;
      padding: 0 16px;
      margin-top: 8px;
      font-weight: 600;
    }

    &-method {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 16px;

      :deep(span) {
        color: #3c3c4c;
        font-size: 14px;
      }
    }
  }
}
</style>
