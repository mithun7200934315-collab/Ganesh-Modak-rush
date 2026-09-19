import type { LevelConfig } from '../types/game';

// 3D World Dimensions
export const LANE_WIDTH = 2.4;
export const LANES_X = [-LANE_WIDTH, 0, LANE_WIDTH]; // Lane -1 (Left), Lane 0 (Center), Lane 1 (Right)
export const ROAD_WIDTH = 8.6;
export const ROAD_SEGMENT_LENGTH = 50;
export const VISIBLE_ROAD_SEGMENTS = 7; // Length of rendered road ahead
export const SPAWN_DISTANCE_AHEAD = 110;
export const DESPAWN_DISTANCE_BEHIND = 25;

// Player Physics & Progression (Balanced & Smooth)
export const BASE_SPEED = 20; // Slightly reduced comfortable base forward speed
export const MAX_SPEED = 48; // Balanced top speed
export const SPEED_INCREASE_INTERVAL = 8.0; // Steady speed increase every 8 seconds
export const SPEED_INCREASE_RATIO = 1.06; // +6% speed increase every 8 seconds
export const JUMP_VELOCITY = 12.0;
export const GRAVITY_3D = -26.0;
export const LANE_CHANGE_SPEED = 16; // Smooth, responsive lane transitions

// Mega Modak Bonus Parameters
export const MEGA_MODAK_BONUS_POINTS = 100;
export const MEGA_MODAK_SPEED_PAUSE_DURATION = 5.0; // 5 seconds speed progression pause
export const MEGA_MODAK_ANIM_DURATION = 2.5; // seconds for 180° camera look celebration animation

// Aliases for compatibility
export const MEGA_LADDOO_BONUS_POINTS = MEGA_MODAK_BONUS_POINTS;
export const MEGA_LADDOO_OBSTACLE_PAUSE_DURATION = MEGA_MODAK_SPEED_PAUSE_DURATION;
export const MEGA_LADDOO_ANIM_DURATION = MEGA_MODAK_ANIM_DURATION;

// Colors matching the early morning dawn golden-orange sun aesthetic
export const PALETTE = {
  // Ganesha Royal Purple & Intricate Gold
  royalPurple: '#581c87', // Rich royal purple silk
  vibrantPurple: '#7e22ce',
  deepSilkPurple: '#4c1d95',
  divineGold: '#f59e0b',  // Sacred gold
  shimmerGold: '#fbbf24',
  brightGold: '#fde047',
  paleGold: '#fef08a',

  // Mooshika Grey Rat Fur
  mooshikaGrey: '#78828f',
  mooshikaLightGrey: '#94a3b8',
  mooshikaDarkGrey: '#475569',
  mooshikaPink: '#f472b6',

  // Grey Stone Road & Carved Mandalas
  stoneRoad: '#7b828d',       // Medium grey stone pavement
  stoneSlabBorder: '#5d6470', // Grey stone slab borders
  stoneMandala: '#505662',    // Intricate carved mandala relief
  stoneBorder: '#646c77',
  stonePillar: '#69717d',     // Ancient South Indian fluted stone pillar
  carvedPillarStone: '#555d69',

  // Early Morning Dawn Sky (Peach, Pink, Gold)
  dawnSkyPeach: '#fed7aa',    // Warm glowing peach horizon
  dawnSkyPink: '#f9a8d4',     // Soft dawn rose pink
  dawnSkyGold: '#fde047',     // Golden upper sky glow
  dawnSkyTop: '#fb923c',      // Warm morning orange-gold gradient
  dawnFog: '#fed7aa',         // Atmospheric dawn morning mist

  // Massive Horizon Sun & Crepuscular God Rays
  sunCore: '#fffbeb',         // Luminous white-hot center
  sunGoldenOrange: '#f97316', // Vibrant golden-orange sun disc
  sunCorona: '#fbbf24',       // Radiant solar corona
  godRays: '#fef08a',         // Volumetric crepuscular light rays

  // Warm Lanterns (Diyas) on Carts and Pillars
  diyaFlame: '#f59e0b',
  diyaFlameBright: '#fef08a',
  diyaBrass: '#d97706',
  diyaGlow: '#fbbf24',

  // Mega Modak Intense Golden Aura
  megaModakAura: '#facc15',
  megaModakCore: '#fbbf24',
  megaModakFlame: '#f97316',

  marigoldOrange: '#ea580c',
  marigoldYellow: '#eab308',
  auraGlow: '#fbbf24',
  auraPurple: '#a855f7',
};

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    name: 'Golden Dawn Swarna Mandir Highway',
    subtitle: 'Sacred grey stone highway under crepuscular sun rays leading towards the massive golden-orange morning sun',
    skyColor: '#fed7aa',
    groundColor: '#7b828d',
    roadColor: '#7b828d',
    decorColor: '#f59e0b',
    speed: 18,
    targetDistance: 5000,
    obstacleTypes: ['STONE_PILLAR', 'WOODEN_CART'],
    pandalTheme: 'Golden Dawn Temple Path',
    blessingName: 'Vakratunda Mahakaya Blessing',
    blessingDesc: 'Lord Ganesha showers divine wisdom, obstacle removal, and radiant morning prosperity upon you!',
  },
];
