<template>
  <div class="game-page">
    <div class="container">
      <component :is="game" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ColorsGame from '@/components/Games/ColorsGame.vue';
import NumbersGame from '@/components/Games/NumbersGame.vue';
import AboutGameDialog from '@/components/Dialogs/AboutGameDialog.vue';
import {
  openModal
} from 'jenesius-vue-modal';

const route = useRoute();

const GAMES = {
  colors: ColorsGame,
  numbers: NumbersGame,
};

const game = computed(() => GAMES[route.params.game as keyof typeof GAMES]);

async function onOpenAboutGameDialog() {
  const modal = await openModal(AboutGameDialog, {
    game: route.params.game
  })
  modal.on('close', () => {
    modal.close();
  })
}

onMounted(() => {
  onOpenAboutGameDialog();
})
</script>