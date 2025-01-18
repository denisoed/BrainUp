import { ref } from "vue";

<template>
  <div class="container home-page">
    <h1>Breathe...</h1>
    <div class="home-page_links mt-lg">
      <router-link to="/">Home</router-link>
      <router-link to="/exercises">Exercises</router-link>
    </div>
    <div class="home-page_list mt-lg">
      <div
        v-for="(item, index) in LIST"
        :key="index"
        class="home-page_list-item"
      >
        <div class="flex justify-between items-center" @click="openItem(item.type)">
          <h2>{{ item.name }}</h2>
          <div class="home-page_list-info">
            <img src="@/assets/info-circle.svg" alt="Info icon" />
          </div>
        </div>
        <router-link
          class="home-page_list-link"
          :to="item.link"
          :class="item.type"
        />
        <template v-if="openedItemType === item.type">
          <p class="home-page_list-description">{{ item.descripion }}</p>
          <div class="home-page_list-title-method">Method:</div>
          <div class="home-page_list-method" v-html="item.method" />
        </template>
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
    descripion: 'Box breathing, also referred to as square breathing, is a deep breathing technique that can help you slow down your breathing. It works by distracting your mind as you count to four, calming your nervous system, and decreasing stress in your body.',
    method: '<span>Inhale for 4 seconds</span><span>hold for 4 seconds</span><span>exhale for 4 seconds</span><span>hold for 4 seconds</span><span>repeat</span>',
  },
  {
    name: '4-7-8 Technique',
    link: '/item/four-seven-eight',
    type: 'four-seven-eight',
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
.home-page {
  h1 {
    font-size: 30px;
    color: #3c3c4c;
    font-weight: bold;
    margin: 0;
  }

  &_links {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 16px;

    a {
      color: #3c3c4c;
      display: flex;
      align-items: center;
      line-height: normal;
      position: relative;

      &::after {
        content: '';
        width: 1px;
        height: 15px;
        display: block;
        background: #9b9bc6;
        transform: translateX(8px);
        opacity: 0.5;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }

    .router-link-exact-active {
      font-weight: bold;
    }
  }

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
    
    .four-seven-eight {
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
