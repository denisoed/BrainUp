import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import type { 
  ArticulationExercise, 
  ArticulationState, 
  FaceMetrics,
  TargetMetric 
} from '../types/articulation';
import { ArticulationPhase } from '../types/articulation';

/**
 * Controller for articulation exercises using MediaPipe Face Landmarker
 */
export class ArticulationController {
  private faceLandmarker: FaceLandmarker | null = null;
  private drawingUtils: DrawingUtils | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private stream: MediaStream | null = null;
  private isInitialized: boolean = false;

  private state: ArticulationState = {
    phase: ArticulationPhase.Demo,
    currentExercise: null,
    holdTimer: 0,
    currentMetrics: null,
    score: 0,
    targetsAchieved: false
  };

  private callbacks = {
    onStateChange: (state: ArticulationState) => {},
    onMetricsUpdate: (metrics: FaceMetrics) => {},
    onExerciseComplete: (exercise: ArticulationExercise, success: boolean) => {},
    onError: (error: string) => {}
  };

  /**
   * Initialize MediaPipe Face Landmarker
   */
  async init(): Promise<void> {
    try {
      console.log('🔧 Initializing MediaPipe Face Landmarker...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
        },
        outputFaceBlendshapes: true,
        runningMode: 'VIDEO',
        numFaces: 1
      });

      console.log('✅ MediaPipe Face Landmarker initialized successfully');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Face Landmarker:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.callbacks.onError(`MediaPipe initialization failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Set up video and canvas elements
   */
  async setupElements(video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<void> {
    try {
      console.log('🔧 Setting up video and canvas elements...');
      
      this.videoElement = video;
      this.canvasElement = canvas;
      this.canvasCtx = canvas.getContext('2d');

      if (!this.canvasCtx) {
        throw new Error('Failed to get 2D context from canvas');
      }

      // Set canvas size to match video
      await this.setupCamera();
      
      // Wait for video to load metadata
      await new Promise<void>((resolve, reject) => {
        if (video.videoWidth > 0) {
          resolve();
        } else {
          video.addEventListener('loadedmetadata', () => resolve(), { once: true });
          setTimeout(() => reject(new Error('Video metadata load timeout')), 5000);
        }
      });

      // Set canvas dimensions
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      console.log(`📐 Canvas dimensions: ${canvas.width}x${canvas.height}`);

      // Initialize DrawingUtils after canvas context is ready
      this.drawingUtils = new DrawingUtils(this.canvasCtx);
      
      console.log('✅ Video and canvas elements set up successfully');
    } catch (error) {
      console.error('❌ Failed to setup elements:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.callbacks.onError(`Element setup failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Setup camera stream
   */
  private async setupCamera(): Promise<void> {
    try {
      console.log('📹 Setting up camera...');
      
      // Check permissions first
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('📋 Camera permission status:', permissions.state);

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      };

      console.log('🎯 Requesting camera access with constraints:', constraints);

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('✅ Camera stream obtained:', this.stream.getVideoTracks().length, 'video tracks');

      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        
        // Wait for video to start playing
        await new Promise<void>((resolve, reject) => {
          this.videoElement!.addEventListener('playing', () => {
            console.log('▶️ Video is playing');
            resolve();
          }, { once: true });
          
          this.videoElement!.addEventListener('error', (e) => {
            console.error('❌ Video error:', e);
            reject(new Error('Video playback error'));
          }, { once: true });
          
          this.videoElement!.play().catch(reject);
          
          // Timeout after 10 seconds
          setTimeout(() => reject(new Error('Video play timeout')), 10000);
        });
      }
      
      console.log('✅ Camera setup completed successfully');
    } catch (error) {
      console.error('❌ Camera setup failed:', error);
      
      let errorMessage = 'Unknown camera error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Specific error handling
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera access denied. Please allow camera permission and try again.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'Camera does not meet the required constraints.';
      }
      
