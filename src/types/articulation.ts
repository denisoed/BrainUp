/**
 * Metric types for articulation exercises
 */
export type MetricId = 'lipRound' | 'lipStretch' | 'jawOpen';

/**
 * Direction for metric comparison
 */
export type Direction = '>' | '<';

/**
 * Target metric for an exercise
 */
export interface TargetMetric {
  /** The metric to measure */
  metricId: MetricId;
  /** Threshold value (0-1) */
  threshold: number;
  /** Comparison direction */
  direction: Direction;
}

/**
 * Calculated metrics from face landmarks
 */
export interface FaceMetrics {
  /** Lip stretch (smile) metric */
  lipStretch: number;
  /** Lip round (pucker) metric */
  lipRound: number;
  /** Jaw open metric */
  jawOpen: number;
}

/**
 * Articulation exercise configuration
 */
export interface ArticulationExercise {
  /** Unique exercise identifier */
  id: string;
  /** Exercise title */
  title: string;
  /** Path to demonstration media */
  media: string;
  /** Target metrics to achieve */
  targets: TargetMetric[];
  /** Time to hold position in milliseconds */
  holdMs: number;
  /** Exercise description */
  description?: string;
}

/**
 * Exercise execution phases
 */
export enum ArticulationPhase {
  Demo = 'demo',
  WaitReady = 'waitReady',
  Running = 'running',
  Success = 'success',
  Fail = 'fail'
}

/**
 * Exercise execution state
 */
export interface ArticulationState {
  /** Current phase */
  phase: ArticulationPhase;
  /** Current exercise */
  currentExercise: ArticulationExercise | null;
  /** Time held in correct position */
  holdTimer: number;
  /** Current face metrics */
  currentMetrics: FaceMetrics | null;
  /** Exercise score/progress */
  score: number;
  /** Whether targets are currently met */
  targetsAchieved: boolean;
} 