<template>
  <div class="settings-page flex column">
    <div class="container flex items-center justify-between">
      <h1>{{ $t('settings.title') }}</h1>
      <BackBtn class="settings-page_back" @click="$router.back()" />
    </div>

    <div class="container settings-page_content mt-lg">
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BackBtn from '@/components/BackBtn.vue';
import { LOCALE_LOCAL_STORAGE_KEY } from '@/config';

const { locale } = useI18n();

const currentLocale = computed(() => locale.value);

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
  margin-bottom: 24px;
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
</style> 