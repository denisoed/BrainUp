/**
 * Interface representing a game in the application
 */
export interface Game {
  /** Unique identifier of the game */
  name: string;
  /** Route path to the game */
  path: string;
  /** Route path to the game preview */
  previewPath: string;
  /** Icon component for the game */
  icon: string;
  /** Translation key for the game title */
  title: string;
} 