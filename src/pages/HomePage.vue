<template>
  <div class="home-page flex column">
    <div class="flex">
      <div class="container">
        <h1 v-html="$t('home.title')" />
      </div>
      <div class="home-page_menu-btn">
        <img src="@/assets/burger-menu-right.svg" alt="Back" />
      </div>
    </div>
    <div class="container home-page_tabs mt-lg">
      <Tabs v-model="tab" :tabs="tabs" />
    </div>
    <div class="container home-page_cards mt-md">
      <CardComp
        v-for="(card, index) in cards"
        :key="index"
        :title="card.title"
        :to="card.to"
        :icon="card.icon"
        :class="card.class"
        :locked="card.locked"
        :style="{ width: getCardWidth(card.width) }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Tabs from '@/components/Tabs/index.vue';
import CardComp from '@/components/CardComp.vue';
// import Abstract1 from '@/assets/abstracts/1.svg';
import Abstract2 from '@/assets/abstracts/2.svg';
import Abstract3 from '@/assets/abstracts/3.svg';
import Abstract4 from '@/assets/abstracts/4.svg';
// import Abstract5 from '@/assets/abstracts/5.svg';
import MathSprintIcon from '@/assets/abstracts/mathSprint.svg';
import ColorsIcon from '@/assets/abstracts/colors.svg';
import NumbersIcon from '@/assets/abstracts/numbers.svg';
import AbstractVip from '@/assets/abstracts/vip.svg';
import TongueTwisterIcon from '@/assets/abstracts/tongueTwister.svg';

const { t } = useI18n();

const tabs = computed(() => [
  { name: 'all', count: 59, title: t('home.tabs.all') },
  { name: 'focus',  count: 6, title: t('home.tabs.focus') },
  { name: 'memory', count: 3, title: t('home.tabs.memory') },
  { name: 'sleep', count: 5, title: t('home.tabs.sleep') },
  { name: 'vision', count: 7, title: t('home.tabs.vision') },
  { name: 'breath', count: 4, title: t('home.tabs.breath') },
  { name: 'logic', count: 6, title: t('home.tabs.logic') },
]);

const cards = [
  { to: '', locked: true, class: '', icon: Abstract4, title: t('home.cards.breath'), width: 50 },
  { to: '', locked: true, class: '', icon: Abstract2, title: t('home.cards.sleep'), width: 50 },
  { to: '/game/mathSprint', class: '', icon: MathSprintIcon, title: t('home.cards.mathSprint'), width: 80 },
  { to: '/buy-premium', class: 'abstract-vip', icon: AbstractVip, title: '', width: 20 },
  { to: '/game/colors', class: '', icon: ColorsIcon, title: t('home.cards.colors'), width: 30 },
  { to: '/game/numbers', class: '', icon: NumbersIcon, title: t('home.cards.numbers'), width: 70 },
  { 
    to: '/game/tongueTwister', 
    class: '', 
    icon: TongueTwisterIcon, 
    title: t('home.cards.tongueTwister'), 
    width: 100
  },
]

const tab = ref('all');

function getCardWidth(width: number) {
  if (width === 100) {
    return '100%';
  }
  return `calc(${width}% - 4px)`;
}
</script>

<style lang="scss" scoped>
.home-page {
  :deep(h1) {
    font-size: 32px;
    color: var(--white-color);
    font-weight: bold;
    margin: 0;

    span {
      color: var(--primary);
    }
  }

  &_menu-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    width: 60px;
    background: transparent;
    padding: 20px 16px;
    
    img {
      width: 100%;
      display: block;
    }
  }
  
  &_tabs {
    max-width: 100%;
    overflow: auto;
  }

  &_cards {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    :deep(.abstract-vip) {
      background: var(--primary);

      .card-icon {
        width: 50px;
        height: 50px;
        opacity: 1;
        bottom: 20px;
      }
    }
  }
}
</style>