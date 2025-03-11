<template>
  <div class="game-preview">
    <div class="game-preview__header">
      <BackBtn @click="goBack" />
      <div class="game-preview__logo">
        <h1>{{ route.params.game }}</h1>
      </div>
      <InfoBtn @click="onOpenAboutGameDialog" />
    </div>

    <div class="container">
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
                <span v-if="level <= completedLevels" class="icon">🏆</span>
                <span v-else-if="level === completedLevels + 1" class="icon">▶</span>
                <span v-else class="icon">🔒</span>
              </div>
              <span class="level-number">{{ level }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="game-preview__skills">
        <h2>{{ $t('games.skills') }}</h2>
        <div class="skills-list">
          <div
            v-for="(skill, index) in skills"
            :key="index"
            class="skill-item"
          >
            <span class="skill-icon">{{ skill.icon }}</span>
            <div class="skill-info">
              <h3>{{ skill.title }}</h3>
              <p>{{ skill.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <Button
        class="mt-md start-button"
        @click="startGame(completedLevels + 1)"
      >
        {{ $t('games.startPlaying') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BackBtn from '@/components/BackBtn.vue'
import InfoBtn from '@/components/InfoBtn.vue'
import Button from '@/components/Button.vue'
import AboutGameDialog from '@/components/Dialogs/AboutGameDialog.vue'
import { openModal } from 'jenesius-vue-modal'

interface Skill {
  icon: string
  title: string
  description: string
}

const router = useRouter()
const route = useRoute()

const completedLevels = ref(3)
const totalLevels = ref(20)

const skills: Skill[] = [
  {
    icon: '📖',
    title: 'Reading and comprehension',
    description: 'Understanding and interpreting written information.'
  },
  {
    icon: '👁️',
    title: 'Visual search',
    description: 'Active scanning of the visual environment for a particular object or feature.'
  },
  {
    icon: '🧩',
    title: 'Problem-solving',
    description: 'Generating ingenious solutions in tough situations.'
  }
]

const startGame = async (level: number): Promise<void> => {
  if (level !== completedLevels.value + 1) return;
  try {
    await router.push(`/game/${route.params.game}`)
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

async function onOpenAboutGameDialog() {
  const modal = await openModal(AboutGameDialog, {
    game: route.params.game
  })
  modal.on('close', () => {
    modal.close()
  })
}
</script>

<style lang="scss" scoped>
.game-preview {
  min-height: 100vh;
  background: linear-gradient(175deg, #212121 0%, rgba(34, 40, 49, 1) 100%);
  display: flex;
  padding-bottom: 30px;
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
  text-transform: capitalize;
}


h2 {
  color: var(--white-color);
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
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
  padding-bottom: 8px;
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

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.skill-icon {
  font-size: 24px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.skill-info h3 {
  margin: 0;
  font-size: 16px;
  color: var(--white-color);
  font-weight: 600;
}

.skill-info p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--gray-color);
}

.start-button {
  width: 100%;
  background: var(--primary);
  color: var(--dark-color);
  position: sticky;
  bottom: 16px;
}
</style> 