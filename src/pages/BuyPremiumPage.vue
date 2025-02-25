<template>
  <div class="premium-page flex column">
    <div class="flex">
      <div class="container">
        <h1 v-html="$t('premium.title')" />
      </div>
      <BackBtn class="premium-page_back" @click="$router.back()" />
    </div>

    <div class="container premium-page_content">
      <div class="plans-header">
        <h2>{{ $t('premium.plans.title') }}</h2>
        <p>{{ $t('premium.plans.subtitle') }}</p>
      </div>

      <div class="premium-plans">
        <div 
          v-for="(plan, index) in plans" 
          :key="index"
          class="plan-card"
          :class="{ 'plan-card--featured': plan.featured }"
          @click="selectPlan(plan)"
        >
          <div class="plan-content">
            <h3 class="plan-title">{{ plan.title }}</h3>
            <div class="plan-description">{{ plan.description }}</div>
          </div>
          <img :src="plan.icon" class="plan-icon" alt="Premium">
        </div>
      </div>

      <div class="premium-features mt-lg">
        <h2>{{ $t('premium.subtitle') }}</h2>
        <div class="features-list">
          <div v-for="(feature, index) in features" :key="index" class="feature-item">
            <span class="feature-icon">{{ feature.icon }}</span>
            {{ feature.text }}
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
import AbstractVip from '@/assets/abstracts/vip.svg';

const { t } = useI18n();

const features = computed(() => [
  { icon: '🎯', text: t('premium.features.allGames') },
  { icon: '⚡', text: t('premium.features.newContent') },
  { icon: '💎', text: t('premium.features.exclusive') }
]);

const plans = computed(() => [
  { 
    title: t('premium.plans.monthly.title'),
    price: '$4.99',
    description: t('premium.plans.monthly.description'),
    icon: AbstractVip,
    featured: false
  },
  { 
    title: t('premium.plans.yearly.title'),
    price: '$39.99',
    description: t('premium.plans.yearly.description'),
    icon: AbstractVip,
    featured: true
  }
]);

function selectPlan(plan: any) {
  console.log('Selected plan:', plan);
}
</script>

<style lang="scss" scoped>
.premium-page {
  :deep(h1) {
    font-size: 32px;
    color: var(--white-color);
    font-weight: bold;
    margin: 0;

    span {
      color: var(--primary);
    }
  }

  &_back {
    position: absolute;
    top: 20px;
    right: 16px;
  }

  &_content {
    width: 100%;
  }
}

.premium-features {
  
  h2 {
    color: var(--white-color);
    font-size: 18px;
    margin: 0 0 8px;
  }
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-item {
  display: flex;
  align-items: center;
  color: var(--white-color);
  font-size: 14px;
  
  .feature-icon {
    margin-right: 12px;
    font-size: 24px;
    width: 32px;
    text-align: center;
  }
}

.premium-plans {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.plan-card {
  flex: 1;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-4px);
  }

  &--featured {
    background: var(--primary);
    border: none;
    color: var(--dark-color);

    .plan-icon {
      opacity: 1;
    }
  }
}

.plan-content {
  position: relative;
  z-index: 1;
}

.plan-title {
  font-size: 20px;
  margin: 0 0 16px;
}

.plan-description {
  opacity: 0.8;
  font-size: 16px;
}

.plan-icon {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 80px;
  height: 80px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.plans-header {
  text-align: left;
  margin-bottom: 24px;

  h2 {
    color: var(--white-color);
    font-size: 22px;
    margin-bottom: 0;
  }

  p {
    color: var(--white-color);
    opacity: 0.8;
    margin-top: 0;
    font-size: 14px;
  }
}
</style> 