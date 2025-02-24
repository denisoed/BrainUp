<template>
  <div class="game-page">
    <BackBtn class="game-page_back" @click="$router.back()" />
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
import MathSprintGame from '@/components/Games/MathSprintGame.vue';
import TongueTwisterGame from '@/components/Games/TongueTwisterGame.vue';
import AboutGameDialog from '@/components/Dialogs/AboutGameDialog.vue';
import SequenceGame from '@/components/Games/SequenceGame.vue';
import BreathGame from '@/components/Games/BreathGame.vue';
import MinesweeperGame from '@/components/Games/MinesweeperGame.vue';
import SpellingGame from '@/components/Games/SpellingGame.vue';
import BackBtn from '@/components/BackBtn.vue';
import {
  openModal
} from 'jenesius-vue-modal';

const route = useRoute();

const GAMES = {
  colors: ColorsGame,
  numbers: NumbersGame,
  mathSprint: MathSprintGame,
  tongueTwister: TongueTwisterGame,
  sequence: SequenceGame,
  breath: BreathGame,
  minesweeper: MinesweeperGame,
  spelling: SpellingGame
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

<style lang="scss" scoped>
.game-page {
  &_back {
    position: absolute;
    top: 20px;
    right: 16px;
    z-index: 2;
  }
}
</style>