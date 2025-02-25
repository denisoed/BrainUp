<template>
  <div class="leaderboard-page flex column">
    <div class="container">
      <div class="flex justify-between items-start">
        <h1 v-html="$t('leaderboard.title')" />
        <BackBtn class="leaderboard-page_back" @click="$router.back()" />
      </div>
    </div>

    <div class="leaderboard-page_content">
      <!-- Top 3 Winners -->
      <div class="top-winners">
        <!-- Second Place -->
        <div class="winner-card winner-card--second">
          <div class="avatar-wrapper">
            <div class="winner-position">🥈</div>
            <UserAvatar
              :src="topWinners[1].avatar"
              :alt="topWinners[1].firstName"
              :name="topWinners[1].firstName"
              size="medium"
            />
          </div>
          <div class="winner-info">
            <div class="winner-name">
              {{ topWinners[1].firstName }}<br>
              {{ topWinners[1].lastName }}
            </div>
            <div class="winner-score">{{ topWinners[1].score }}</div>
          </div>
        </div>

        <!-- First Place -->
        <div class="winner-card winner-card--first">
          <div class="avatar-wrapper">
            <div class="winner-position">🥇</div>
            <UserAvatar
              :src="topWinners[0].avatar"
              :alt="topWinners[0].firstName"
              :name="topWinners[0].firstName"
              size="large"
            />
          </div>
          <div class="winner-info">
            <div class="winner-name">
              {{ topWinners[0].firstName }}<br>
              {{ topWinners[0].lastName }}
            </div>
            <div class="winner-score">{{ topWinners[0].score }}</div>
          </div>
        </div>

        <!-- Third Place -->
        <div class="winner-card winner-card--third">
          <div class="avatar-wrapper">
            <div class="winner-position">🥉</div>
            <UserAvatar
              :src="topWinners[2].avatar"
              :alt="topWinners[2].firstName"
              :name="topWinners[2].firstName"
              size="medium"
            />
          </div>
          <div class="winner-info">
            <div class="winner-name">
              {{ topWinners[2].firstName }}<br>
              {{ topWinners[2].lastName }}
            </div>
            <div class="winner-score">{{ topWinners[2].score }}</div>
          </div>
        </div>
      </div>

      <div class="current-user-card">
        <div class="player-position">#{{ currentUser.position }}</div>
        <UserAvatar
          :src="currentUser.avatar"
          :alt="$t('leaderboard.current_user.you')"
          :name="$t('leaderboard.current_user.you')"
        />
        <div class="player-info">
          <div class="player-name">
            {{ $t('leaderboard.current_user.you') }}
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
          <div class="player-position">{{ index + 4 }}</div>
          <UserAvatar
            :src="player.avatar"
            :alt="player.firstName"
            :name="player.firstName"
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
import { ref } from 'vue';
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
  firstName: 'current_user.you',
  lastName: '',
  score: '1,245',
  avatar: '',
  position: 12,
  gamesPlayed: 48,
  winRate: 65
});

const topWinners = ref<Player[]>([
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
  }
]);

const otherPlayers = ref([
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

.top-winners {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  margin: 40px 0;
  padding: 0 16px;
}

.winner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 16px;
  border-radius: 16px;
  width: 120px;
  transition: transform 0.3s ease;

  .avatar-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .winner-position {
    position: absolute;
    top: -12px;
    right: -12px;
    z-index: 2;
    font-weight: bold;
    font-size: 24px;
  }

  &--first {
    padding-top: 24px;
    transform: scale(1.2);
    animation: pulse 2s infinite;

    .winner-position {
      color: #FFD700;
    }
  }

  &--second {
    .winner-position {
      color: #C0C0C0;
    }
  }

  &--third {
    .winner-position {
      color: #CD7F32;
    }
  }

  &:hover {
    transform: translateY(-8px);
  }
}

.winner-info {
  text-align: center;
  margin-top: 12px;
}

.winner-name {
  color: var(--white-color);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.2;
}

.winner-score {
  color: var(--primary);
  font-size: 16px;
  font-weight: bold;
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