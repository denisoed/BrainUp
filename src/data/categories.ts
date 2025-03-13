import type { Category } from '@/types/category';
import {
  breathGame,
  mathSprintGame,
  colorsGame,
  numbersGame,
  tongueTwisterGame,
  gridSequenceGame,
  sequenceGame,
  durakGame,
  spellingGame,
  minesweeperGame,
  vocabularyGame,
  mathBlocksGame,
} from '@/data/games';

// Individual category exports
export const attentionCategory: Category = {
  id: 'attention',
  title: 'categories.attention.title',
  description: 'categories.attention.description',
  icon: 'attention',
  games: [
    minesweeperGame,
    gridSequenceGame,
    sequenceGame,
  ],
};

export const memoryCategory: Category = {
  id: 'memory',
  title: 'categories.memory.title',
  description: 'categories.memory.description',
  icon: 'memory',
  games: [
    colorsGame,
    numbersGame,
    durakGame,
  ],
};

export const logicCategory: Category = {
  id: 'logic',
  title: 'categories.logic.title',
  description: 'categories.logic.description',
  icon: 'logic',
  games: [
    mathSprintGame,
    mathBlocksGame,
  ],
};

export const speechCategory: Category = {
  id: 'speech',
  title: 'categories.speech.title',
  description: 'categories.speech.description',
  icon: 'speech',
  games: [
    tongueTwisterGame,
    spellingGame,
    vocabularyGame,
  ],
};

export const breathingCategory: Category = {
  id: 'breathing',
  title: 'categories.breathing.title',
  description: 'categories.breathing.description',
  icon: 'breathing',
  games: [
    breathGame,
  ],
};

// Export all categories as array if needed
export const categories = [
  attentionCategory,
  memoryCategory,
  logicCategory,
  speechCategory,
  breathingCategory,
];
