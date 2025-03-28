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

export const ATTENTION_TYPE = 'attention';
export const MEMORY_TYPE = 'memory';
export const LOGIC_TYPE = 'logic';
export const SPEECH_TYPE = 'speech';
export const BREATHING_TYPE = 'breathing';

// Individual category exports
export const attentionCategory: Category = {
  type: ATTENTION_TYPE,
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
  type: MEMORY_TYPE,
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
  type: LOGIC_TYPE,
  title: 'categories.logic.title',
  description: 'categories.logic.description',
  icon: 'logic',
  games: [
    mathSprintGame,
    mathBlocksGame,
  ],
};

export const speechCategory: Category = {
  type: SPEECH_TYPE,
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
  type: BREATHING_TYPE,
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
