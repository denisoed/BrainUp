import {
  beginnerVocabulary,
  intermediateVocabulary,
  advancedVocabulary
} from '@/data/vocabulary/words';

interface Level {
  timeLimit: number;
  winningStreak: number;
}

// Function to get vocabulary array by difficulty
export function getVocabularyByDifficulty(difficulty: string) {
  switch(difficulty) {
    case 'easy': return beginnerVocabulary
    case 'medium': return intermediateVocabulary
    case 'hard': return advancedVocabulary
    default: return beginnerVocabulary
  }
}

// Simplified levels configuration - same settings for all difficulties
export const levels: Record<number, Level> = {
  1: { timeLimit: 10, winningStreak: 5 },
  2: { timeLimit: 10, winningStreak: 6 },
  3: { timeLimit: 9, winningStreak: 7 },
  4: { timeLimit: 9, winningStreak: 8 },
  5: { timeLimit: 8, winningStreak: 9 },
  6: { timeLimit: 8, winningStreak: 10 },
  7: { timeLimit: 8, winningStreak: 11 },
  8: { timeLimit: 7, winningStreak: 12 },
  9: { timeLimit: 7, winningStreak: 13 },
  10: { timeLimit: 7, winningStreak: 14 },
  11: { timeLimit: 6, winningStreak: 15 },
  12: { timeLimit: 6, winningStreak: 16 },
  13: { timeLimit: 6, winningStreak: 17 },
  14: { timeLimit: 5, winningStreak: 18 },
  15: { timeLimit: 5, winningStreak: 19 },
  16: { timeLimit: 5, winningStreak: 20 },
  17: { timeLimit: 4, winningStreak: 21 },
  18: { timeLimit: 4, winningStreak: 22 },
  19: { timeLimit: 3, winningStreak: 23 },
  20: { timeLimit: 3, winningStreak: 25 }
};

export default {
  levels,
  getVocabularyByDifficulty
}
