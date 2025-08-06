<template>
  <div class="spelling-game flex column items-center justify-center">
    <GameHeader 
      :level="levelNumber"
      :difficulty="currentDifficulty"
      :time-left="timeLeft"
      :score="score"
      :winning-streak="WINNING_STREAK"
      :progress="(timeLeft / TIME_LIMIT) * 100"
    />
    
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

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import GameHeader from '@/components/Games/GameHeader.vue';
import GameVictoryDialog from '@/components/Dialogs/GameVictoryDialog.vue';
import { openModal } from 'jenesius-vue-modal';
import { useGameProgress } from '@/composables/useGameProgress';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// Используем composable для управления прогрессом
const gameId = route.params.game;
const { currentLevel, completeLevel, getDifficultyByLevel } = useGameProgress(gameId);

// Game state
const levelNumber = ref(route.query.level ? Number(route.query.level) : currentLevel.value);

const TIME_LIMIT = 10;
const WINNING_STREAK = 15;

const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const isStarted = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const selectedWord = ref('');
const currentWord = ref('');
const wrongWord = ref('');
const correctWords = ref<string[]>([]);
const displayWords = ref<string[]>([]);

let timerInterval: ReturnType<typeof setInterval>;

// Определяем сложность на основе текущего уровня
const currentDifficulty = computed(() => getDifficultyByLevel(levelNumber.value));

// Русские слова
const correctWordsRu = [
  'автобус', 'билет', 'ворота', 'голова', 
  'дерево', 'ежевика', 'жираф', 'забор',
  'иголка', 'капуста', 'лимон', 'магазин',
  'небо', 'окно', 'письмо', 'работа',
  'собака', 'трава', 'улица', 'фрукты',
  'абсолютный', 'аккуратный', 'великолепный', 'гармония',
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
  'перрон', 'теннис',
  'аккомпанемент', 'аплодисменты', 'ассистент', 'баллотироваться',
  'беспрецедентный', 'велосипедист', 'галлюцинация', 'грамматический',
  'дезинфекция', 'дилетантский', 'дискриминация', 'жонглировать',
  'иллюминация', 'иммунитет', 'интеллектуал', 'каллиграфия',
  'классификация', 'коллоквиум', 'коммуникация', 'компромиссный',
  'конгрессмен', 'контрастный', 'конференция', 'корреспондент',
  'кристаллизация', 'лаборантский', 'массажистка', 'металлический',
  'модернизация', 'наваждение', 'оппозиция', 'ориентация',
  'пассажирский', 'перспектива', 'пессимистка', 'прерогатива',
  'привилегия', 'приоритет', 'прогрессивный', 'пропаганда',
  'профессия', 'процессуальный', 'репрессивный', 'рецензия',
  'сентиментальный', 'симметричный', 'стипендия', 'суггестия',
  'тенденция', 'терраса'
];

const wrongWordsRu = [
  'афтобус', 'белет', 'варота', 'галава',
  'дериво', 'ижевика', 'жыраф', 'зобор',
  'иголька', 'копуста', 'лемон', 'могазин',
  'неба', 'акно', 'песьмо', 'робота',
  'сабака', 'трова', 'улеца', 'фрукти',
  'абсалютный', 'акуратный', 'виликолепный', 'гормония',
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
  'перон', 'тенис',
  'акомпанемент', 'оплодисменты', 'асистент', 'балотироваться',
  'беспрецендентный', 'велосепедист', 'галюцинация', 'граматический',
  'дезынфекция', 'дилитантский', 'дискреминация', 'жонглеровать',
  'илюминация', 'имунитет', 'интелектуал', 'калиграфия',
  'класификация', 'колоквиум', 'комуникация', 'компромисный',
  'конгресмен', 'контрасный', 'конфиренция', 'кореспондент',
  'кристализация', 'лаборанский', 'масажистка', 'металический',
  'модернезация', 'наваждение', 'опозиция', 'ориентация',
  'пасажирский', 'перспиктива', 'песимистка', 'прирогатива',
  'привелегия', 'преоритет', 'прогресивный', 'пропоганда',
  'професия', 'процесуальный', 'репресивный', 'рицензия',
  'сентементальный', 'симетричный', 'стипендия', 'сугестия',
  'тенденция', 'тераса'
];