      this.callbacks.onError(`Camera setup failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Start exercise
   */
  startExercise(exercise: ArticulationExercise): void {
    this.state.currentExercise = exercise;
    this.state.phase = ArticulationPhase.WaitReady;
    this.state.holdTimer = 0;
    this.state.score = 0;
    this.state.targetsAchieved = false;

    this.notifyStateChange();

    // Auto-start after 3 seconds
    setTimeout(() => {
      if (this.state.phase === ArticulationPhase.WaitReady) {
        this.state.phase = ArticulationPhase.Running;
        this.notifyStateChange();
        this.startDetection();
      }
    }, 3000);
  }

  /**
   * Start face detection and analysis
   */
  private startDetection(): void {
    if (!this.faceLandmarker || !this.videoElement || !this.canvasElement) {
      return;
    }

    const detect = () => {
      if (this.state.phase !== ArticulationPhase.Running) {
        return;
      }

      const startTimeMs = performance.now();
      const results = this.faceLandmarker!.detectForVideo(this.videoElement!, startTimeMs);

      // Clear canvas
      if (this.canvasCtx) {
        this.canvasCtx.clearRect(0, 0, this.canvasElement!.width, this.canvasElement!.height);
      }

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        
        // Calculate metrics
        const metrics = this.calculateMetrics(landmarks);
        this.state.currentMetrics = metrics;
        this.callbacks.onMetricsUpdate(metrics);

        // Check if targets are achieved
        const targetsAchieved = this.checkTargets(metrics);
        this.state.targetsAchieved = targetsAchieved;

        if (targetsAchieved) {
          this.state.holdTimer += 16; // ~60fps
        } else {
          this.state.holdTimer = 0;
        }

        // Check for exercise completion
        if (this.state.currentExercise && this.state.holdTimer >= this.state.currentExercise.holdMs) {
          this.completeExercise(true);
          return;
        }

        // Draw landmarks
        this.drawLandmarks(landmarks);
      }

      this.animationId = requestAnimationFrame(detect);
    };

    this.animationId = requestAnimationFrame(detect);
  }

  /**
   * Calculate face metrics from landmarks
   */
  private calculateMetrics(landmarks: any[]): FaceMetrics {
    // Key landmark indices for face features
    const leftMouth = landmarks[61];   // Left corner of mouth
    const rightMouth = landmarks[291]; // Right corner of mouth
    const topLip = landmarks[13];      // Top lip center
    const bottomLip = landmarks[14];   // Bottom lip center
    const noseTip = landmarks[1];      // Nose tip
    const chin = landmarks[152];       // Chin center

    // Calculate distances
    const mouthWidth = this.distance(leftMouth, rightMouth);
    const mouthHeight = this.distance(topLip, bottomLip);
    const faceHeight = this.distance(noseTip, chin);

    // Normalize metrics relative to face size
    const lipStretch = mouthWidth / faceHeight;  // Smile metric
    const lipRound = mouthHeight / mouthWidth;   // Pucker metric
    const jawOpen = mouthHeight / faceHeight;    // Mouth opening metric

    return {
      lipStretch: Math.min(1, Math.max(0, lipStretch)),
      lipRound: Math.min(1, Math.max(0, lipRound)),
      jawOpen: Math.min(1, Math.max(0, jawOpen))
    };
  }

  /**
   * Calculate distance between two landmarks
   */
  private distance(point1: any, point2: any): number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    const dz = point1.z - point2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Check if current metrics meet exercise targets
   */
  private checkTargets(metrics: FaceMetrics): boolean {
    if (!this.state.currentExercise) return false;

    return this.state.currentExercise.targets.every(target => {
      const value = metrics[target.metricId];
      return target.direction === '>' ? value > target.threshold : value < target.threshold;
    });
  }

  /**
   * Draw face landmarks on canvas
   */
  private drawLandmarks(landmarks: any[]): void {
    if (!this.drawingUtils || !this.canvasCtx) return;

    // Check if face mask is enabled
    const showFaceMask = localStorage.getItem('show-face-mask') === 'true';
    
    if (showFaceMask) {
      this.drawFullFaceMask(landmarks);
    } else {
      this.drawSimpleLandmarks(landmarks);
    }
  }

  /**
   * Draw full face mask with all landmarks
   */
  private drawFullFaceMask(landmarks: any[]): void {
    if (!this.drawingUtils || !this.canvasCtx || !this.canvasElement) return;

    // Save canvas context state
    this.canvasCtx.save();

    // Mirror the canvas to match the mirrored video
    this.canvasCtx.scale(-1, 1);
    this.canvasCtx.translate(-this.canvasElement.width, 0);

    // Draw face tesselation
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_TESSELATION,
      { color: "#C0C0C070", lineWidth: 1 }
    );

    // Draw right eye
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
      { color: "#FF3030" }
    );

    // Draw right eyebrow
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
      { color: "#FF3030" }
    );

    // Draw left eye
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
      { color: "#30FF30" }
    );

    // Draw left eyebrow
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
      { color: "#30FF30" }
    );

    // Draw face oval
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
      { color: "#E0E0E0" }
    );

    // Draw lips
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_LIPS,
      { color: this.state.targetsAchieved ? "#00FF00" : "#E0E0E0" }
    );

    // Draw right iris
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
      { color: "#FF3030" }
    );

    // Draw left iris
    this.drawingUtils.drawConnectors(
      landmarks,
      FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
      { color: "#30FF30" }
    );

    // Restore canvas context state
    this.canvasCtx.restore();
  }

  /**
   * Draw simple landmarks (original implementation)
   */
  private drawSimpleLandmarks(landmarks: any[]): void {
    if (!this.canvasCtx || !this.canvasElement) return;

    // Draw face outline and key points
    this.canvasCtx.fillStyle = this.state.targetsAchieved ? '#00ff00' : '#ff0000';
    this.canvasCtx.globalAlpha = 0.3;

    // Draw mouth landmarks
    const mouthLandmarks = [61, 291, 13, 14]; // corners and center
    mouthLandmarks.forEach(index => {
      const landmark = landmarks[index];
      // Mirror x coordinate to match the mirrored video
      const x = this.canvasElement!.width - (landmark.x * this.canvasElement!.width);
      const y = landmark.y * this.canvasElement!.height;
      
      this.canvasCtx!.beginPath();
      this.canvasCtx!.arc(x, y, 5, 0, 2 * Math.PI);
      this.canvasCtx!.fill();
    });

    this.canvasCtx.globalAlpha = 1;
  }

  /**
   * Complete current exercise
   */
  private completeExercise(success: boolean): void {
    if (!this.state.currentExercise) return;

    this.state.phase = success ? ArticulationPhase.Success : ArticulationPhase.Fail;
    
    if (success) {
      this.state.score += 1;
    }

    this.stopDetection();
    this.notifyStateChange();
    this.callbacks.onExerciseComplete(this.state.currentExercise, success);
  }

  /**
   * Stop face detection
   */
  private stopDetection(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Set callback functions
   */
  setCallbacks(callbacks: Partial<typeof this.callbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Get current state
   */
  getState(): ArticulationState {
    return { ...this.state };
  }

  /**
   * Notify state change
   */
  private notifyStateChange(): void {
    this.callbacks.onStateChange({ ...this.state });
  }

  /**
   * Reset exercise
   */
  reset(): void {
    this.stopDetection();
    this.state = {
      phase: ArticulationPhase.Demo,
      currentExercise: null,
      holdTimer: 0,
      currentMetrics: null,
      score: 0,
      targetsAchieved: false
    };
    this.notifyStateChange();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopDetection();
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    if (this.faceLandmarker) {
      this.faceLandmarker.close();
    }
  }
} 