<template>
  <div class="tongue-twister-game flex column items-center justify-center">
    
    <template v-if="isStarted">
      <div class="stats">
        <div class="timer">⏳ {{ $t('games.time') }}: <span>{{ timeLeft.toFixed(1) }}</span></div>
        <div class="score">🏆 {{ $t('games.score') }}: <span>{{ score }}/{{ WINNING_STREAK }}</span></div>
      </div>
      <ProgressBar :progress="(timeLeft / TIME_LIMIT) * 100" />
    </template>

    <div 
      class="tongue-twister mt-lg mb-lg"
      :class="{
        'success': showSuccessColor,
        'error': showErrorColor
      }"
    >
      {{ isStarted ? currentTwister : $t('games.tongueTwister.ready') }}
    </div>

    <canvas 
      ref="visualizer" 
      class="voice-visualizer mb-lg"
      width="300"
      height="100"
    ></canvas>

    <button 
      v-if="!isStarted" 
      class="mic-button mt-md" 
      @click="startGame"
    >
      🎤 {{ $t('games.tongueTwister.start') }}
    </button>

    <div 
      v-else 
      class="mic-status listening mt-md"
    >
      🎤 {{ $t('games.tongueTwister.listening') }}
    </div>

    <SuccessCounter :value="`${score}/${WINNING_STREAK}`" :show="score > 0" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SuccessCounter from '@/components/Games/SuccessCounter.vue';
import ProgressBar from '@/components/Games/ProgressBar.vue';

const { t } = useI18n();

const TIME_LIMIT = 7;
const WINNING_STREAK = 15;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const visualizer = ref(null);
let audioContext;
let analyser;
let dataArray;
let animationFrame;

const timeLeft = ref(TIME_LIMIT);
const score = ref(0);
const isStarted = ref(false);
const currentTwister = ref('');
const isUpdatingTwister = ref(false);
let timerInterval;

const showSuccessColor = ref(false);
const showErrorColor = ref(false);

const twistersRu = [
  'Карл у Клары украл кораллы а Клара у Карла украла кларнет',
  'На дворе трава на траве дрова',
  'Шла Саша по шоссе и сосала сушку',
  'Четыре чёрненьких чумазеньких чертёнка',
  'Ехал Грека через реку видит Грека в реке рак',
  'Бык тупогуб тупогубенький бычок у быка бела губа была тупа',
  'Дятел дуб долбил долбил не додолбил и ушел',
  'От топота копыт пыль по полю летит',
  'Три сороки тараторки тараторили на горке',
  'Всех скороговорок не перескороговоришь не перевыскороговоришь',
  'Стоит поп на копне, колпак на попе, копна под попом, поп под колпаком.',
  'Везёт Сенька Саньку с Сонькой на санках',
  'У осы не усы не усищи а усики',
  '16 шли мышей и шесть нашли грошей',
  'Цапля чахла цапля сохла цапля сдохла',
  'Протокол про протокол протоколом запротоколировали',
  'Летели лебеди с лебедятами',
  'Наш Полкан попал в капкан',
  'Бык тупогуб тупогубенький бычок у быка бела губа была тупа',
  'Расскажите про покупки про какие про покупки про покупки про покупки расскажите',
  'Рыла свинья белорыла тупорыла весь двор перерыла',
  'У четырех черепашек по четыре черепашонка',
  'Тридцать три корабля лавировали лавировали да не вылавировали',
  'Сшит колпак не по-колпаковски выколпаковать бы надо колпак',
  'Клара у карла украла кораллы а карл у клары украл кларнет',
  'Пришел прокоп кипел укроп ушел прокоп кипел укроп',
  'Говорил попугай попугаю попугай я тебя попугаю',
  'Сыворотка из-под простокваши',
  'Шли сорок мышей нашли сорок грошей два мыша поплоше нашли по два гроша',
  'Водовоз вез воду из водопровода',
  'На горе Арарат рвала Варвара виноград',
  'Ткет ткач ткани на платки Тане',
  'Жужжит жужелица жужжит кружится',
  'Два щенка щека к щеке щиплют щетку в уголке',
  'Яшма в замше замша в яшме',
  'У ежа ежата у ужа ужата',
  'Косарь Касьян косой косит косо',
  'Мамаша Ромаше дала сыворотку из-под простокваши',
  'Шла Саша по шоссе и сосала сушку'
];

