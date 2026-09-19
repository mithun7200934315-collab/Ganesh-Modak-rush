import {
  LANES_X,
  BASE_SPEED,
  MAX_SPEED,
  SPEED_INCREASE_INTERVAL,
  SPEED_INCREASE_RATIO,
  JUMP_VELOCITY,
  GRAVITY_3D,
  LANE_CHANGE_SPEED,
  SPAWN_DISTANCE_AHEAD,
  DESPAWN_DISTANCE_BEHIND,
  MEGA_MODAK_BONUS_POINTS,
  MEGA_MODAK_SPEED_PAUSE_DURATION,
  MEGA_MODAK_ANIM_DURATION,
} from './constants';
import type {
  GameState,
  Player3D,
  Collectible3D,
  Obstacle3D,
  ObstacleType,
} from '../types/game';
import { soundManager } from '../audio/soundSystem';
import { storage } from './storage';

export class GameEngine {
  public state: GameState;
  public player: Player3D;
  public collectibles: Collectible3D[] = [];
  public obstacles: Obstacle3D[] = [];

  private nextSpawnZ: number = -30;
  private spawnInterval: number = 24; // Distance between obstacle rows
  private onStateChangeCallback?: (state: GameState) => void;
  private onModakCollectedCallback?: (x: number, y: number, z: number, isMega?: boolean) => void;

  // Track spawn frequency for Mega Modak (distance or time based)
  private distanceSinceLastMegaModak: number = 0;

  constructor() {
    this.state = this.getInitialState();
    this.player = this.getInitialPlayer();
  }

  public setOnStateChange(cb: (state: GameState) => void) {
    this.onStateChangeCallback = cb;
  }

  public setOnModakCollected(cb: (x: number, y: number, z: number, isMega?: boolean) => void) {
    this.onModakCollectedCallback = cb;
  }

