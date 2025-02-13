<template>
  <div class="home-page flex column">
    <h1>Let's start <br> your day</h1>
    <div class="home-page_tabs mt-lg">
      <Tabs v-model="tab" :tabs="tabs" />
    </div>
    <div class="home-page_cards mt-md">
      <CardComp
        v-for="(card, index) in cards"
        :key="index"
        :title="card.title"
        :to="card.to"
        :icon="card.icon"
        :style="{ width: `calc(${card.width} - 8px)` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Tabs from '@/components/Tabs/index.vue';
import CardComp from '@/components/CardComp.vue';
import Abstract1 from '@/assets/abstracts/1.svg';
import Abstract2 from '@/assets/abstracts/2.svg';
import Abstract3 from '@/assets/abstracts/3.svg';
import Abstract4 from '@/assets/abstracts/4.svg';

const cards = [
  { to: '', icon: Abstract1, title: 'Stress', width: '50%' },
  { to: '', icon: Abstract2, title: 'Sleep', width: '50%' },
  { to: '', icon: Abstract3, title: 'Work', width: '80%' },
  { to: '', icon: null, title: '', width: '20%' },
  { to: '', icon: Abstract4, title: 'Brain', width: '100%' },
]

const tabs = computed(() => [
  { name: 'all', title: 'All' },
  { name: 'stress',  title: 'Stress' },
  { name: 'sleep', title: 'Sleep' },
  { name: 'work', title: 'Work' },
  { name: 'sport', title: 'Sport' },
  { name: 'brain', title: 'Brain' },
]);

const tab = ref('all');
</script>

<style lang="scss" scoped>
.home-page {
  h1 {
    font-size: 30px;
    color: #fff;
    font-weight: bold;
    margin: 0;
    padding: 0 20px;
  }
  
  &_tabs {
    max-width: 100%;
    overflow: auto;
    padding: 0 20px;

    .tabs {
      width: calc(100vw + 40px);
    }
  }

  &_cards {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 20px;

    // .card {
    //   flex: 1 1 calc(50% - 8px);
    // }
  }
}
</style>