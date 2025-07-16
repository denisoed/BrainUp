import type { Game } from '@/types/game';
import MathSprintIcon from '@/assets/abstracts/mathSprint.svg';
import ColorsIcon from '@/assets/abstracts/colors.svg';
import NumbersIcon from '@/assets/abstracts/numbers.svg';
import TongueTwisterIcon from '@/assets/abstracts/tongueTwister.svg';
import SequenceIcon from '@/assets/abstracts/sequence.svg';
import MinesweeperIcon from '@/assets/abstracts/minesweeper.svg';
import SpellingIcon from '@/assets/abstracts/spelling.svg';
import VocabularyIcon from '@/assets/abstracts/vocabulary.svg';
import GridSequenceIcon from '@/assets/abstracts/gridSequence.svg';
import MathBlocksIcon from '@/assets/abstracts/mathBlocks.svg';
import BreathIcon from '@/assets/abstracts/breath.svg';
import DurakIcon from '@/assets/abstracts/durak.svg';
import ArticulationIcon from '@/assets/abstracts/articulation.svg';

// Individual game exports
export const breathGame: Game = {
  name: 'breath',
  path: '/game/breath',
  previewPath: '/game-preview/breath',
  icon: BreathIcon,
  title: 'games.names.breath',
};

export const mathSprintGame: Game = {
  name: 'mathSprint',
  path: '/game/mathSprint',
  previewPath: '/game-preview/mathSprint',
  icon: MathSprintIcon,
  title: 'games.names.mathSprint',
};

export const colorsGame: Game = {
  name: 'colors',
  path: '/game/colors',
  previewPath: '/game-preview/colors',
  icon: ColorsIcon,
  title: 'games.names.colors',
};

export const numbersGame: Game = {
  name: 'numbers',
  path: '/game/numbers',
  previewPath: '/game-preview/numbers',
  icon: NumbersIcon,
  title: 'games.names.numbers',
};

export const tongueTwisterGame: Game = {
  name: 'tongueTwister',
  path: '/game/tongueTwister',
  previewPath: '/game-preview/tongueTwister',
  icon: TongueTwisterIcon,
  title: 'games.names.tongueTwister',
};

export const gridSequenceGame: Game = {
  name: 'gridSequence',
  path: '/game/gridSequence',
  previewPath: '/game-preview/gridSequence',
  icon: GridSequenceIcon,
  title: 'games.names.gridSequence',
};

export const sequenceGame: Game = {
  name: 'sequence',
  path: '/game/sequence',
  previewPath: '/game-preview/sequence',
  icon: SequenceIcon,
  title: 'games.names.sequence',
};

export const durakGame: Game = {
  name: 'durak',
  path: '/game/durak',
  previewPath: '/game-preview/durak',
  icon: DurakIcon,
  title: 'games.names.durak',
};

export const spellingGame: Game = {
  name: 'spelling',
  path: '/game/spelling',
  previewPath: '/game-preview/spelling',
  icon: SpellingIcon,
  title: 'games.names.spelling',
};

export const minesweeperGame: Game = {
  name: 'minesweeper',
  path: '/game/minesweeper',
  previewPath: '/game-preview/minesweeper',
  icon: MinesweeperIcon,
  title: 'games.names.minesweeper',
};

export const vocabularyGame: Game = {
  name: 'vocabulary',
  path: '/game/vocabulary',
  previewPath: '/game-preview/vocabulary',
  icon: VocabularyIcon,
  title: 'games.names.vocabulary',
};

export const mathBlocksGame: Game = {
  name: 'mathBlocks',
  path: '/game/mathBlocks',
  previewPath: '/game-preview/mathBlocks',
  icon: MathBlocksIcon,
  title: 'games.names.mathBlocks',
};

export const articulationGame: Game = {
  name: 'articulation',
  path: '/game/articulation',
  previewPath: '/game-preview/articulation',
  icon: ArticulationIcon,
  title: 'games.names.articulation',
};

// Export all games as array if needed
export const games = [
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
  articulationGame,
];
