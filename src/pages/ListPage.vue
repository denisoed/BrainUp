<template>
  <div class="home-page flex column">
    <div class="container">
      <h1 v-html="$t('home.title')" />
    </div>
    <div class="container home-page_tabs mt-lg">
      <Tabs v-model="tab" :tabs="tabs" />
    </div>
    <div class="container home-page_cards mt-md">
      <CardComp
        v-for="(card, index) in filteredCards"
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
import Abstract1 from '@/assets/abstracts/1.svg';
import Abstract2 from '@/assets/abstracts/2.svg';
import Abstract3 from '@/assets/abstracts/3.svg';
import Abstract4 from '@/assets/abstracts/4.svg';
import MathSprintIcon from '@/assets/abstracts/mathSprint.svg';
import ColorsIcon from '@/assets/abstracts/colors.svg';
import NumbersIcon from '@/assets/abstracts/numbers.svg';
import AbstractVip from '@/assets/abstracts/vip.svg';
import TongueTwisterIcon from '@/assets/abstracts/tongueTwister.svg';
import SequenceIcon from '@/assets/abstracts/sequence.svg';
import MinesweeperIcon from '@/assets/abstracts/minesweeper.svg';
import SpellingIcon from '@/assets/abstracts/spelling.svg';
import VocabularyIcon from '@/assets/abstracts/vocabulary.svg';
import GridSequenceIcon from '@/assets/abstracts/gridSequence.svg';
import MathBlocksIcon from '@/assets/abstracts/mathBlocks.svg';

const { t } = useI18n();

const gameCategories = {
  breath: ['breath'],
  focus: ['mathSprint', 'colors', 'numbers', 'gridSequence', 'mathBlocks'],
  memory: ['sequence', 'spelling', 'vocabulary'],
  logic: ['minesweeper'],
  speech: ['tongueTwister'],
} as const;

// Получаем количество уникальных игр в каждой категории
const getCategoryCount = (category: keyof typeof gameCategories) => {
  return new Set(gameCategories[category]).size;
};

// Получаем все уникальные игры
const getAllGamesCount = () => {
  const allGames = Object.values(gameCategories).flat();
  return new Set(allGames).size;
};

const tabs = computed(() => [
  { name: 'all', count: getAllGamesCount(), title: t('home.tabs.all') },
  { name: 'focus', count: getCategoryCount('focus'), title: t('home.tabs.focus') },
  { name: 'memory', count: getCategoryCount('memory'), title: t('home.tabs.memory') },
  { name: 'logic', count: getCategoryCount('logic'), title: t('home.tabs.logic') },
  { name: 'breath', count: getCategoryCount('breath'), title: t('home.tabs.breath') },
  { name: 'speech', count: getCategoryCount('speech'), title: t('home.tabs.speech') },
]);

const cards = computed(() => [
  { to: '/game-preview/breath', class: '', icon: Abstract4, title: t('home.cards.breath'), width: 50 },
  { to: '', locked: true, class: '', icon: Abstract2, title: t('home.cards.sleep'), width: 50 },
  { to: '/game-preview/mathSprint', class: '', icon: MathSprintIcon, title: t('home.cards.mathSprint'), width: 80 },
  { to: '/buy-premium', class: 'abstract-vip', icon: AbstractVip, title: '', width: 20 },
  { to: '/game-preview/colors', class: '', icon: ColorsIcon, title: t('home.cards.colors'), width: 30 },
  { to: '/game-preview/numbers', class: '', icon: NumbersIcon, title: t('home.cards.numbers'), width: 70 },
  { 
    to: '/game-preview/tongueTwister', 
    class: '', 
    icon: TongueTwisterIcon, 
    title: t('home.cards.tongueTwister'), 
    width: 50
  },
  {
    to: '/game-preview/gridSequence',
    class: '',
    icon: GridSequenceIcon,
    title: t('home.cards.gridSequence'),
    width: 50
  },
  {
    to: '/game-preview/sequence',
    class: '',
    icon: SequenceIcon,
    title: t('home.cards.sequence'),
    width: 60
  },
  {
    to: '/game-preview/minesweeper',
    class: '',
    icon: MinesweeperIcon,
    title: t('home.cards.minesweeper'),
    width: 40
  },
  {
    to: '/game-preview/durak',
    class: '',
    icon: Abstract1,
    title: t('home.cards.durak'),
    width: 40
  },
  {
    to: '/game-preview/spelling',
    class: '',
    icon: SpellingIcon,
    title: t('home.cards.spelling'),
    width: 60
  },
  {
    to: '/game-preview/vocabulary',
    class: '',
    icon: VocabularyIcon,
    title: t('home.cards.vocabulary'),
    width: 50
  },
  {
    to: '/game-preview/mathBlocks',
    class: '',
    icon: MathBlocksIcon,
    title: t('home.cards.mathBlocks'),
    width: 50
  },
]);

const tab = ref('all');

const filteredCards = computed(() => {
  if (tab.value === 'all') {
    return cards.value;
  }
  
  return cards.value.filter(card => {
    const gamePath = card.to.split('/').pop();
    return gameCategories[tab.value as keyof typeof gameCategories]?.includes(gamePath as any);
  });
});

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