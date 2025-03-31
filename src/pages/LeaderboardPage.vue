<template>
  <div class="leaderboard-page flex column">
    <div class="container">
      <div class="flex justify-between items-start">
        <h1 v-html="$t('leaderboard.title')" />
        <BackBtn class="leaderboard-page_back" @click="$router.back()" />
      </div>
    </div>

    <div class="leaderboard-page_content">
      <div class="current-user-card">
        <div class="player-position">#{{ currentUser.position }}</div>
        <UserAvatar
          :src="currentUser.avatar"
          :alt="currentUser.firstName || $t('leaderboard.current_user.you')"
          :name="currentUser.firstName || $t('leaderboard.current_user.you')"
          size="sm"
        />
        <div class="player-info">
          <div class="player-name">
            {{ currentUser.firstName || $t('leaderboard.current_user.you') }}
            <div class="player-stats">
              {{ $t('leaderboard.stats.games', { count: currentUser.gamesPlayed }) }}
            </div>
            <div class="player-stats">
              {{ $t('leaderboard.stats.win_rate', { rate: currentUser.winRate }) }}
            </div>
          </div>
          <div class="player-score">{{ currentUser.score }}</div>
        </div>
      </div>

      <!-- Other Players List -->
      <div class="other-players">
        <div 
          v-for="(player, index) in otherPlayers" 
          :key="index"
          class="player-card"
        >
          <div class="player-position">#{{ index + 1 }}</div>
          <UserAvatar
            :src="player.avatar"
            :alt="player.firstName"
            :name="player.firstName"
            size="sm"
          />
          <div class="player-info">
            <div class="player-name">
              {{ player.firstName }} {{ player.lastName }}
            </div>
            <div class="player-score">
              {{ player.score }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BackBtn from '@/components/BackBtn.vue';
import UserAvatar from '@/components/UI/UserAvatar.vue';

interface Player {
  firstName: string;
  lastName: string;
  score: string;
  avatar: string;
  gamesPlayed?: number;
  winRate?: number;
  position: number;
}

const currentUser = ref<Player>({
  firstName: '',
  lastName: '',
  score: '1,245',
  avatar: '',
  position: 12,
  gamesPlayed: 48,
  winRate: 65
});

const otherPlayers = ref([
  {
    firstName: 'John',
    lastName: 'Doe',
    score: '2,547',
    avatar: '',
    gamesPlayed: 156,
    winRate: 78,
    position: 1
  },
  {
    firstName: 'Alice',
    lastName: 'Smith',
    score: '2,142',
    avatar: '',
    position: 2
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    score: '1,958',
    avatar: '',
    position: 3
  },
  {
    firstName: 'Emma',
    lastName: 'Wilson',
    score: '1,847',
    avatar: '',
    position: 4
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    score: '1,756',
    avatar: '',
    position: 5
  },
  {
    firstName: 'Sarah',
    lastName: 'Davis',
    score: '1,634',
    avatar: '',
    position: 6
  },
  {
    firstName: 'James',
    lastName: 'Miller',
    score: '1,532',
    avatar: '',
    position: 7
  },
  {
    firstName: 'Lisa',
    lastName: 'Anderson',
    score: '1,421',
    avatar: '',
    position: 8
  }
]);

// Функция для получения данных пользователя из Telegram Mini App API
const getTelegramUserData = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
    
    if (tgUser) {
      // Обновляем данные текущего пользователя
      currentUser.value = {
        ...currentUser.value,
        firstName: tgUser.first_name || '',
        lastName: tgUser.last_name || '',
        avatar: tgUser.photo_url || '',
      };
    }
  }
};

// Функция для получения игровой статистики пользователя с сервера
const fetchUserGameStats = async () => {
  try {
    // Здесь должен быть запрос к вашему API для получения статистики
    // Пример:
    // const response = await fetch('/api/user/stats');
    // const data = await response.json();
    // 
    // currentUser.value = {
    //   ...currentUser.value,
    //   score: data.score,
    //   position: data.position,
    //   gamesPlayed: data.gamesPlayed,
    //   winRate: data.winRate
    // };
    
    // Временная заглушка для демонстрации
    console.log('Fetching user game stats...');
  } catch (error) {
    console.error('Error fetching user stats:', error);
  }
};

onMounted(() => {
  // Получаем данные пользователя из Telegram Mini App API
  getTelegramUserData();
  
  // Получаем игровую статистику пользователя
  fetchUserGameStats();
});

// Добавляем определение типа для window.Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            language_code?: string;
          }
        };
        ready(): void;
        expand(): void;
        close(): void;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.leaderboard-page {
  :deep(h1) {
    font-size: 32px;
    color: var(--white-color);
    font-weight: bold;
    line-height: normal;
    margin: 0;

    span {
      color: var(--primary);
    }
  }

  &_content {
    width: 100%;
  }
}

.other-players {
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin: 0 16px;
}

.player-card {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.player-position {
  width: 24px;
  color: var(--white-color);
  opacity: 0.7;
  font-weight: 500;
  margin-right: 12px;
  text-align: center;
}

.player-info {
  margin-left: 12px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .player-name {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }
}

.player-score {
  color: var(--primary);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;

  .score-icon {
    width: 16px;
    height: 16px;
  }
}

.current-user-card {
  margin: 20px 16px;
  padding: 16px;
  background: rgba(var(--primary-rgb), 0.1);
  border: 1px solid var(--primary);
  border-radius: 16px;
  display: flex;
  align-items: center;

  .player-stats {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 4px;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
  }
}
</style> 