  private notify() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ ...this.state });
    }
  }

  private getInitialState(): GameState {
    return {
      mode: 'MENU',
      level: 1,
      isEndless: true,
      score: 0,
      modaks: 0,
      combo: 1,
      comboTimer: 0,
      distance: 0,
      speed: BASE_SPEED,
      speedTimer: 0,
      speedMultiplier: 1.0,
      speedIncreasePauseTimer: 0,
      obstaclePauseTimer: 0,
      bonusMessage: null,
      highScore: storage.getHighScore(),
      totalModaks: storage.getTotalModaks(),
      unlockedLevel: storage.getUnlockedLevel(),
    };
  }

  private getInitialPlayer(): Player3D {
    return {
      x: 0,
      y: 0,
      z: 0,
      targetX: 0,
      lane: 0, // 0: Center, -1: Left, 1: Right
      targetLane: 0,
      vy: 0,
      isGrounded: true,
      state: 'RUNNING',
      invulnerableTimer: 0,
      runCycle: 0,
      tiltAngle: 0,
      facingAngle: 0, // 0: facing forward, Math.PI: facing camera
      specialAnimationTimer: 0,
      specialAnimationDuration: 0,
      width: 1.0,
      height: 1.6,
      depth: 1.4,
    };
  }

  public start() {
    this.state = this.getInitialState();
    this.state.mode = 'PLAYING';
    this.player = this.getInitialPlayer();
    this.collectibles = [];
    this.obstacles = [];
    this.nextSpawnZ = -30;
    this.distanceSinceLastMegaModak = 0;

    // Seed initial obstacles and collectibles ahead
    for (let i = 0; i < 4; i++) {
      this.spawnRow(this.nextSpawnZ);
      this.nextSpawnZ -= this.spawnInterval;
    }

    soundManager.startFestiveBGM();
    this.notify();
  }

  public pause() {
    if (this.state.mode === 'PLAYING') {
      this.state.mode = 'PAUSED';
      this.notify();
    }
  }

  public resume() {
    if (this.state.mode === 'PAUSED') {
      this.state.mode = 'PLAYING';
      this.notify();
    }
  }

  // --- CONTROLS ---

  // Shift lane Left (-1) or Right (+1)
  public shiftLane(direction: -1 | 1) {
    if (this.state.mode !== 'PLAYING') return;

    const newLane = Math.max(-1, Math.min(1, this.player.targetLane + direction));
    if (newLane !== this.player.targetLane) {
      this.player.targetLane = newLane;
      this.player.lane = newLane;
      // lane index -1 maps to LANES_X[0], 0 maps to LANES_X[1], 1 maps to LANES_X[2]
      this.player.targetX = LANES_X[newLane + 1];
    }
  }

  // Jump
  public jump() {
    if (this.state.mode !== 'PLAYING') return;

    if (this.player.isGrounded) {
      this.player.vy = JUMP_VELOCITY;
      this.player.isGrounded = false;
      this.player.state = 'JUMPING';
      soundManager.playJump();
    }
  }

  // Slide / Fast-fall
  public slide() {
    if (this.state.mode !== 'PLAYING') return;

    if (!this.player.isGrounded) {
      this.player.vy = -18;
    }
    soundManager.playSlide();
  }

  // =========================================================================
  // SPAWN LOGIC: FAIR PROCEDURAL LEVEL GENERATION
  // =========================================================================
  private spawnRow(z: number) {
    const lanes = [-1, 0, 1];
    const shuffledLanes = [...lanes].sort(() => Math.random() - 0.5);

    // Check if we should spawn a rare, brightly glowing Mega Modak
    let megaModakLane: number | null = null;
    const canSpawnMegaModak =
      this.distanceSinceLastMegaModak > 120 &&
      Math.random() < 0.28 &&
      !this.collectibles.some((c) => (c.type === 'MEGA_MODAK' || c.type === 'MEGA_LADDOO') && !c.collected);

    if (canSpawnMegaModak) {
      megaModakLane = shuffledLanes[0];
      this.distanceSinceLastMegaModak = 0;

      const x = LANES_X[megaModakLane + 1];
      this.collectibles.push({
        id: `mega_modak_${z}_${megaModakLane}_${Math.random()}`,
        type: 'MEGA_MODAK',
        x,
        y: 1.1,
        z,
        lane: megaModakLane,
        collected: false,
        value: MEGA_MODAK_BONUS_POINTS, // 100 points
        rotation: 0,
        bobOffset: 0,
      });
    }

    // Pick how many lanes have obstacles: 1 or at most 2 (never all 3, ensuring clear path)
    const numObstacles = Math.random() < 0.65 ? 1 : 2;
    const obstacleTypes: ObstacleType[] = ['STONE_PILLAR', 'WOODEN_CART'];

    // Don't put obstacles in the Mega Modak lane
    const availableObstacleLanes = shuffledLanes.filter((l) => l !== megaModakLane);
    const obstacleLanes = availableObstacleLanes.slice(0, numObstacles);

    // Place ancient stone pillars and stationary wooden carts
    for (const lane of obstacleLanes) {
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      const x = LANES_X[lane + 1];

      let width = 1.8;
      let height = 1.5;
      let depth = 0.8;

      if (type === 'STONE_PILLAR') {
        width = 1.1;
        height = 3.3;
        depth = 1.1;
      } else if (type === 'WOODEN_CART') {
        width = 1.4;
        height = 0.82;
        depth = 1.1;
      }

      this.obstacles.push({
        id: `obs_${z}_${lane}_${Math.random()}`,
        type,
        x,
        y: 0,
        z,
        lane,
        width,
        height,
        depth,
        hit: false,
        rotation: 0,
      });
    }

    // Place Regular Glowing Modaks in open lanes (excluding Mega Modak lane)
    const activeObstacleLanes = new Set(this.obstacles.filter((o) => o.z === z).map((o) => o.lane));
    const openLanes = lanes.filter((l) => !activeObstacleLanes.has(l) && l !== megaModakLane);

    for (const lane of openLanes) {
      const x = LANES_X[lane + 1];
      // Trail of 3 regular glowing modaks (+10 points each)
      for (let offset = -4; offset <= 4; offset += 4) {
        this.collectibles.push({
          id: `modak_${z + offset}_${lane}_${Math.random()}`,
          type: 'MODAK',
          x,
          y: 0.85,
          z: z + offset,
          lane,
          collected: false,
          value: 10,
          rotation: Math.random() * Math.PI,
          bobOffset: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  // =========================================================================
  // MAIN UPDATE TICK (60 FPS)
  // =========================================================================
  public update(dt: number) {
    if (this.state.mode !== 'PLAYING') return;

    // Cap delta time to prevent anomalies on tab switch
    const clampedDt = Math.min(dt, 0.05);

    // 1. PROGRESSION MECHANIC:
    // Base forward movement speed automatically increases by 5% every 15 seconds.
    // Paused for 5 seconds when colliding with a Mega Modak!
    if (this.state.speedIncreasePauseTimer > 0) {
      this.state.speedIncreasePauseTimer -= clampedDt;
      if (this.state.speedIncreasePauseTimer <= 0) {
        this.state.speedIncreasePauseTimer = 0;
      }
    } else {
      this.state.speedTimer += clampedDt;
      if (this.state.speedTimer >= SPEED_INCREASE_INTERVAL) {
        this.state.speedTimer -= SPEED_INCREASE_INTERVAL;
        this.state.speed = Math.min(MAX_SPEED, this.state.speed * SPEED_INCREASE_RATIO);
        this.state.speedMultiplier = Number((this.state.speedMultiplier * SPEED_INCREASE_RATIO).toFixed(2));
        this.notify();
      }
    }

    // Advance Forward Movement and Distance toward the horizon sun
    const forwardStep = this.state.speed * clampedDt;
    this.player.z -= forwardStep;
    this.state.distance += forwardStep;
    this.distanceSinceLastMegaModak += forwardStep;

    // 2. SPECIAL 180° CELEBRATION ANIMATION (Mega Modak Bonus)
    // Instantly turn 180 degrees to look directly into camera lens, while forward movement continues.
    // Then snap characters back to facing forward
    if (this.player.specialAnimationTimer > 0) {
      this.player.specialAnimationTimer -= clampedDt;

      if (this.player.specialAnimationTimer > 0.25) {
        // Look directly into camera lens
        this.player.facingAngle = Math.PI;
      } else {
        // Snap back to facing forward (0°)
        const snapEase = this.player.specialAnimationTimer / 0.25;
        this.player.facingAngle = snapEase * Math.PI;
      }

      if (this.player.specialAnimationTimer <= 0) {
        this.player.facingAngle = 0;
        this.state.bonusMessage = null;
        this.notify();
      }
    } else {
      this.player.facingAngle = 0;
    }

    // 3. Smooth Lane Change Physics
    const dx = this.player.targetX - this.player.x;
    this.player.x += dx * Math.min(1, LANE_CHANGE_SPEED * clampedDt);
    // Dynamic banking / tilt when switching lanes
    this.player.tiltAngle = dx * 0.12;

    // 4. Jump and Gravity Physics
    if (!this.player.isGrounded) {
      this.player.vy += GRAVITY_3D * clampedDt;
      this.player.y += this.player.vy * clampedDt;

      if (this.player.y <= 0) {
        this.player.y = 0;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.state = 'RUNNING';
      }
    }

    // 5. Running Cycle Gallop Animation
    this.player.runCycle += this.state.speed * clampedDt * 0.65;

    // 6. Procedural Spawning Ahead
    if (this.player.z - SPAWN_DISTANCE_AHEAD < this.nextSpawnZ) {
      this.spawnRow(this.nextSpawnZ);
      this.nextSpawnZ -= this.spawnInterval;
    }

    // 7. Despawn Entities Behind Player
    const despawnZ = this.player.z + DESPAWN_DISTANCE_BEHIND;
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      if (c.z >= despawnZ || c.collected) {
        this.collectibles.splice(i, 1);
      }
    }
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      if (this.obstacles[i].z >= despawnZ) {
        this.obstacles.splice(i, 1);
      }
    }

    // 8. Collectible Collisions
    for (let i = 0; i < this.collectibles.length; i++) {
      const c = this.collectibles[i];
      if (c.collected) continue;

      const dz = Math.abs(this.player.z - c.z);
      const dxDist = Math.abs(this.player.x - c.x);
      const dyDist = Math.abs(this.player.y + 0.6 - c.y);

      // Collision threshold
      const isMega = c.type === 'MEGA_MODAK' || c.type === 'MEGA_LADDOO';
      const hitZ = isMega ? 1.9 : 1.3;
      const hitX = isMega ? 1.5 : 1.1;

      if (dz < hitZ && dxDist < hitX && dyDist < 1.6) {
        c.collected = true;

        if (isMega) {
          // SPECIAL BONUS MECHANIC:
          // 1. Award 100 bonus points
          this.state.score += 100;
          this.state.modaks += 5;

          // 2. Pause the progressive speed increase for 5 seconds
          this.state.speedIncreasePauseTimer = MEGA_MODAK_SPEED_PAUSE_DURATION;

          // 3. Trigger special animation: Ganesha and Mooshika instantly turn 180 degrees
          // to look directly into the camera lens, while forward movement continues
          this.player.specialAnimationTimer = MEGA_MODAK_ANIM_DURATION;
          this.player.specialAnimationDuration = MEGA_MODAK_ANIM_DURATION;
          this.player.facingAngle = Math.PI; // Instant 180° turn!
          this.state.bonusMessage = '✨ MEGA MODAK! +100 PTS ✨';

          // 4. Play joyful chime sound effect
          soundManager.playMegaModakJoyfulChime();

          // Visual burst
          if (this.onModakCollectedCallback) {
            this.onModakCollectedCallback(c.x, c.y, c.z, true);
          }
        } else {
          // Regular glowing Modak (+10 points)
          this.state.score += c.value;
          this.state.modaks += 1;
          soundManager.playModakChime(1);

          if (this.onModakCollectedCallback) {
            this.onModakCollectedCallback(c.x, c.y, c.z, false);
          }
        }

        // Real-time High Score Update
        if (this.state.score > this.state.highScore) {
          this.state.highScore = this.state.score;
          storage.saveHighScore(this.state.highScore);
        }
        storage.addTotalModaks(1);

        this.notify();
      }
    }

    // 10. Obstacle Collisions -> Triggers Game Over
    for (let i = 0; i < this.obstacles.length; i++) {
      const o = this.obstacles[i];
      const dz = Math.abs(this.player.z - o.z);
      const dxDist = Math.abs(this.player.x - o.x);

      // Check if player jumped over the obstacle:
      // If player is airborne and player.y clears obstacle height (with 25% clearance safety margin)
      const isJumpingOver = this.player.y >= o.height * 0.75;
      if (isJumpingOver) {
        continue; // Successfully cleared obstacle by jumping!
      }

      const collisionDepth = (this.player.depth + o.depth) * 0.42;
      const collisionWidth = (this.player.width + o.width) * 0.42;

      if (dz < collisionDepth && dxDist < collisionWidth) {
        this.triggerGameOver();
        break;
      }
    }
  }

  private triggerGameOver() {
    this.state.mode = 'GAME_OVER';
    soundManager.stopFestiveBGM();
    soundManager.playObstacleBump();
    soundManager.playGameOver();

    // Save final stats
    storage.saveHighScore(this.state.highScore);
    storage.addTotalModaks(0);
    storage.flush();

    this.notify();
  }
}
