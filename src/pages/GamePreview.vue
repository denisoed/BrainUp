<template>
  <div class="game-preview">
    <img :src="gameIcon" alt="abstract" class="game-icon" />
    <div class="game-preview__header mb-md">
      <div class="game-preview__logo flex items-center gap-2">
        <h1 v-html="gameName" />
      </div>
      <BackBtn @click="goBack" />
    </div>

    <div class="container">
      <!-- Блок с пользой игры -->
      <section class="game-preview__benefit mb-md">
        <div class="benefit-content" v-html="gameBenefit"></div>
      </section>
  
      <!-- Блок с уровнями -->
      <section class="game-preview__levels mb-md">
        <h2>{{ $t('games.levels') }}</h2>
        <div class="levels-scroll" ref="levelsScrollRef">
          <div class="levels-grid">
            <div
              v-for="level in totalLevels"
              :key="level"
              class="level-item"
              :class="{
                'level-item--completed': level < CURRENT_LEVEL,
                'level-item--current': level === CURRENT_LEVEL,
                'level-item--locked': level > CURRENT_LEVEL
              }"
              @click="startGame(level)"
              :ref="el => setCurrentLevelRef(el, level)"
            >
              <div class="level-icon">
                <span v-if="level < CURRENT_LEVEL" class="flex items-center justify-center check-icon">
                  <CheckIcon />
                </span>
                <span v-else-if="level === CURRENT_LEVEL" class="flex items-center justify-center play-icon">
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

      <!-- Блок с правилами -->
      <section class="game-preview__rules mb-md">
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
        @click="() => startGame(CURRENT_LEVEL)"
      >
        {{ $t('games.practise') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import data from '@/data'
import gameIcons from '@/data/gameIcons'
import BackBtn from '@/components/BackBtn.vue'
import Button from '@/components/Button.vue'
import CheckIcon from '@/components/Icons/CheckIcon.vue'
import PlayIcon from '@/components/Icons/PlayIcon.vue'
import LockIcon from '@/components/Icons/LockIcon.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const CURRENT_LEVEL = Number(localStorage.getItem(`${route.params.game}-current-level`) || 1);

const totalLevels = ref(20)
const levelsScrollRef = ref<HTMLElement | null>(null)
const currentLevelRef = ref<HTMLElement | null>(null)

// Функция для установки ref текущего уровня
const setCurrentLevelRef = (el: Element | null, level: number): void => {
  if (el instanceof HTMLElement && level === CURRENT_LEVEL) {
    currentLevelRef.value = el;
  }
}

// Получаем информацию о текущей игре
const gameKey = computed(() => route.params.game as string)

// Получаем описание пользы игры
const gameBenefit = computed(() => {
  return t(`games.${gameKey.value}.about.descr`)
})

const gameName = computed(() => {
  return t(`games.${gameKey.value}.about.title`)
})

const gameIcon = computed(() => gameIcons[gameKey.value])

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

// Функция для прокрутки к текущему уровню
const scrollToCurrentLevel = (): void => {
  if (levelsScrollRef.value && currentLevelRef.value) {
    const scrollContainer = levelsScrollRef.value;
    const currentLevelElement = currentLevelRef.value;
    
    // Получаем позицию элемента относительно контейнера
    const containerRect = scrollContainer.getBoundingClientRect();
    const elementRect = currentLevelElement.getBoundingClientRect();
    
    // Вычисляем позицию для прокрутки (центрирование элемента)
    const scrollLeft = elementRect.left - containerRect.left - 
                      (containerRect.width / 2) + (elementRect.width / 2);
    
    // Плавная прокрутка к элементу
    scrollContainer.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  }
}

const startGame = async (level?: number): Promise<void> => {
  if (level && level > CURRENT_LEVEL) return;
  try {
    router.push(`/game/${route.params.game}?level=${level}`)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const goBack = async (): Promise<void> => {
  try {
    await router.back()
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

async function getGameLevels() {
  const levels = data[gameKey.value]?.levels;
  totalLevels.value = Object.keys(levels).length || 20;
}

onMounted(() => {
  getGameLevels();
  setTimeout(scrollToCurrentLevel, 100);
});
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
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  z-index: 2;
}

.game-icon {
  width: 300px;
  height: 300px;
  position: fixed;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  opacity: 0.05;
}

.game-preview__logo h1 {
  color: var(--white-color);
  font-size: 24px;
  margin: 0;

  :deep(span) {
    color: var(--primary);
  }
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
  gap: 8px;
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

.level-item--locked {
  .level-icon,
  .level-number {
    opacity: 0.5;
  }
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
  background: var(--white-color);
  color: var(--dark-color);
  position: sticky;
  bottom: 16px;
  z-index: 2;
}
</style> 