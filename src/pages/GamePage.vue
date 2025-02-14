<template>
  <div class="game-page">
    <div class="container">
      <component :is="game" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ColorsGame from '@/components/Games/ColorsGame.vue';
import NumbersGame from '@/components/Games/NumbersGame.vue';

const route = useRoute();

const GAMES = {
  colors: ColorsGame,
  numbers: NumbersGame,
};

const game = computed(() => GAMES[route.params.game as keyof typeof GAMES]);
</script>