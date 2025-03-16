import { beginnerVocabulary, intermediateVocabulary, advancedVocabulary } from './levels';

interface Level {
  timeLimit: number;
  winningStreak: number;
  words: { en: string; ru: string }[];
}

// Levels configuration with increasing difficulty
const levels: Record<number, Level> = {
  // Beginner levels (1-8) - Using beginnerVocabulary
  1: {
    timeLimit: 10,
    winningStreak: 5,
    words: beginnerVocabulary.slice(0, 24) // Basic greetings and simple nouns
  },
  2: {
    timeLimit: 10,
    winningStreak: 6,
    words: beginnerVocabulary.slice(24, 48) // Colors, numbers, and basic actions
  },
  3: {
    timeLimit: 9,
    winningStreak: 7,
    words: beginnerVocabulary.slice(48, 72) // Basic household items and clothing
  },
  4: {
    timeLimit: 9,
    winningStreak: 8,
    words: beginnerVocabulary.slice(72, 96) // Food, drinks, and basic adjectives
  },
  5: {
    timeLimit: 8,
    winningStreak: 9,
    words: beginnerVocabulary.slice(96, 120) // Basic verbs and more household items
  },
  6: {
    timeLimit: 8,
    winningStreak: 10,
    words: beginnerVocabulary.slice(120, 144) // Nature and weather terms
  },
  7: {
    timeLimit: 8,
    winningStreak: 11,
    words: beginnerVocabulary.slice(144, 168) // Common animals and insects
  },
  8: {
    timeLimit: 7,
    winningStreak: 12,
    words: beginnerVocabulary.slice(168, 192) // Marine life and remaining beginner words
  },
  
  // Intermediate levels (9-14) - Using intermediateVocabulary
  9: {
    timeLimit: 7,
    winningStreak: 13,
    words: intermediateVocabulary.slice(0, 32) // Technology and time concepts
  },
  10: {
    timeLimit: 7,
    winningStreak: 14,
    words: intermediateVocabulary.slice(32, 64) // Places and transportation
  },
  11: {
    timeLimit: 6,
    winningStreak: 15,
    words: intermediateVocabulary.slice(64, 96) // Education and career
  },
  12: {
    timeLimit: 6,
    winningStreak: 16,
    words: intermediateVocabulary.slice(96, 128) // Health and nutrition
  },
  13: {
    timeLimit: 6,
    winningStreak: 17,
    words: intermediateVocabulary.slice(128, 160) // Business and commerce
  },
  14: {
    timeLimit: 5,
    winningStreak: 18,
    words: intermediateVocabulary.slice(160, 190) // Sports and entertainment
  },
  
  // Advanced levels (15-20) - Using advancedVocabulary
  15: {
    timeLimit: 5,
    winningStreak: 19,
    words: advancedVocabulary.slice(0, 32) // Scientific and philosophical concepts
  },
  16: {
    timeLimit: 5,
    winningStreak: 20,
    words: advancedVocabulary.slice(32, 64) // Business and economics terms
  },
  17: {
    timeLimit: 4,
    winningStreak: 21,
    words: advancedVocabulary.slice(64, 96) // Psychology and sociology
  },
  18: {
    timeLimit: 4,
    winningStreak: 22,
    words: advancedVocabulary.slice(96, 128) // Technical and academic terms
  },
  19: {
    timeLimit: 3,
    winningStreak: 23,
    words: advancedVocabulary.slice(128, 160) // Complex processes and phenomena
  },
  20: {
    timeLimit: 3,
    winningStreak: 25,
    words: advancedVocabulary.slice(160, 190) // Most challenging abstract concepts
  }
};

export default levels;