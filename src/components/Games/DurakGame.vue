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
          <div class="deck" v-if="deck.length">
            <div class="card card-back"><span>🂠</span></div>
            <div class="trump-card card" v-if="trumpCard">
              <span :data-suit="trumpCard.suit">{{ getCardSymbol(trumpCard) }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

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
const trumpCard = ref<Card | null>(null);
const battleField = ref<BattlePair[]>([]);
const isPlayerTurn = ref(true);
const isGameActive = ref(false);

// Game state
const isAttacking = ref(true);
const canTakeCards = ref(false);
const canDone = ref(false);

// Card suits and ranks
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = [6, 7, 8, 9, 10, 11, 12, 13, 14]; // 11=J, 12=Q, 13=K, 14=A

function createDeck(): Card[] {
  const newDeck: Card[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      let value = rank.toString();
      if (rank === 11) value = 'J';
      if (rank === 12) value = 'Q';
      if (rank === 13) value = 'K';
      if (rank === 14) value = 'A';
      newDeck.push({ rank, suit, value });
    });
  });
  return shuffleDeck(newDeck);
}

function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// Функция сортировки карт
function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const aIsTrump = a.suit === trumpCard.value?.suit;
    const bIsTrump = b.suit === trumpCard.value?.suit;
    
    // Если одна карта козырная, а другая нет
    if (aIsTrump && !bIsTrump) return -1; // Козыри идут в начало (слева)
    if (!aIsTrump && bIsTrump) return 1;
    
    // Если обе карты козырные или обе не козырные, сортируем по рангу
    return a.rank - b.rank;
  });
}

function dealCards() {
  // Deal initial cards
  for (let i = 0; i < CARDS_PER_PLAYER; i++) {
    if (deck.value.length > 0) playerCards.value.push(deck.value.pop()!);
    if (deck.value.length > 0) opponentCards.value.push(deck.value.pop()!);
  }
  // Set trump card but don't remove it from deck
  if (deck.value.length > 0) {
    trumpCard.value = deck.value[deck.value.length - 1];
  }
  // Sort player's cards
  playerCards.value = sortCards(playerCards.value);
}

function getCardSymbol(card: Card): string {
  return `${card.value}${card.suit}`;
}

// Определяем, кто ходит первым
function determineFirstPlayer(): boolean {
  // Ищем самый младший козырь у игрока
  const playerLowestTrump = playerCards.value
    .filter(card => card.suit === trumpCard.value?.suit)
    .sort((a, b) => a.rank - b.rank)[0];

  // Ищем самый младший козырь у компьютера
  const opponentLowestTrump = opponentCards.value
    .filter(card => card.suit === trumpCard.value?.suit)
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
  
  if (isAttacking.value) {
    // Если поле пустое, можно ходить любой картой
    if (battleField.value.length === 0) return true;
    
    // Можно подкидывать только карты того же достоинства
    const ranks = battleField.value
      .flatMap(pair => [pair.attackCard, pair.defenseCard])
      .filter(card => card !== null)
      .map(card => card!.rank);
    
    // Проверяем, не превышает ли количество карт на столе количество карт у защищающегося
    const cardsOnTable = battleField.value.length;
    const defenderCards = isPlayerTurn.value ? opponentCards.value.length : playerCards.value.length;
    
    return ranks.includes(card.rank) && cardsOnTable < defenderCards;
  } else {
    // Защита
    const lastPair = battleField.value[battleField.value.length - 1];
    if (!lastPair || !lastPair.attackCard) return false;
    
    return canBeat(card, lastPair.attackCard);
  }
}

