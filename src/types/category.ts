import type { Game } from '@/types/game';

/**
 * Interface representing a category of games
 */
export interface Category {
  /** Unique identifier of the category */
  id: string;
  /** Translation key for the category title */
  title: string;
  /** Translation key for the category description */
  description: string;
  /** Icon identifier for the category */
  icon: string;
  /** List of games in this category */
  games: Game[];
} 