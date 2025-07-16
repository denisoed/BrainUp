import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import ArticulationGame from './ArticulationGame.vue';
import { ArticulationPhase } from '../../../types/articulation';

// Mock MediaPipe and browser APIs
vi.mock('@mediapipe/tasks-vision', () => ({
  FaceLandmarker: {
    createFromOptions: vi.fn().mockResolvedValue({
      detectForVideo: vi.fn().mockReturnValue({ faceLandmarks: [] }),
      close: vi.fn()
    })
  },
  FilesetResolver: {
    forVisionTasks: vi.fn().mockResolvedValue({})
  },
  DrawingUtils: vi.fn().mockImplementation(() => ({}))
}));

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{
        stop: vi.fn()
      }]
    })
  }
});

// Mock modal
vi.mock('jenesius-vue-modal', () => ({
  openModal: vi.fn()
}));

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      games: {
        time: 'Time',
        score: 'Score',
        articulation: {
          ready: 'Ready!',
          loading: 'Loading camera...',
          getReady: 'Get ready!',
          perfect: 'Perfect!',
          keepTrying: 'Keep trying!',
          success: 'Exercise completed!',
          tryAgain: 'Try again',
          next: 'Next',
          retry: 'Retry',
          metrics: {
            smile: 'Smile',
            pucker: 'Pucker',
            open: 'Opening'
          }
        }
      }
    }
  }
});

describe('ArticulationGame', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(ArticulationGame, {
      global: {
        plugins: [i18n]
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('shows demo phase initially', async () => {
    expect(wrapper.find('.demo-phase').exists()).toBe(true);
    expect(wrapper.find('.exercise-title').exists()).toBe(true);
  });

  it('shows exercise information', () => {
    const exerciseTitle = wrapper.find('.exercise-title');
    expect(exerciseTitle.exists()).toBe(true);
  });

  it('has a start button', () => {
    const startButton = wrapper.find('.start-button');
    expect(startButton.exists()).toBe(true);
  });

  it('shows loading state initially', () => {
    const startButton = wrapper.find('.start-button');
    expect(startButton.attributes('disabled')).toBeDefined();
  });

  it('displays demo video placeholder when no media available', () => {
    const placeholder = wrapper.find('.demo-placeholder');
    expect(placeholder.exists()).toBe(true);
    expect(placeholder.find('.demo-icon').text()).toBe('👄');
  });

  it('shows success counter component', () => {
    expect(wrapper.findComponent({ name: 'SuccessCounter' }).exists()).toBe(true);
  });

  it('initializes with first exercise', () => {
    // The component should start with the first exercise loaded
    expect(wrapper.vm.currentExercise).toBeTruthy();
    expect(wrapper.vm.currentExercise.id).toBe('lip_round_smile');
  });

  it('has correct initial state', () => {
    expect(wrapper.vm.currentPhase).toBe(ArticulationPhase.Demo);
    expect(wrapper.vm.score).toBe(0);
    expect(wrapper.vm.holdTimer).toBe(0);
    expect(wrapper.vm.targetsAchieved).toBe(false);
  });

  it('formats time correctly', () => {
    const formattedTime = wrapper.vm.formatTime(3500);
    expect(formattedTime).toBe('3s');
  });

  it('calculates hold progress correctly', () => {
    wrapper.vm.holdTimer = 1000;
    wrapper.vm.currentExercise = { holdMs: 2000 };
    expect(wrapper.vm.holdProgress).toBe(50);
  });
}); 