function canBeat(defenderCard: Card, attackerCard: Card): boolean {
  const isTrumpAttack = attackerCard.suit === trumpCard.value?.suit;
  const isTrumpDefense = defenderCard.suit === trumpCard.value?.suit;

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

// Computed properties for button states
const updateButtonStates = () => {
  // Can take cards when:
  // 1. Player is defending
  // 2. There are cards on the field
  // 3. Game is active
  canTakeCards.value = !isAttacking.value && 
                       battleField.value.length > 0 && 
                       isGameActive.value;

  // Can press "Done" when:
  // 1. Player is attacking and there are cards on the field
  // 2. Player is defending and all attack cards are beaten
  // 3. Game is active
  canDone.value = isGameActive.value && (
    (isAttacking.value && battleField.value.length > 0) ||
    (!isAttacking.value && battleField.value.every(pair => pair.defenseCard))
  );
};

function handleCardClick(card: Card) {
  if (!isGameActive.value || !canPlayCard(card)) return;

  if (isAttacking.value) {
    // Add new attack card
    battleField.value.push({
      attackCard: card,
      defenseCard: null
    });
    playerCards.value = playerCards.value.filter(c => c !== card);
    isAttacking.value = false;
    isPlayerTurn.value = false;
    
    updateButtonStates();
    // AI's turn to defend
    setTimeout(aiDefend, 1000);
  } else {
    // Defending against AI's attack
    const lastPair = battleField.value[battleField.value.length - 1];
    if (lastPair && lastPair.attackCard && canBeat(card, lastPair.attackCard)) {
      lastPair.defenseCard = card;
      playerCards.value = playerCards.value.filter(c => c !== card);
      isAttacking.value = true;
      isPlayerTurn.value = false;
      
      updateButtonStates();
      // AI's turn to attack
      setTimeout(aiAttack, 1000);
    }
  }
}

function aiAttack() {
  if (!isGameActive.value || battleField.value.length >= 6) {
    handleDone();
    return;
  }

  // Если поле пустое, ходим любой картой (предпочтительно не козырем)
  if (battleField.value.length === 0) {
    const nonTrumpCards = opponentCards.value
      .filter(card => card.suit !== trumpCard.value?.suit)
      .sort((a, b) => a.rank - b.rank);
    
    const cardToPlay = nonTrumpCards.length > 0 ? nonTrumpCards[0] : opponentCards.value[0];
    
    battleField.value.push({
      attackCard: cardToPlay,
      defenseCard: null
    });
    opponentCards.value = opponentCards.value.filter(c => c !== cardToPlay);
    isAttacking.value = false;
    isPlayerTurn.value = true;
    updateButtonStates();
    return;
  }

  // Подкидываем карты того же достоинства
  const ranks = battleField.value
    .flatMap(pair => [pair.attackCard, pair.defenseCard])
    .filter(card => card !== null)
    .map(card => card!.rank);

  const possibleAttacks = opponentCards.value
    .filter(card => ranks.includes(card.rank))
    .sort((a, b) => a.rank - b.rank);

  // Проверяем, не превышает ли количество карт на столе количество карт у защищающегося
  if (possibleAttacks.length > 0 && battleField.value.length < playerCards.value.length) {
    const attackCard = possibleAttacks[0];
    battleField.value.push({
      attackCard,
      defenseCard: null
    });
    opponentCards.value = opponentCards.value.filter(c => c !== attackCard);
    isAttacking.value = false;
    isPlayerTurn.value = true;
    updateButtonStates();
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
      const aIsTrump = a.suit === trumpCard.value?.suit;
      const bIsTrump = b.suit === trumpCard.value?.suit;
      if (aIsTrump && !bIsTrump) return 1;
      if (!aIsTrump && bIsTrump) return -1;
      return a.rank - b.rank;
    });

  if (possibleDefenses.length > 0) {
    // Отбиваемся самой младшей подходящей картой
    const defenseCard = possibleDefenses[0];
    lastPair.defenseCard = defenseCard;
    opponentCards.value = opponentCards.value.filter(c => c !== defenseCard);
    isAttacking.value = true;
    isPlayerTurn.value = true;
    updateButtonStates();
  } else {
    // Не можем отбиться, берем карты
    takeCards('opponent');
  }
}

function takeCards(player: 'player' | 'opponent') {
  const cards = battleField.value.flatMap(pair => 
    [pair.attackCard, pair.defenseCard].filter(card => card !== null)
  ) as Card[];

  if (player === 'player') {
    playerCards.value.push(...cards);
    // После того как игрок взял карты, ход переходит к сопернику
    isPlayerTurn.value = false;
    isAttacking.value = false;
    // Сортируем карты игрока
    playerCards.value = sortCards(playerCards.value);
  } else {
    opponentCards.value.push(...cards);
    // После того как соперник взял карты, ход переходит к игроку
    isPlayerTurn.value = true;
    isAttacking.value = true;
  }

  battleField.value = [];
  updateButtonStates();
  replenishCards();

  // Запускаем ход соперника, если его очередь
  if (!isPlayerTurn.value) {
    setTimeout(aiAttack, 1000);
  }
}

function handleTakeCards() {
  if (!canTakeCards.value) return;
  takeCards('player');
}

function handleDone() {
  if (!canDone.value) return;
  
  // Если все карты отбиты, сбрасываем их
  battleField.value = [];
  replenishCards();
  
  // Проверяем окончание игры
  if (deck.value.length === 0 && 
      (playerCards.value.length === 0 || opponentCards.value.length === 0)) {
    handleGameOver();
    return;
  }

  // Если игрок успешно отбился (все карты имеют пару), он получает право атаковать
  if (!isAttacking.value && battleField.value.every(pair => pair.defenseCard)) {
    isPlayerTurn.value = true;
  } else {
    // В противном случае (при атаке) ход переходит к противнику
    isPlayerTurn.value = !isPlayerTurn.value;
  }
  
  isAttacking.value = true;
  updateButtonStates();
  
  // Если ход компьютера
  if (!isPlayerTurn.value) {
    setTimeout(aiAttack, 1000);
  }
}

