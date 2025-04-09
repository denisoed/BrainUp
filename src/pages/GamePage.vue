<template>
  <div class="game-page">
    <div class="game-page_header">
      <InfoBtn @click="onOpenAboutGameDialog" />
      <BackBtn @click="$router.back()" />
    </div>
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
import MathSprintGame from '@/components/Games/MathSprintGame.vue';
import TongueTwisterGame from '@/components/Games/TongueTwisterGame.vue';
import AboutGameDialog from '@/components/Dialogs/AboutGameDialog.vue';
import SequenceGame from '@/components/Games/SequenceGame.vue';
import BreathGame from '@/components/Games/BreathGame.vue';
import MinesweeperGame from '@/components/Games/MinesweeperGame.vue';
import SpellingGame from '@/components/Games/SpellingGame.vue';
import VocabularyGame from '@/components/Games/VocabularyGame.vue';
import GridSequenceGame from '@/components/Games/GridSequenceGame.vue';
import MathBlocksGame from '@/components/Games/MathBlocksGame.vue';
import MemoryPairsGame from '@/components/Games/MemoryPairsGame.vue';
import BackBtn from '@/components/BackBtn.vue';
import InfoBtn from '@/components/InfoBtn.vue';
import {
  openModal
} from 'jenesius-vue-modal';
import DurakGame from '@/components/Games/DurakGame.vue';
const route = useRoute();

const GAMES = {
  colors: ColorsGame,
  numbers: NumbersGame,
  mathSprint: MathSprintGame,
  tongueTwister: TongueTwisterGame,
  sequence: SequenceGame,
  breath: BreathGame,
  minesweeper: MinesweeperGame,
  spelling: SpellingGame,
  vocabulary: VocabularyGame,
  gridSequence: GridSequenceGame,
  mathBlocks: MathBlocksGame,
  durak: DurakGame,
  memoryPairs: MemoryPairsGame
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
</script>

<style lang="scss" scoped>
.game-page {
  &_header {
    width: 100%;
    position: absolute;
    left: 0;
    top: 16px;
    z-index: 2;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }

  &_about-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: var(--white-color);
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>