const twistersEn = [
  'She sells seashells by the seashore',
  'Peter Piper picked a peck of pickled peppers',
  'How much wood would a woodchuck chuck',
  'Red lorry yellow lorry',
  'Fuzzy Wuzzy was a bear',
  'I scream you scream we all scream for ice cream',
  'Betty bought some butter but the butter was bitter',
  'Six slick slim slimy snakes slowly sliding southward',
  'Unique New York unique New York you know you need unique New York',
  'Three free throws free throws three',
  'Fresh fried fish fish fresh fried',
  'Lesser leather never weathered wetter weather better',
  'A proper copper coffee pot',
  'She sees cheese seas she sees seas cheese',
  'Truly rural truly rural',
  'Toy boat toy boat toy boat',
  'Greek grapes Greek grapes Greek grapes',
  'Nine nice night nurses nursing nicely',
  'Flash message flash message flash message',
  'Clean clams crammed in clean cans',
  'Round and round the rugged rocks the ragged rascal ran',
  'Which wristwatches are Swiss wristwatches',
  'Thirty-three thousand thoughtful boys thought they would make thundering noise',
  'Four fine fresh fish for free',
  'Six sticky skeletons six sticky skeletons',
  'Seventy-seven benevolent elephants',
  'Purple paper people paper purple people',
  'Friendly Frank flips fine flapjacks',
  'Thin things think thick thoughts',
  'Stupid superstition stupid superstition',
  'Selfish shellfish selfish shellfish',
  'Crisp crusts crackle and crunch',
  'Stupid superstition stupid superstition',
  'Six slick slim slimy snakes',
  'Thirty-three thirsty thundering thoroughbreds',
  'Two tried and true tridents',
  'Freshly fried flying fish flying freely',
  'Brave brigadiers brandished bright blades',
  'Scissors sizzle tizzle mizzle',
  'Mixed biscuits mixed biscuits mixed biscuits'
];

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = t('games.tongueTwister.lang');

function getRandomTwister() {
  const twisters = recognition.lang === 'ru-RU' ? twistersRu : twistersEn;
  return twisters[Math.floor(Math.random() * twisters.length)];
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = TIME_LIMIT;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0.1) {
      timeLeft.value -= 0.1;
    }
    if (timeLeft.value <= 0.1) {
      handleGameEnd(false);
    }
  }, 100);
}

function handleGameEnd(success) {
  if (isUpdatingTwister.value) return;
  isUpdatingTwister.value = true;
  
  if (success) {
    showSuccessColor.value = true;
    score.value++;
  } else {
    showErrorColor.value = true;
    score.value = 0;
  }
  
  recognition.stop();
  
  setTimeout(() => {
    showSuccessColor.value = false;
    showErrorColor.value = false;
    currentTwister.value = getRandomTwister();
    startTimer();
    isUpdatingTwister.value = false;
    recognition.start();
  }, 500);
}

async function setupAudioVisualization() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    source.connect(analyser);
    
    drawVisualizer();
  } catch (err) {
    console.error('Error accessing microphone:', err);
  }
}

function drawVisualizer() {
  if (!visualizer.value) return;
  
  const canvas = visualizer.value;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#FF6B6B');
  gradient.addColorStop(0.5, '#4ECDC4');
  gradient.addColorStop(1, '#45B7D1');

  animationFrame = requestAnimationFrame(drawVisualizer);
  
  analyser.getByteFrequencyData(dataArray);
  
  ctx.clearRect(0, 0, width, height);
  
  const barWidth = width / dataArray.length;
  let barHeight;
  let x = 0;
  
  for (let i = 0; i < dataArray.length; i++) {
    barHeight = (dataArray[i] / 255) * height;
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    
    x += barWidth;
  }
}

async function startGame() {
  isStarted.value = true;
  startTimer();
  recognition.start();
  await setupAudioVisualization();
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"\-—–()[\]{}«»„"'`]/g, '')
    .replace(/ё/g, 'е')
    .replace(/й/g, 'и')
    .replace(/ъ/g, 'ь')
    .replace(/\s+/g, ' ')
    .trim();
}

recognition.onresult = (event) => {
  const spokenText = normalizeText(event.results[0][0].transcript);
  const currentTwisterLower = normalizeText(currentTwister.value);
  
  console.log('Сказано:', spokenText);
  console.log('Должно быть:', currentTwisterLower);
  
  const isCorrect = spokenText === currentTwisterLower;
  handleGameEnd(isCorrect);
};

recognition.onend = () => {
  if (!isStarted.value) {
    recognition.stop();
  } else if (!isUpdatingTwister.value) {
    recognition.start();
  }
};

onMounted(async () => {
  await setupAudioVisualization();
  currentTwister.value = getRandomTwister();
});

onUnmounted(() => {
  clearInterval(timerInterval);
  isStarted.value = false;
  recognition.stop();
  if (audioContext) {
    audioContext.close();
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped lang="scss">
.tongue-twister-game {
  height: calc(100vh - 100px);
}

.tongue-twister {
  font-size: 24px;
  text-align: center;
  line-height: 1.4;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 12px;
  max-width: 600px;
  transition: background-color 0.2s ease;

  &.success {
    color: rgba(75, 181, 67, 1);
  }

  &.error {
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

.mic-status {
  font-size: 16px;
  color: var(--white-color);
  
  &.listening {
    animation: pulse 1.5s infinite;
  }
}

.mic-button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: var(--primary);
  color: var(--dark-color);
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.voice-visualizer {
  background: var(--card-bg);
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  height: 100px;
}
</style> 