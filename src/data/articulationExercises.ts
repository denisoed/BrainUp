import type { ArticulationExercise } from '../types/articulation';

/**
 * Available articulation exercises
 */
export const articulationExercises: ArticulationExercise[] = [
  {
    id: 'lip_round_smile',
    title: 'Трубочка → Улыбка',
    description: 'Сложите губы в трубочку, затем широко улыбнитесь',
    media: '/articulation/lip_round_smile.webm',
    targets: [
      { metricId: 'lipRound', threshold: 0.35, direction: '>' },
      { metricId: 'lipStretch', threshold: 0.60, direction: '>' }
    ],
    holdMs: 2000
  },
  {
    id: 'jaw_open_close',
    title: 'Открываем рот',
    description: 'Медленно откройте рот как можно шире',
    media: '/articulation/jaw_open.webm',
    targets: [
      { metricId: 'jawOpen', threshold: 0.4, direction: '>' }
    ],
    holdMs: 1500
  },
  {
    id: 'lip_stretch',
    title: 'Широкая улыбка',
    description: 'Улыбнитесь как можно шире, не открывая рот',
    media: '/articulation/smile.webm',
    targets: [
      { metricId: 'lipStretch', threshold: 0.7, direction: '>' },
      { metricId: 'jawOpen', threshold: 0.1, direction: '<' }
    ],
    holdMs: 2000
  },
  {
    id: 'lip_pucker',
    title: 'Поцелуй',
    description: 'Вытяните губы вперед как для поцелуя',
    media: '/articulation/pucker.webm',
    targets: [
      { metricId: 'lipRound', threshold: 0.5, direction: '>' },
      { metricId: 'lipStretch', threshold: 0.3, direction: '<' }
    ],
    holdMs: 1500
  },
  {
    id: 'mouth_alternate',
    title: 'О → А',
    description: 'Произносите звуки "О" и "А" попеременно',
    media: '/articulation/o_a.webm',
    targets: [
      { metricId: 'jawOpen', threshold: 0.3, direction: '>' },
      { metricId: 'lipRound', threshold: 0.2, direction: '>' }
    ],
    holdMs: 1000
  }
];

/**
 * Get exercise by ID
 */
export function getExerciseById(id: string): ArticulationExercise | undefined {
  return articulationExercises.find(exercise => exercise.id === id);
}

/**
 * Get random exercise
 */
export function getRandomExercise(): ArticulationExercise {
  const randomIndex = Math.floor(Math.random() * articulationExercises.length);
  return articulationExercises[randomIndex];
}

/**
 * Get exercises for difficulty level
 */
export function getExercisesByDifficulty(level: 'easy' | 'medium' | 'hard'): ArticulationExercise[] {
  switch (level) {
    case 'easy':
      return articulationExercises.filter(ex => ex.targets.length === 1);
    case 'medium':
      return articulationExercises.filter(ex => ex.targets.length === 2);
    case 'hard':
      return articulationExercises.filter(ex => ex.targets.length > 2);
    default:
      return articulationExercises;
  }
} 