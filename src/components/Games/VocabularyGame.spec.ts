import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import VocabularyGame from './VocabularyGame.vue';
import { nextTick } from 'vue';

// Mock external components and dependencies
vi.mock('@/components/Games/SuccessCounter.vue', () => ({
  default: {
    name: 'SuccessCounter',
    template: '<div class="success-counter"></div>'
  }
}));

vi.mock('@/components/Games/ProgressBar.vue', () => ({
  default: {
    name: 'ProgressBar',
    template: '<div class="progress-bar"></div>'
  }
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}));

// Mock vocabulary data
vi.mock('@/data/vocabulary', () => ({
  middleVocabulary: [
    { en: 'hello', ru: 'привет' },
    { en: 'world', ru: 'мир' },
    { en: 'test', ru: 'тест' },
    { en: 'game', ru: 'игра' },
    { en: 'word', ru: 'слово' }
  ]
}));

describe('VocabularyGame', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.useFakeTimers();
    wrapper = mount(VocabularyGame, {
      global: {
        stubs: {
          SuccessCounter: true,
          ProgressBar: true
        }
      }
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    wrapper.unmount();
  });

  it('initializes with correct default values', () => {
    expect(wrapper.vm.timeLeft).toBe(5);
    expect(wrapper.vm.score).toBe(0);
    expect(wrapper.vm.isStarted).toBe(true);
    expect(wrapper.vm.showResults).toBe(false);
  });

  it('displays four word options', () => {
    const cards = wrapper.findAll('.card');
    expect(cards).toHaveLength(4);
  });

  it('displays current translation', () => {
    const translation = wrapper.find('.translation');
    expect(translation.exists()).toBe(true);
    expect(translation.text()).toBeTruthy();
  });

  it('handles correct answer', async () => {
    const correctWord = wrapper.vm.correctWord;
    const cards = wrapper.findAll('.card');
    const correctCard = cards.find(card => card.text() === correctWord);
    
    await correctCard?.trigger('click');
    expect(wrapper.vm.score).toBe(1);
    expect(wrapper.vm.showResults).toBe(true);

    // Wait for next round
    vi.advanceTimersByTime(1000);
    await nextTick();

    expect(wrapper.vm.showResults).toBe(false);
  });

  it('handles incorrect answer', async () => {
    const correctWord = wrapper.vm.correctWord;
    const cards = wrapper.findAll('.card');
    const wrongCard = cards.find(card => card.text() !== correctWord);
    
    await wrongCard?.trigger('click');
    expect(wrapper.vm.score).toBe(0);
    expect(wrapper.vm.showResults).toBe(true);

    // Wait for next round
    vi.advanceTimersByTime(1500);
    await nextTick();

    expect(wrapper.vm.showResults).toBe(false);
  });

  it('handles timeout correctly', async () => {
    // Advance time to trigger timeout
    vi.advanceTimersByTime(5100);
    await nextTick();

    expect(wrapper.vm.score).toBe(0);
    expect(wrapper.vm.showResults).toBe(true);
  });

  it('updates timer correctly', async () => {
    const initialTime = wrapper.vm.timeLeft;
    
    vi.advanceTimersByTime(1000);
    await nextTick();
    
    expect(wrapper.vm.timeLeft).toBeLessThan(initialTime);
  });

  it('shuffles words correctly', () => {
    const firstWords = [...wrapper.vm.displayWords];
    wrapper.vm.startNewRound();
    const secondWords = [...wrapper.vm.displayWords];

    // Check that arrays are different (shuffled)
    expect(firstWords).not.toEqual(secondWords);
    // Check that arrays contain 4 items
    expect(firstWords).toHaveLength(4);
    expect(secondWords).toHaveLength(4);
  });

  it('stops game when winning streak is reached', async () => {
    // Set score to one less than winning streak
    wrapper.vm.score = 49;
    
    // Click correct answer
    const correctWord = wrapper.vm.correctWord;
    const cards = wrapper.findAll('.card');
    const correctCard = cards.find(card => card.text() === correctWord);
    
    await correctCard?.trigger('click');
    vi.advanceTimersByTime(1000);
    await nextTick();

    expect(wrapper.vm.isStarted).toBe(false);
  });

  it('resets game state on unmount', () => {
    wrapper.unmount();
    expect(wrapper.vm.score).toBe(0);
    expect(wrapper.vm.isStarted).toBe(false);
    expect(wrapper.vm.showResults).toBe(false);
    expect(wrapper.vm.timeLeft).toBe(5);
  });
}); 