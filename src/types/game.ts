export type GameMode =
  | 'MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'LEVEL_COMPLETE'
  | 'GAME_OVER'
  | 'CODEX'
  | 'SETTINGS';

export type PlayerActionState = 'RUNNING' | 'JUMPING' | 'SLIDING' | 'STUMBLE';

export interface Player3D {
  x: number;
  y: number;
  z: number;
  targetX: number;
  lane: number; // -1: Left, 0: Center, 1: Right
  targetLane: number;
  vy: number;
  isGrounded: boolean;
  state: PlayerActionState;
  invulnerableTimer: number;
  runCycle: number;
  tiltAngle: number;
  facingAngle: number; // 0 = forward, Math.PI = facing camera
  specialAnimationTimer: number;
  specialAnimationDuration: number;
  width: number;
  height: number;
  depth: number;
}

export type CollectibleType =
  | 'MODAK'
  | 'GOLDEN_MODAK'
  | 'MEGA_MODAK'
  | 'MEGA_LADDOO';

export interface Collectible3D {
  id: string;
  type: CollectibleType;
  x: number;
  y: number;
  z: number;
  lane: number;
  collected: boolean;
  value: number;
  rotation: number;
  bobOffset: number;
}

export type ObstacleType =
  | 'FESTIVE_BARRICADE'
  | 'STONE_PILLAR'
  | 'WOODEN_CART'
  | 'RIVER_BOULDER'
  | 'FALLEN_LOG'
  | 'RIVER_BRANCHES';

export interface Obstacle3D {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  z: number;
  lane: number;
  width: number;
  height: number;
  depth: number;
  hit: boolean;
  rotation: number;
}

export interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  skyColor: string;
  groundColor: string;
  roadColor: string;
  decorColor: string;
  speed: number;
  targetDistance: number;
  obstacleTypes: ObstacleType[];
  pandalTheme: string;
  blessingName: string;
  blessingDesc: string;
}

export interface LevelTransitionBanner {
  level: number;
  text: string;
  subtext: string;
  timer: number;
  duration: number;
}

export interface GameState {
  mode: GameMode;
  level: number;
  isEndless: boolean;
  score: number;
  modaks: number;
  combo: number;
  comboTimer: number;
  distance: number;
  speed: number;
  speedTimer: number;
  speedMultiplier: number;
  speedIncreasePauseTimer: number;
  obstaclePauseTimer: number;
  bonusMessage: string | null;
  levelTransitionBanner: LevelTransitionBanner | null;
  highScore: number;
  totalModaks: number;
  unlockedLevel: number;
}

export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  hapticFeedback: boolean;
}

