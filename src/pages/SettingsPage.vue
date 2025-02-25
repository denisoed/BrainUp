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
            <div class="user-avatar">
              <img :src="userPhoto" :alt="userName" />
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ userName }}</h3>
              <p class="user-username">@{{ userUsername }}</p>
            </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BackBtn from '@/components/BackBtn.vue';
import { LOCALE_LOCAL_STORAGE_KEY } from '@/config';

const { locale } = useI18n();

const currentLocale = computed(() => locale.value);
const userPhoto = ref('');
const userName = ref('');
const userUsername = ref('');

onMounted(() => {
  // @ts-ignore - Telegram Web App API
  const tg = window.Telegram.WebApp;
  if (tg.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    userPhoto.value = user.photo_url || '';
    userName.value = `${user.first_name} ${user.last_name || ''}`.trim();
    userUsername.value = user.username || '';
  }
});

function changeLanguage(lang: string) {
  locale.value = lang;
  localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, lang);
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

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
</style> 