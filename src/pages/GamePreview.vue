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
      <LevelsGrid
        :game-id="gameKey"
        :total-levels="totalLevels"
        :on-level-click="startGame"
      />

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
        @click="() => startGame()"
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
import LevelsGrid from '@/components/LevelsGrid.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

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

const gameIcon = computed(() => gameIcons[gameKey.value])

// Получаем правила игры
const gameRules = computed(() => {
  const rules: string[] = []
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
  totalLevels.value = levels ? Object.keys(levels).length : 20;
}

onMounted(() => {
  getGameLevels();
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
  z-index: 0;
  opacity: 0.05;
  pointer-events: none;
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