// English words
const correctWordsEn = [
  'apple', 'book', 'chair', 'door',
  'eight', 'fish', 'green', 'house',
  'juice', 'king', 'light', 'mouse',
  'night', 'paper', 'queen', 'river',
  'smile', 'table', 'water', 'young',
  'accommodation', 'achievement', 'acquaintance', 'beginning',
  'believe', 'business', 'calendar', 'college',
  'commerce', 'construct', 'discover', 'emphasize',
  'environment', 'excellent', 'exercise', 'experience',
  'familiar', 'foreign', 'government', 'guarantee',
  'happened', 'immediately', 'independent', 'intelligence',
  'interesting', 'knowledge', 'laboratory', 'language',
  'maintenance', 'mathematics', 'millennium', 'necessary',
  'occasion', 'occurrence', 'parliament', 'permanent',
  'possession', 'preferred', 'presence', 'privilege',
  'pronunciation', 'psychology', 'questionnaire', 'receive',
  'recommend', 'reference', 'relevant', 'restaurant',
  'abbreviation', 'accessible', 'accidentally', 'accommodate',
  'acknowledgment', 'acquaintance', 'algorithm', 'allegiance',
  'ambassador', 'ammunition', 'appearance', 'appropriate',
  'assassination', 'attendance', 'beautiful', 'beneficial',
  'boundary', 'bulletin', 'campaign', 'category',
  'cemetery', 'characteristic', 'colleague', 'commission',
  'commitment', 'competition', 'conscience', 'conscious',
  'consensus', 'consistent', 'convenient', 'correspondence',
  'curriculum', 'deceive', 'defendant', 'dependent',
  'description', 'desperate', 'development', 'difference',
  'dilemma', 'disappear', 'discipline', 'embarrass',
  'equipment', 'equivalent', 'especially', 'exaggerate',
  'excellent', 'existence', 'extension', 'familiar'
];

const wrongWordsEn = [
  'appel', 'booc', 'chare', 'dor',
  'eigth', 'fich', 'gren', 'hause',
  'juce', 'kign', 'lite', 'mowse',
  'nite', 'papre', 'qween', 'rivr',
  'smyle', 'tabel', 'warter', 'yung',
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
  'recomend', 'referance', 'relevent', 'resturant',
  'abreviation', 'accessable', 'accidentaly', 'accomodate',
  'acknowledgement', 'acknowlegement', 'algoritm', 'alegiance',
  'ambasador', 'amunition', 'appearence', 'apropriate',
  'assasination', 'attendence', 'beutiful', 'benificial',
  'boundry', 'bullitin', 'campain', 'catagory',
  'cemetary', 'caracteristic', 'collegue', 'comission',
  'comitment', 'compitition', 'concience', 'concious',
  'consencus', 'consistant', 'conveniant', 'correspondance',
  'curiculum', 'decieve', 'defendend', 'dependant',
  'discription', 'desparate', 'developement', 'diffrence',
  'dilema', 'dissapear', 'disipline', 'embarass',
  'equiptment', 'equivelent', 'especialy', 'exagerate',
  'excelent', 'existance', 'extention', 'familar'
];

// Выбор массива слов в зависимости от языка
const words = computed(() => {
  return t('games.tongueTwister.lang') === 'ru-RU' ? correctWordsRu : correctWordsEn;
});

const wrongWords = computed(() => {
  return t('games.tongueTwister.lang') === 'ru-RU' ? wrongWordsRu : wrongWordsEn;
});

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
  const randomIndex = Math.floor(Math.random() * words.value.length);
  
  // Получаем правильное слово и его версию с ошибкой
  const correctWord = words.value[randomIndex];
  wrongWord.value = wrongWords.value[randomIndex];
  
  // Получаем 5 случайных правильных слов (исключая выбранное)
  const otherWords = words.value
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
        onOpenGameVictoryDialog();
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

async function onOpenGameVictoryDialog() {
  // Сохраняем прогресс уровня
  completeLevel(levelNumber.value);
  
  const modal = await openModal(GameVictoryDialog, {
    score: score.value,
  })
  modal.on('finish', () => {
    modal.close();
    router.back();
  })
  modal.on('continue', () => {
    modal.close();
    levelNumber.value = levelNumber.value + 1;
    resetGame();
    startGame();
  })
  modal.on('restart', () => {
    modal.close();
    resetGame();
    startGame();
  })
}

onMounted(() => {
  resetGame();
  startGame();
});

onUnmounted(() => {
  resetGame();
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
  flex: 1;
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