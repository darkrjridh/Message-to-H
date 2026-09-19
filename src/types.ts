export type ScreenState = 'intro' | 'letter';

export type DrawingPhase = 'idle' | 'drawing_outline' | 'blooming' | 'completed';

export interface FlowerPetalParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}
