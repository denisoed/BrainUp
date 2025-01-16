import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '@/config';

export default async () => {
  const WebApp = window?.Telegram?.WebApp;

  try {
    if (WebApp) {
      WebApp.expand()
      WebApp.setBackgroundColor('#ffffff')
      WebApp.setHeaderColor('#ffffff')
      WebApp.ready()
    }
  } catch {
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  }
};
