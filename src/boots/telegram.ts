import useColor from '@/composables/useColor';
import useAvatar from '@/composables/useAvatar';
import useUserApi from '@/api/useUserApi';
import { useUserStore } from '@/stores/user';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '@/config';

export default async () => {
  const { rgbToHex } = useColor();

  const WebApp = window?.Telegram?.WebApp;

  try {
    if (WebApp) {
      WebApp.expand()
      WebApp.setBackgroundColor(rgbToHex('rgb(240, 128, 128)'))
      WebApp.setHeaderColor(rgbToHex('rgb(240, 128, 128)'))
      WebApp.ready()
    }
  } catch {
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  }
};
