<template>
  <div class="game-preview">
    <div class="game-preview__header">
      <div class="game-preview__logo">
        <h1 v-html="gameName" />
      </div>
      <BackBtn @click="goBack" />
    </div>

    <div class="container">
      <!-- Блок с уровнями -->
      <section class="game-preview__levels">
        <h2>{{ $t('games.levels') }}</h2>
        <div class="levels-scroll">
          <div class="levels-grid">
            <div
              v-for="level in totalLevels"
              :key="level"
              class="level-item"
              :class="{
                'level-item--completed': level <= completedLevels,
                'level-item--current': level === completedLevels + 1,
                'level-item--locked': level > completedLevels + 1
              }"
              @click="startGame(level)"
            >
              <div class="level-icon">
                <span v-if="level <= completedLevels" class="flex items-center justify-center check-icon">
                  <CheckIcon />
                </span>
                <span v-else-if="level === completedLevels + 1" class="flex items-center justify-center play-icon">
                  <PlayIcon />
                </span>
                <span v-else class="flex items-center justify-center lock-icon">
                  <LockIcon />
                </span>
              </div>
              <span class="level-number">{{ level }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Блок с пользой игры -->
      <section class="game-preview__benefit">
        <div class="benefit-content" v-html="gameBenefit"></div>
      </section>

      <!-- Блок с правилами -->
      <section class="game-preview__rules">
        <h2>{{ $t('games.rules') }}</h2>
        <div class="rules-list">
          <div
            v-for="(rule, index) in gameRules"
            :key="index"
            class="rule-item"
            v-html="rule"
          ></div>
        </div>
      </section>

      <Button
        class="start-button"
        @click="() => startGame()"
      >
        {{ $t('games.startPlaying') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BackBtn from '@/components/BackBtn.vue'
import Button from '@/components/Button.vue'
import CheckIcon from '@/components/Icons/CheckIcon.vue'
import PlayIcon from '@/components/Icons/PlayIcon.vue'
import LockIcon from '@/components/Icons/LockIcon.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const completedLevels = ref(3)
const totalLevels = ref(20)

// Получаем информацию о текущей игре
const gameKey = computed(() => route.params.game as string)

// Получаем описание пользы игры
const gameBenefit = computed(() => {
  return t(`games.${gameKey.value}.about.descr`)
})

const gameName = computed(() => {
  return t(`games.${gameKey.value}.about.title`)
})

// Получаем правила игры
const gameRules = computed(() => {
  const rules = []
  let ruleIndex = 1
  
  while (true) {
    const ruleKey = `games.${gameKey.value}.about.rule${ruleIndex}`
    const rule = t(ruleKey)
    
    // Если ключ не найден, прекращаем поиск
    if (rule === ruleKey) break
    
    rules.push(rule)
    ruleIndex++
  }
  
  return rules
})

const startGame = async (level?: number): Promise<void> => {
  if (level && level !== completedLevels.value + 1) return;
  try {
    router.push(`/game/${route.params.game}`)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const goBack = async (): Promise<void> => {
  try {
    await router.push('/list')
  } catch (error) {
    console.error('Navigation error:', error)
  }
}
</script>

<style lang="scss" scoped>
.game-preview {
  min-height: 100vh;
  background: linear-gradient(175deg, #212121 0%, rgba(34, 40, 49, 1) 100%);
  display: flex;
  flex-direction: column;
}

.game-preview__header {
  width: 100%;
  position: relative;
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  z-index: 2;
}

.game-preview__logo h1 {
  color: var(--white-color);
  font-size: 24px;
  margin: 0;

  :deep(span) {
    color: var(--primary);
  }
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px 24px;
}

.game-preview__benefit,
.game-preview__levels,
.game-preview__rules {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 20px;
}

.game-preview__benefit {
  background: rgba(var(--primary-rgb), 0.1);
  border: 1px solid var(--primary);
}

h2 {
  color: var(--white-color);
  margin: 0;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 600;
}

.benefit-content {
  color: var(--gray-color);
  font-size: 16px;
  line-height: 1.5;

  :deep(span) {
    color: var(--primary);
    font-weight: 600;
  }
}

.levels-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.levels-grid {
  display: flex;
  gap: 16px;
}

.level-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.level-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--white-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }
}

.level-number {
  font-size: 14px;
  color: var(--gray-color);
}

.level-item--completed .level-icon {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--dark-color);
}

.level-item--current .level-icon {
  background: rgba(var(--primary-rgb), 0.2);
  border-color: var(--primary);
  color: var(--primary);
}

.level-item--locked .level-icon {
  opacity: 0.5;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rule-item {
  color: var(--gray-color);
  font-size: 16px;
  line-height: 1.5;
  
  :deep(span) {
    color: var(--primary);
    font-weight: 600;
  }
}

.start-button {
  margin-top: auto;
  width: 100%;
  background: var(--primary);
  color: var(--dark-color);
  position: sticky;
  bottom: 16px;
}
</style> 