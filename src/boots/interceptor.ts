import axiosInstance from '@/api';
import * as Sentry from '@sentry/vue';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '@/config';

export default () => {
  axiosInstance.interceptors.request.use(
    (config) => {
      try {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)}`;
      } catch (error) {
        Sentry.captureException(error);
      }
      return config;
    },
    (error) => {
      Sentry.captureException(error);
      Promise.reject(error);
    }
  );
}
