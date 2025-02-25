<template>
  <div class="settings-page flex column">
    <div class="container flex items-center justify-between">
      <h1>{{ $t('settings.title') }}</h1>
      <BackBtn class="settings-page_back" @click="$router.back()" />
    </div>

    <div class="container settings-page_content mt-lg">
      <!-- User Profile Section -->
      <div class="settings-section">
        <div class="settings-block">
          <div class="settings-block_header">
            <h2>{{ $t('settings.profile.title') }}</h2>
          </div>
          <div class="user-profile">
            <UserAvatar
              :src="userPhoto"
              :alt="userName"
              :name="userName"
            />
            <div class="user-info">
              <h3 class="user-name">{{ userName }}</h3>
              <p class="user-username">@{{ userUsername }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Section -->
      <div class="settings-section">
        <div class="settings-block">
          <div class="settings-block_header">
            <h2>{{ $t('settings.theme.title') }}</h2>
          </div>
          <div class="settings-options">
            <button 
              class="theme-btn" 
              :class="{ active: currentTheme === 'dark' }"
              @click="changeTheme('dark')"
            >
              {{ $t('settings.theme.dark') }}
            </button>
            <button 
              class="theme-btn" 
              :class="{ active: currentTheme === 'light' }"
              @click="changeTheme('light')"
            >
              {{ $t('settings.theme.light') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications Section -->
      <div class="settings-section">
        <div class="settings-block">
          <div class="settings-block_header">
            <h2>{{ $t('settings.notifications.title') }}</h2>
          </div>
          <div class="settings-toggle">
            <span>{{ $t('settings.notifications.reminders') }}</span>
            <SwitchToggle
              v-model="notifications.reminders"
            />
          </div>
        </div>
      </div>

      <!-- Language Section -->
      <div class="settings-section">
        <div class="settings-block">
          <div class="settings-block_header">
            <h2>{{ $t('settings.language.title') }}</h2>
          </div>
          <div class="settings-options">
            <button 
              class="language-btn" 
              :class="{ active: currentLocale === 'en' }"
              @click="changeLanguage('en')"
            >
              English
            </button>
            <button 
              class="language-btn" 
              :class="{ active: currentLocale === 'ru' }"
              @click="changeLanguage('ru')"
            >
              Русский
            </button>
          </div>
        </div>
      </div>

      <!-- App Info Section -->
      <div class="settings-section">
        <div class="settings-block">
          <div class="settings-block_header">
            <h2>{{ $t('settings.about.title') }}</h2>
          </div>
          <div class="app-info">
            <div class="info-item">
              <span class="label">{{ $t('settings.about.version') }}:</span>
              <span class="value">{{ appVersion }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t('settings.about.developer') }}:</span>
              <span class="value">denisoed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BackBtn from '@/components/BackBtn.vue';
import SwitchToggle from '@/components/UI/SwitchToggle.vue';
import UserAvatar from '@/components/UI/UserAvatar.vue';
import { LOCALE_LOCAL_STORAGE_KEY } from '@/config';
import pkg from '../../package.json';

const { locale } = useI18n();

const currentLocale = computed(() => locale.value);
const userPhoto = ref('');
const userName = ref('');
const userUsername = ref('');
const currentTheme = ref('dark');
const notifications = reactive({
  reminders: false
});

const appVersion = pkg.version;

onMounted(() => {
  // @ts-ignore - Telegram Web App API
  const tg = window.Telegram.WebApp;
  if (tg.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    userPhoto.value = user.photo_url || '';
    userName.value = `${user.first_name} ${user.last_name || ''}`.trim();
    userUsername.value = user.username || '';
  }
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  changeTheme(savedTheme);
});

function changeLanguage(lang: string) {
  locale.value = lang;
  localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, lang);
}

function changeTheme(theme: string) {
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>

<style lang="scss" scoped>
.settings-page {
  :deep(h1) {
    font-size: 32px;
    color: var(--white-color);
    font-weight: bold;
    margin: 0;
  }

  &_content {
    width: 100%;
  }
}

.settings-section {
  margin-bottom: 16px;
}

.settings-block {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  
  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h2 {
      color: var(--white-color);
      font-size: 18px;
      margin: 0;
    }
  }
  
  &_current {
    color: var(--primary);
    font-size: 14px;
  }
}

.settings-options {
  display: flex;
  gap: 12px;
  padding: 4px;
}

.language-btn {
  padding: 12px 24px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--white-color);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--dark-color);
  }
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.user-info {
  .user-name {
    color: var(--white-color);
    font-size: 18px;
    margin: 0 0 4px 0;
    font-weight: 600;
  }

  .user-username {
    color: var(--white-color);
    opacity: 0.7;
    font-size: 14px;
    margin: 0;
  }
}

.theme-btn {
  @extend .language-btn;
}

.settings-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: var(--white-color);
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 8px 0;
}

.stat-item {
  text-align: center;
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary);
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 14px;
    color: var(--white-color);
    opacity: 0.7;
  }
}

.app-info {
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    color: var(--white-color);
    
    .label {
      opacity: 0.7;
    }
  }
}
</style> 