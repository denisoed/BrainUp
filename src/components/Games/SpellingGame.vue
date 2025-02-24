<template>
  <div class="spelling-game flex column items-center justify-center">
    <template v-if="isStarted">
      <div class="stats">
        <div class="timer">⏳ {{ t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
        <div class="score">🏆 {{ t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
      </div>
      <ProgressBar :progress="(timeLeft / TIME_LIMIT) * 100" />
      
      <div class="words mb-md mt-md">
        <div
          v-for="(word, index) in displayWords"
          :key="index"
          class="word"
          :class="{
            'word--success': showSuccess && word === wrongWord,
            'word--error': showError && word === selectedWord
          }"
          @click="checkAnswer(word)"
        >
          {{ word }}
        </div>
      </div>
    </template>

    <template v-else>
      <div class="spelling-title mt-lg mb-lg">
        {{ t('games.spelling.title') }}
      </div>
      <button 
        class="start-button"
        @click="startGame"
      >
        {{ t('games.spelling.start') }}
      </button>
    </template>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import ProgressBar from '@/components/Games/ProgressBar.vue';

const { t } = useI18n();

const TIME_LIMIT = 10;
const WINNING_STREAK = 15;

// Русские слова
const correctWordsRu = [
  'абсолютный', 'аккуратный', 'великолепный', 'грамматика',
  'дискуссия', 'интеллигент', 'компьютер', 'лаборатория',
  'металлический', 'оппонент', 'параллельный', 'профессор',
  'режиссёр', 'симметрия', 'территория', 'университет',
  'фотография', 'хоккеист', 'цивилизация', 'эффективный',
  'велосипед', 'галерея', 'директор', 'искусство',
  'календарь', 'миллион', 'оранжевый', 'пассажир',
  'революция', 'телеграмма', 'фестиваль', 'экспрессия',
  'аппетит', 'коллектив', 'коммерсант', 'кристаллический',
  'массажист', 'программа', 'рассчитать', 'терраса',
  'аккордеон', 'бассейн', 'грамматика', 'иллюстрация',
  'коллекция', 'миллиметр', 'параллель', 'пассивный',
  'перрон', 'теннис'
];

const wrongWordsRu = [
  'абалютный', 'акуратный', 'виликолепный', 'граматика',
  'дискусия', 'интелигент', 'компютер', 'лаборотория',
  'металический', 'опонент', 'паралельный', 'професор',
  'режисёр', 'симетрия', 'територия', 'универститет',
  'фотография', 'хокеист', 'цевилизация', 'эфективный',
  'велосепед', 'галирея', 'дериктор', 'искуство',
  'календарь', 'милион', 'оранжывый', 'пасажир',
  'революцыя', 'телеграма', 'фистиваль', 'экспресия',
  'апетит', 'колектив', 'комерсант', 'кристалический',
  'масажист', 'програма', 'расчитать', 'тераса',
  'акордеон', 'басеин', 'граматика', 'илюстрация',
  'колекция', 'милиметр', 'паралель', 'пасивный',
  'перон', 'тенис'
];

// English words
const correctWordsEn = [
  'accommodation', 'achievement', 'acquaintance', 'beginning',
  'believe', 'business', 'calendar', 'colleague',
  'commitment', 'committee', 'completely', 'conscious',
  'definitely', 'disappear', 'disappoint', 'embarrass',
  'environment', 'excellent', 'exercise', 'experience',
  'familiar', 'foreign', 'government', 'guarantee',
  'happened', 'immediately', 'independent', 'intelligence',
  'interesting', 'knowledge', 'laboratory', 'language',
  'maintenance', 'mathematics', 'millennium', 'necessary',
  'occasion', 'occurrence', 'parliament', 'permanent',
  'possession', 'preferred', 'presence', 'privilege',
  'pronunciation', 'psychology', 'questionnaire', 'receive',
  'recommend', 'reference', 'relevant', 'restaurant'
];

const wrongWordsEn = [
  'accomodation', 'achievment', 'acquantance', 'begining',
  'beleive', 'busines', 'calender', 'colleage',
  'commitmen', 'commitee', 'completly', 'concious',
  'definately', 'dissapear', 'dissapoint', 'embarass',
  'enviroment', 'excelent', 'exercize', 'experiance',
  'familar', 'foriegn', 'goverment', 'garantee',
  'happend', 'immediatly', 'independant', 'inteligence',
  'intresting', 'knowlege', 'labratory', 'languege',
  'maintainance', 'mathmatics', 'millenium', 'neccesary',
  'ocassion', 'occurence', 'parlament', 'permanant',
  'posession', 'prefered', 'presance', 'priviledge',
  'pronounciation', 'psycology', 'questionaire', 'recieve',
  'recomend', 'referance', 'relevent', 'resturant'
];

// Выбор массива слов в зависимости от языка
const correctWords = computed(() => {
  return t('games.tongueTwister.lang') === 'ru-RU' ? correctWordsRu : correctWordsEn;
});

const wrongWords = computed(() => {
  return t('games.tongueTwister.lang') === 'ru-RU' ? wrongWordsRu : wrongWordsEn;
});

const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const isStarted = ref(false);
const displayWords = ref<string[]>([]);
const wrongWord = ref('');
const selectedWord = ref('');
const showSuccess = ref(false);
const showError = ref(false);

let timerInterval: ReturnType<typeof setInterval>;

function shuffleArray(array: string[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateWords() {
  // Получаем случайный индекс для слова с ошибкой
  const randomIndex = Math.floor(Math.random() * correctWords.value.length);
  
  // Получаем правильное слово и его версию с ошибкой
  const correctWord = correctWords.value[randomIndex];
  wrongWord.value = wrongWords.value[randomIndex];
  
  // Получаем 5 случайных правильных слов (исключая выбранное)
  const otherWords = correctWords.value
    .filter(word => word !== correctWord)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  // Формируем массив для отображения
  displayWords.value = [...otherWords, wrongWord.value];
  // Перемешиваем массив
  displayWords.value = shuffleArray(displayWords.value);
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = TIME_LIMIT;
  timerInterval = setInterval(() => {
    timeLeft.value -= 0.1;
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 100);
}

function handleTimeout() {
  clearInterval(timerInterval);
  showError.value = true;
  score.value = 0;
  setTimeout(() => {
    startNewRound();
  }, 500);
}

function checkAnswer(word: string) {
  selectedWord.value = word;
  clearInterval(timerInterval);
  if (word === wrongWord.value) {
    showSuccess.value = true;
    score.value++;
    setTimeout(() => {
      if (score.value >= WINNING_STREAK) {
        isStarted.value = false;
      } else {
        startNewRound();
      }
    }, 500);
  } else {
    showError.value = true;
    score.value = 0;
    setTimeout(() => {
      startNewRound();
    }, 500);
  }
}

function startNewRound() {
  selectedWord.value = '';
  showSuccess.value = false;
  showError.value = false;
  generateWords();
  startTimer();
}

function startGame() {
  isStarted.value = true;
  score.value = 0;
  startNewRound();
}

function resetGame() {
  clearInterval(timerInterval);
  isStarted.value = false;
  score.value = 0;
  showSuccess.value = false;
  showError.value = false;
  timeLeft.value = TIME_LIMIT;
}

onMounted(() => {
  resetGame();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped lang="scss">
.spelling-game {
  height: calc(100vh - 100px);
}

.spelling-title {
  font-size: 24px;
  text-align: center;
  line-height: 1.4;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 12px;
  max-width: 600px;
}

.words {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.word {
  width: calc(50% - 5px);
  font-size: 20px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg);
  transition: all 0.3s ease;
  text-align: center;
  padding: 10px;

  &--success {
    border-color: rgba(75, 181, 67, 1);
    color: rgba(75, 181, 67, 1);
  }

  &--error {
    border-color: rgba(255, 107, 107, 1);
    color: rgba(255, 107, 107, 1);
  }
}

.stats {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timer, .score {
  font-size: 18px;
}

.start-button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: var(--primary);
  color: var(--dark-color);
  font-size: 16px;
  cursor: pointer;
}

.how-to-play {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: var(--white-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}
</style> 