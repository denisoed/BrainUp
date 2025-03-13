<template>
  <div class="durak-game flex column items-center justify-center">

    <div class="stats">
      <!-- Add turn indicator -->
      <div class="turn-indicator" v-if="isGameActive">
        {{ isAttacking ? (isPlayerTurn ? "🎮 Ваш ход" : "🤖 Ход соперника") : (isPlayerTurn ? "🛡️ Вы отбиваетесь" : "🛡️ Соперник отбивается") }}
      </div>
      <div class="score">🏆 {{ $t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
    </div>

    <div class="game-board mt-lg mb-lg">
      <!-- Opponent's cards (face down) -->
      <div class="opponent-cards">
        <div 
          v-for="(card, index) in opponentCards" 
          :key="`opponent-${index}`" 
          class="card card-back"
        >
          <span>🂠</span>
        </div>
      </div>

      <!-- Playing field -->
      <div class="playing-field">
        <!-- Deck and trump card -->
        <div class="deck-area">
          <div class="deck flex items-center justify-center" v-if="deck.length">
            <div class="card card-back"><span>🂠</span></div>
            <div class="trump-card card" v-if="gameKozyr">
              <span :data-suit="gameKozyr.suit">{{ getCardSymbol(gameKozyr) }}</span>
            </div>
          </div>
        </div>

        <!-- Attack and defense cards -->
        <div class="battle-area">
          <div v-for="(pair, index) in battleField" :key="`battle-${index}`" class="card-pair">
            <div class="attack-card" v-if="pair.attackCard">
              <span :data-suit="pair.attackCard.suit">{{ getCardSymbol(pair.attackCard) }}</span>
            </div>
            <div class="defense-card" v-if="pair.defenseCard">
              <span :data-suit="pair.defenseCard.suit">{{ getCardSymbol(pair.defenseCard) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Player's cards -->
      <div class="player-cards">
        <div class="player-cards_scroll">
          <div 
            v-for="(card, index) in playerCards" 
            :key="`player-${index}`"
            class="card"
            @click="handleCardClick(card)"
          >
            <span :data-suit="card.suit">{{ getCardSymbol(card) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Game controls -->
    <div class="controls" v-if="isGameActive">
      <button 
        class="control-btn"
        @click="handleTakeCards"
        :disabled="!canTakeCards"
      >
        {{ $t('games.durak.take') }}
      </button>
      <button 
        class="control-btn"
        @click="handleDone"
        :disabled="!canDone"
      >
        {{ $t('games.durak.done') }}
      </button>
      <button 
        class="control-btn"
        @click="handleFinishThrowing"
        v-if="canFinishThrowing"
      >
        {{ $t('games.durak.finishThrowing') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { openModal } from 'jenesius-vue-modal';
import { useRouter } from 'vue-router';

const router = useRouter();

const WINNING_STREAK = 3;
const CARDS_PER_PLAYER = 6;

interface Card {
  rank: number;
  suit: string;
  value: string;
}

interface BattlePair {
  attackCard: Card | null;
  defenseCard: Card | null;
}

const score = ref(0);
const deck = ref<Card[]>([]);
const playerCards = ref<Card[]>([]);
const opponentCards = ref<Card[]>([]);
const trumpSuit = ref<string | null>(null);
const battleField = ref<BattlePair[]>([]);
const isPlayerTurn = ref(true);
const isGameActive = ref(false);

// Game state
const isAttacking = ref(true);
const canTakeCards = computed(() => {
  return !isAttacking.value && 
         battleField.value.length > 0 && 
         isGameActive.value;
});
const canDone = computed(() => {
  return isGameActive.value && (
    (isAttacking.value && battleField.value.length > 0 && !isOpponentTaking.value) ||
    (!isAttacking.value && battleField.value.every(pair => pair.defenseCard))
  );
});

// Add new ref for tracking if opponent is taking cards
const isOpponentTaking = ref(false);
const canFinishThrowing = computed(() => {
  return isOpponentTaking.value;
});

// Card suits and ranks
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = [6, 7, 8, 9, 10, 11, 12, 13, 14]; // 11=J, 12=Q, 13=K, 14=A

// Добавим новое состояние для хранения рангов взятых карт
const takenCardsRanks = ref(new Set<number>());

// Добавляем новые состояния
const allCards = ref<Card[]>([]); // Все карты в игре
const playedCards = ref<Card[]>([]); // Сыгранные карты
const gameKozyr = ref<Card | null>(null); // Козырная карта

function createDeck(): Card[] {
  // Создаем все карты, если их еще нет
  if (allCards.value.length === 0) {
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        let value = rank.toString();
        if (rank === 11) value = 'J';
        if (rank === 12) value = 'Q';
        if (rank === 13) value = 'K';
        if (rank === 14) value = 'A';
        allCards.value.push({ rank, suit, value });
      });
    });
  }
  
  const shuffledDeck = shuffleDeck([...allCards.value]);
  
  // Отделяем козырную карту сразу при создании колоды
  gameKozyr.value = shuffledDeck.pop()!;
  trumpSuit.value = gameKozyr.value.suit;
  
  return shuffledDeck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// Обновляем функцию сортировки карт
function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const aIsTrump = a.suit === trumpSuit.value;
    const bIsTrump = b.suit === trumpSuit.value;
    
    // Если одна карта козырная, а другая нет
    if (aIsTrump && !bIsTrump) return -1; // Козыри идут в начало (слева)
    if (!aIsTrump && bIsTrump) return 1;
    
    // Если обе карты козырные или обе не козырные, сортируем по рангу по убыванию
    return b.rank - a.rank;
  });
}

function dealCards() {
  // Просто раздаем карты игрокам из колоды
  for (let i = 0; i < CARDS_PER_PLAYER; i++) {
    if (deck.value.length > 0) playerCards.value.push(deck.value.pop()!);
    if (deck.value.length > 0) opponentCards.value.push(deck.value.pop()!);
  }
  
  // Sort player's cards
  playerCards.value = sortCards(playerCards.value);
}

function getCardSymbol(card: Card): string {
  return `${card.value}${card.suit}`;
}

// Обновляем функцию определения первого игрока
function determineFirstPlayer(): boolean {
  // Ищем самый младший козырь у игрока
  const playerLowestTrump = playerCards.value
    .filter(card => card.suit === trumpSuit.value)
    .sort((a, b) => a.rank - b.rank)[0];

  // Ищем самый младший козырь у компьютера
  const opponentLowestTrump = opponentCards.value
    .filter(card => card.suit === trumpSuit.value)
    .sort((a, b) => a.rank - b.rank)[0];

  // Если у игрока нет козырей
  if (!playerLowestTrump) return false;
  // Если у компьютера нет козырей
  if (!opponentLowestTrump) return true;
  
  // У кого козырь младше, тот и ходит первым
  return playerLowestTrump.rank < opponentLowestTrump.rank;
}

function canPlayCard(card: Card): boolean {
  if (!isGameActive.value || !isPlayerTurn.value) return false;
  
  if (!isAttacking.value) {
    const lastPair = battleField.value[battleField.value.length - 1];
    return lastPair?.attackCard ? canBeat(card, lastPair.attackCard) : false;
  }

  // Если оппонент берет карты
  if (isOpponentTaking.value) {
    return takenCardsRanks.value.has(card.rank) && 
           battleField.value.length < opponentCards.value.length;
  }

  // Если поле пустое
  if (battleField.value.length === 0) return true;

  // Собираем ранги карт на столе
  const ranks = new Set(
    battleField.value.flatMap(pair => [pair.attackCard, pair.defenseCard])
      .filter((c): c is Card => c !== null)
      .map(c => c.rank)
  );

  const unbeatenCards = battleField.value.filter(pair => !pair.defenseCard).length;
  return ranks.has(card.rank) && unbeatenCards < opponentCards.value.length;
}

function canBeat(defenderCard: Card, attackerCard: Card): boolean {
  const isTrumpAttack = attackerCard.suit === trumpSuit.value;
  const isTrumpDefense = defenderCard.suit === trumpSuit.value;

  // Если атакующая карта козырная
  if (isTrumpAttack) {
    // Бить можно только козырем большего достоинства
    return isTrumpDefense && defenderCard.rank > attackerCard.rank;
  }

  // Если атакующая карта не козырная
  // Можно бить козырем или картой той же масти большего достоинства
  return isTrumpDefense || 
         (defenderCard.suit === attackerCard.suit && defenderCard.rank > attackerCard.rank);
}

function handleCardClick(card: Card) {
  try {
    if (!isGameActive.value || !canPlayCard(card)) return;
    
    if (isAttacking.value) {
      // Add new attack card
      battleField.value.push({
        attackCard: card,
        defenseCard: null
      });
      playerCards.value = playerCards.value.filter(c => c !== card);
      
      // Если оппонент не в процессе взятия карт, передаем ему ход
      if (!isOpponentTaking.value) {
        isAttacking.value = false;
        isPlayerTurn.value = false;
        setTimeout(aiDefend, 1000);
      }
    } else {
      // Defending against AI's attack
      const lastPair = battleField.value[battleField.value.length - 1];
      if (lastPair && lastPair.attackCard && canBeat(card, lastPair.attackCard)) {
        lastPair.defenseCard = card;
        playerCards.value = playerCards.value.filter(c => c !== card);
        isAttacking.value = true;
        isPlayerTurn.value = false;
        
        setTimeout(aiAttack, 1000);
      }
    }
  } catch (error) {
    console.error('Error handling card click:', error);
    // Можно добавить пользовательское уведомление об ошибке
  }
}

function aiAttack() {
  // Проверяем только активность игры
  if (!isGameActive.value) {
    handleDone();
    return;
  }

  // Если поле пустое, ходим любой картой (предпочтительно не козырем)
  if (battleField.value.length === 0) {
    const nonTrumpCards = opponentCards.value
      .filter(card => card.suit !== trumpSuit.value)
      .sort((a, b) => a.rank - b.rank);
    
    const cardToPlay = nonTrumpCards.length > 0 ? nonTrumpCards[0] : opponentCards.value[0];
    
    battleField.value.push({
      attackCard: cardToPlay,
      defenseCard: null
    });
    opponentCards.value = opponentCards.value.filter(c => c !== cardToPlay);
    isAttacking.value = false;
    isPlayerTurn.value = true;
    return;
  }

  // Собираем все ранги карт на столе (и атакующих, и отбивающих)
  const allCards = battleField.value.flatMap(pair => [
    pair.attackCard,
    pair.defenseCard
  ]).filter((c): c is Card => c !== null);
  
  const ranks = new Set(allCards.map(c => c.rank));

  // Находим все возможные карты для подкидывания
  const possibleAttacks = opponentCards.value
    .filter(card => ranks.has(card.rank))
    .sort((a, b) => a.rank - b.rank);

  // Проверяем:
  // 1. Есть ли карты для подкидывания
  // 2. Количество неотбитых карт меньше количества карт у игрока
  const unbeatenCards = battleField.value.filter(pair => !pair.defenseCard).length;
  const canAttack = possibleAttacks.length > 0 && 
                    unbeatenCards < playerCards.value.length;

  if (canAttack) {
    const attackCard = possibleAttacks[0];
    battleField.value.push({
      attackCard,
      defenseCard: null
    });
    opponentCards.value = opponentCards.value.filter(c => c !== attackCard);
    isAttacking.value = false;
    isPlayerTurn.value = true;
  } else {
    handleDone();
  }
}

function aiDefend() {
  const lastPair = battleField.value[battleField.value.length - 1];
  if (!lastPair || !lastPair.attackCard) return;

  // Находим все карты, которыми можно отбиться
  const possibleDefenses = opponentCards.value
    .filter(card => canBeat(card, lastPair.attackCard!))
    .sort((a, b) => {
      // Сначала пытаемся бить не козырями
      const aIsTrump = a.suit === trumpSuit.value;
      const bIsTrump = b.suit === trumpSuit.value;
      if (aIsTrump && !bIsTrump) return 1;
      if (!aIsTrump && bIsTrump) return -1;
      return a.rank - b.rank;
    });

  if (possibleDefenses.length > 0) {
    // Отбиваемся самой младшей подходящей картой
    const defenseCard = possibleDefenses[0];
    lastPair.defenseCard = defenseCard;
    opponentCards.value = opponentCards.value.filter(c => c !== defenseCard);
    
    // Сохраняем ранги всех карт на столе для возможности подкидывания
    const allCards = battleField.value.flatMap(pair => [
      pair.attackCard,
      pair.defenseCard
    ]).filter((c): c is Card => c !== null);
    
    takenCardsRanks.value = new Set(allCards.map(c => c.rank));
    
    isAttacking.value = true;
    isPlayerTurn.value = true;
  } else {
    // Не можем отбиться, берем карты
    takeCards('opponent');
  }
}

function takeCards(player: 'player' | 'opponent') {
  // Получаем все карты с поля
  const cards = battleField.value.flatMap(pair => 
    [pair.attackCard, pair.defenseCard].filter((card): card is Card => card !== null)
  );

  if (player === 'player') {
    playerCards.value.push(...cards);
    playerCards.value = sortCards(playerCards.value);
    isPlayerTurn.value = false;
  } else {
    opponentCards.value.push(...cards);
    takenCardsRanks.value = new Set(cards.map(card => card.rank));
    isOpponentTaking.value = true;
    isPlayerTurn.value = true;
    canFinishThrowing.value = true;
  }

  isAttacking.value = true;
  battleField.value = [];

  if (player === 'player') {
    replenishCards();
    setTimeout(aiAttack, 1000);
  }
}

function handleTakeCards() {
  if (!canTakeCards.value) return;
  takeCards('player');
}

function handleDone() {
  if (!canDone.value) return;
  
  // Перемещаем все карты с поля в сыгранные
  battleField.value.forEach(pair => {
    if (pair.attackCard) moveCardToPlayed(pair.attackCard);
    if (pair.defenseCard) moveCardToPlayed(pair.defenseCard);
  });
  
  battleField.value = [];
  replenishCards();
  
  // Проверяем окончание игры
  if (deck.value.length === 0 && 
      (playerCards.value.length === 0 || opponentCards.value.length === 0)) {
    handleGameEnd(playerCards.value.length === 0);
    return;
  }

  // Если игрок успешно отбился (все карты имеют пару), он получает право атаковать
  if (!isAttacking.value && battleField.value.every(pair => pair.defenseCard)) {
    isPlayerTurn.value = true;
    isAttacking.value = true;
  } else {
    // В противном случае (при атаке) ход переходит к противнику
    isPlayerTurn.value = !isPlayerTurn.value;
    isAttacking.value = true;
  }
  
  // Если ход компьютера
  if (!isPlayerTurn.value) {
    setTimeout(aiAttack, 1000);
  }
}

function moveCardToPlayed(card: Card) {
  // Проверяем наличие карты перед удалением
  if (!card) return;
  
  playedCards.value.push(card);
  
  // Используем Set для быстрого поиска карты
  const cardKey = `${card.rank}-${card.suit}`;
  const cardSet = new Set(playerCards.value.map(c => `${c.rank}-${c.suit}`));
  
  if (cardSet.has(cardKey)) {
    playerCards.value = playerCards.value.filter(c => c !== card);
  } else {
    opponentCards.value = opponentCards.value.filter(c => c !== card);
  }
}

function replenishCards() {
  let needSort = false;
  
  // Добираем карты до 6
  while (playerCards.value.length < 6 && deck.value.length > 0) {
    playerCards.value.push(deck.value.pop()!);
    needSort = true;
  }
  
  while (opponentCards.value.length < 6 && deck.value.length > 0) {
    opponentCards.value.push(deck.value.pop()!);
  }
  
  // Если колода закончилась, проверяем необходимость отдать козырную карту
  if (deck.value.length === 0 && gameKozyr.value) {
    const playerNeedsCards = playerCards.value.length < 6;
    const opponentNeedsCards = opponentCards.value.length < 6;
    
    if ((playerNeedsCards && isPlayerTurn.value) || 
        (opponentNeedsCards && !isPlayerTurn.value)) {
      if (isPlayerTurn.value) {
        playerCards.value.push(gameKozyr.value);
        needSort = true;
      } else {
        opponentCards.value.push(gameKozyr.value);
      }
      
      // Убираем козырную карту из игры
      gameKozyr.value = null;
      trumpSuit.value = null;
    }
  }

  if (needSort) {
    playerCards.value = sortCards(playerCards.value);
  }
}

function handleGameEnd(playerWon: boolean) {
  isGameActive.value = false;
  if (playerWon) {
    score.value++;
    if (score.value >= WINNING_STREAK) {
      onOpenGameVictoryDialog();
      return;
    }
  } else {
    score.value = 0;
  }
  setTimeout(() => {
    startNewGame();
  }, 1000);
}

function startNewGame() {
  // Очищаем все состояния
  playedCards.value = [];
  deck.value = createDeck();
  playerCards.value = [];
  opponentCards.value = [];
  battleField.value = [];
  isGameActive.value = true;

  dealCards();
  
  // Определяем, кто ходит первым по младшему козырю
  isPlayerTurn.value = determineFirstPlayer();
  isAttacking.value = true;
  
  // Если первым ходит компьютер
  if (!isPlayerTurn.value) {
    setTimeout(aiAttack, 1000);
  }
  
  takenCardsRanks.value.clear();
}

// Add new function to handle finishing throwing cards
function handleFinishThrowing() {
  isOpponentTaking.value = false;
  canFinishThrowing.value = false;
  takenCardsRanks.value.clear(); // Очищаем сохраненные ранги
  battleField.value = [];
  replenishCards();
  
  // После подкидывания ход остается у игрока
  isPlayerTurn.value = true;
  isAttacking.value = true;
}

// Добавляем функцию для показа модального окна
async function onOpenGameVictoryDialog() {
  const modal = await openModal(GameVictoryDialog, {
    score: score.value,
  })
  modal.on('finish', () => {
    modal.close();
    router.back();
  })
  modal.on('restart', () => {
    modal.close();
    startNewGame();
  })
}

onMounted(() => {
  startNewGame();
});
</script>

<style scoped lang="scss">
.durak-game {
  height: calc(100vh - 100px);
}

.stats {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.turn-indicator {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 4px;
  color: var(--white-color);
  font-weight: 500;
}

.game-board {
  background: var(--card-bg);
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.opponent-cards {
  display: flex;
  justify-content: center;
  position: relative;

  .card {
    min-width: auto;
    height: auto;
  }
}

.player-cards {
  display: flex;
  justify-content: center;

  &_scroll {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 8px;
    -webkit-overflow-scrolling: touch; // Для плавного скролла на iOS
    
    // Скрываем скроллбар
    &::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none;
    -ms-overflow-style: none;
  }
}

.playing-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 150px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.deck-area {
  position: relative;

  .deck {
    .card {
      min-width: auto;
      height: auto;
    }
    
    .trump-card {
      z-index: 2;
      padding: 8px 4px;
    }

    .card-back {
      font-size: 44px;
      line-height: normal;
      z-index: 1;
    }
  }
}

.battle-area {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  justify-content: center;

  .card-pair {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;

    .attack-card,
    .defense-card {
      border: 2px solid var(--border-color);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4em;
      background: white;
      color: black;
      z-index: 1;
      padding: 8px 4px;

      // Add red color for hearts and diamonds
      &:has(span[data-suit="♥"]),
      &:has(span[data-suit="♦"]) {
        color: red;
      }
    }

    .defense-card {
      position: absolute;
      top: 40px;
      left: 10px;
      z-index: 2;
    }
  }
}

.card {
  min-width: 45px;
  height: 90px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  background: white;
  color: black;
  cursor: pointer;
  transition: transform 0.2s;

  &.selectable:hover {
    transform: translateY(-10px);
  }

  &.card-back {
    background: var(--primary-color);
    color: white;
  }

  // Add red color for hearts and diamonds
  &:has(span[data-suit="♥"]),
  &:has(span[data-suit="♦"]) {
    color: red;
  }
}

.trump-card {
  &.card {
    background: white;
    
    // Наследуем стили для цветов масти из основного класса .card
    &:has(span[data-suit="♥"]),
    &:has(span[data-suit="♦"]) {
      color: red;
    }
  }
}

.controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }
}

// Card colors
.card {
  &:has(span[data-suit="♥"]),
  &:has(span[data-suit="♦"]) {
    color: red;
  }
}
</style> 