function endTurn() {
  battleField.value = [];
  replenishCards();
  
  // Check for game end
  if (deck.value.length === 0 && 
      (playerCards.value.length === 0 || opponentCards.value.length === 0)) {
    handleGameOver();
    return;
  }

  // Меняем ход на противоположный
  isPlayerTurn.value = !isPlayerTurn.value;
  isAttacking.value = true;
  updateButtonStates();
  
  // Если ход соперника, запускаем его атаку
  if (!isPlayerTurn.value) {
    setTimeout(aiAttack, 1000);
  }
}

function replenishCards() {
  let needSort = false;
  // Replenish cards to 6 if possible
  while (playerCards.value.length < 6 && deck.value.length > 1) {
    playerCards.value.push(deck.value.pop()!);
    needSort = true;
  }
  while (opponentCards.value.length < 6 && deck.value.length > 1) {
    opponentCards.value.push(deck.value.pop()!);
  }
  
  // If only trump card remains, give it to the next player who needs cards
  if (deck.value.length === 1) {
    const lastCard = deck.value[0];
    if (playerCards.value.length < 6 && isPlayerTurn.value) {
      playerCards.value.push(lastCard);
      deck.value = [];
      trumpCard.value = null;
      needSort = true;
    } else if (opponentCards.value.length < 6 && !isPlayerTurn.value) {
      opponentCards.value.push(lastCard);
      deck.value = [];
      trumpCard.value = null;
    }
  }

  // Sort player's cards if new cards were added
  if (needSort) {
    playerCards.value = sortCards(playerCards.value);
  }
}

function handleGameOver() {
  isGameActive.value = false;
  
  // Игрок выигрывает, если у него не осталось карт, а у компьютера остались
  if (playerCards.value.length === 0 && opponentCards.value.length > 0) {
    score.value++;
    if (score.value < WINNING_STREAK) {
      setTimeout(startGame, 2000);
    }
  } else if (opponentCards.value.length === 0 && playerCards.value.length > 0) {
    // Игрок проиграл (стал дураком)
    score.value = 0;
    setTimeout(startGame, 2000);
  } else if (deck.value.length === 0 && 
             playerCards.value.length === 1 && 
             opponentCards.value.length === 1) {
    // Особый случай: у обоих по одной карте
    if (isPlayerTurn.value) {
      // Если ход игрока и компьютер не может отбиться - игрок выиграл
      const playerCard = playerCards.value[0];
      const opponentCard = opponentCards.value[0];
      if (!canBeat(opponentCard, playerCard)) {
        score.value++;
      } else {
        score.value = 0;
      }
    } else {
      // Если ход компьютера и игрок не может отбиться - игрок проиграл
      const playerCard = playerCards.value[0];
      const opponentCard = opponentCards.value[0];
      if (!canBeat(playerCard, opponentCard)) {
        score.value = 0;
      } else {
        score.value++;
      }
    }
    if (score.value < WINNING_STREAK) {
      setTimeout(startGame, 2000);
    }
  }
}

function startGame() {
  deck.value = createDeck();
  playerCards.value = [];
  opponentCards.value = [];
  battleField.value = [];
  trumpCard.value = null;
  isGameActive.value = true;
  
  dealCards();
  
  // Определяем, кто ходит первым по младшему козырю
  isPlayerTurn.value = determineFirstPlayer();
  isAttacking.value = true;
  
  updateButtonStates();
  
  // Если первым ходит компьютер
  if (!isPlayerTurn.value) {
    setTimeout(aiAttack, 1000);
  }
}

onMounted(() => {
  startGame();
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
  border-radius: 8px;
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
  gap: 0;
  min-height: 120px;
  position: relative;
  padding: 20px 60px;

  .card {
    position: absolute;
    width: 120px;
    height: 180px;
    font-size: 2.4em;
    transform-origin: center 120%;
    transition: transform 0.3s ease;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        $rotation: ($i - 5) * 5deg;
        transform: rotate($rotation);
        z-index: $i;
      }
    }
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
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.deck-area {
  position: relative;
  width: 80px;
}

.battle-area {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  justify-content: center;
}

.card {
  min-width: 45px;
  height: 90px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
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

.card-pair {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.trump-card {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) rotate(90deg);

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
  border-radius: 8px;
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