export const AUDIO_LOCAL_STORAGE_KEY = 'heathapp-audio';
export const VIBRATION_LOCAL_STORAGE_KEY = 'heathapp-vibration';
export const FIRST_TAP_HELP_LOCAL_STORAGE_KEY = 'heathapp-first-tap-help';
export const LOCALE_LOCAL_STORAGE_KEY = 'heathapp-locale';
export const HAS_SEEN_WELCOME_LOCAL_STORAGE_KEY = 'has_seen_welcome';

export const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'heathapp-access-token';

export const GAME_SCORE_NAME = 'HLTH';

export const FARMING_AMOUNT = 500;
export const FARMING_COOLDOWN = 28800; // 8h

// Types for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            first_name?: string;
          };
        };
      };
    };
  }
}