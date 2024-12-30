class BreatheAudioController {
  private audioContext: AudioContext;
  private inhaleUrl: string;
  private exhaleUrl: string;
  private inhaleSound: AudioBuffer | null;
  private exhaleSound: AudioBuffer | null;

  constructor(inhaleUrl: string, exhaleUrl: string) {
    this.audioContext = new(window.AudioContext || window.webkitAudioContext)();
    this.inhaleUrl = inhaleUrl;
    this.exhaleUrl = exhaleUrl;
    this.inhaleSound = null;
    this.exhaleSound = null;
  }

  private async loadAudio(url: string): Promise < AudioBuffer > {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  public async initialize(): Promise < void > {
    this.inhaleSound = await this.loadAudio(this.inhaleUrl);
    this.exhaleSound = await this.loadAudio(this.exhaleUrl);
  }

  private playSound(audioBuffer: AudioBuffer, durationInSeconds: number): void {
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const playbackRate = source.buffer.duration / durationInSeconds;
    source.playbackRate.value = playbackRate;

    source.connect(this.audioContext.destination);
    source.start();
  }

  public playInhale(inhaleDuration: number): void {
    if (!this.inhaleSound) {
      throw new Error("Inhale sound is not loaded. Call initialize() first.");
    }
    this.playSound(this.inhaleSound, inhaleDuration);
  }

  public playExhale(exhaleDuration: number): void {
    if (!this.exhaleSound) {
      throw new Error("Exhale sound is not loaded. Call initialize() first.");
    }
    this.playSound(this.exhaleSound, exhaleDuration);
  }
}

// Example usage:
// const breatheAudioController = new BreatheAudioController('path_to_inhale.mp3', 'path_to_exhale.mp3');
// await breatheAudioController.initialize();
// breatheAudioController.playInhale(5);
// breatheAudioController.playExhale(3);

export default BreatheAudioController;