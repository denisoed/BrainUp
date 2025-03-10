import { defineStore } from 'pinia';
import { STREAK_DATA_LOCAL_STORAGE_KEY, LOCALE_LOCAL_STORAGE_KEY } from '@/config';

interface StreakDay {
  date: Date;
  completed: boolean;
  label: string;
}

interface StreakState {
  currentStreak: number;
  bestStreak: number;
  lastDays: StreakDay[];
  lastCompletedDate: string | null;
}

export const useStreakStore = defineStore('streak', {
  state: (): StreakState => ({
    currentStreak: 0,
    bestStreak: 0,
    lastDays: [] as StreakDay[],
    lastCompletedDate: null
  }),

  getters: {
    getStreak: (state) => state.currentStreak,
    getBestStreak: (state) => state.bestStreak,
    getLastDays: (state) => state.lastDays,
  },

  actions: {
    initializeStreak() {
      // Load streak data from localStorage
      const savedStreak = localStorage.getItem(STREAK_DATA_LOCAL_STORAGE_KEY);
      if (savedStreak) {
        const data = JSON.parse(savedStreak);
        this.currentStreak = data.currentStreak;
        this.bestStreak = data.bestStreak;
        this.lastCompletedDate = data.lastCompletedDate;
        this.lastDays = data.lastDays.map((day: any) => ({
          ...day,
          date: new Date(day.date)
        }));
      } else {
        this.resetLastDays();
      }
      this.checkStreakContinuity();
    },

    resetLastDays() {
      const locale = window.localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY) || window?.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || 'en';
      const days: StreakDay[] = [];
      const today = new Date();
      const currentDay = today.getDay();
      
      // Вычисляем дату понедельника текущей недели
      const monday = new Date(today);
      monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

      // Создаем массив дней, начиная с понедельника
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        days.push({
          date,
          completed: false,
          label: date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' }).slice(0, 2)
        });
      }
      this.lastDays = days;
    },

    checkStreakContinuity() {
      const today = new Date().toDateString();
      
      if (!this.lastCompletedDate) {
        return;
      }

      const lastCompleted = new Date(this.lastCompletedDate);
      const daysSinceLastCompleted = Math.floor(
        (new Date().getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
      );

      // If more than 1 day has passed since last completion, reset streak
      if (daysSinceLastCompleted > 1) {
        this.currentStreak = 0;
      }
    },

    completeDay() {
      const today = new Date().toDateString();
      const todayIndex = this.lastDays.findIndex(
        day => day.date.toDateString() === today
      );

      if (todayIndex !== -1 && !this.lastDays[todayIndex].completed) {
        this.lastDays[todayIndex].completed = true;
        this.currentStreak++;
        this.bestStreak = Math.max(this.currentStreak, this.bestStreak);
        this.lastCompletedDate = today;
        this.saveToLocalStorage();
      }
    },

    saveToLocalStorage() {
      localStorage.setItem(STREAK_DATA_LOCAL_STORAGE_KEY, JSON.stringify({
        currentStreak: this.currentStreak,
        bestStreak: this.bestStreak,
        lastCompletedDate: this.lastCompletedDate,
        lastDays: this.lastDays
      }));
    }
  }
}); 