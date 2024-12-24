import useColor from '@/composables/useColor';
import useAvatar from '@/composables/useAvatar';
import useTelegramApi from '@/api/useTelegramApi';
import useUserApi from '@/api/useUserApi';
import { useUserStore } from '@/stores/user';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '@/config';

export default async () => {
  const { rgbToHex } = useColor();
  const { getRandomAvatar } = useAvatar();
  const { telegramAuth } = useTelegramApi();
  const { updateUser } = useUserApi();
  const userStore = useUserStore();

  const WebApp = window?.Telegram?.WebApp;

  try {
    if (WebApp) {
      WebApp.expand()
      const data = await telegramAuth(WebApp?.initData ? WebApp?.initDataUnsafe : JSON.parse(process.env.VUE_APP_TEST_INIT_DATA_UNSAFE_STRING));
      if (data?.user) {
        localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, String(data.jwt));
        if (!data.user.avatar) {
          const response = await updateUser(data.user.id, {
            avatar: getRandomAvatar()
          });
          userStore.setUser(response.data || {});
        } else {
          userStore.setUser(data.user || {});
        }
      } else {
        localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
      }
      WebApp.setBackgroundColor(rgbToHex('rgb(240, 128, 128)'))
      WebApp.setHeaderColor(rgbToHex('rgb(240, 128, 128)'))
      WebApp.ready()
    }
  } catch {
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  }
};
