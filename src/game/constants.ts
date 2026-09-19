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

// =========================================================================
// CENTRAL GAME CONFIGURATION SECTION
// Tweak player settings, environment, parallax speeds, and tree density here
// =========================================================================
export const GAME_CONFIG = {
  // TASK 1: Permanent Lord Ganesha on Mushika Configuration
  PLAYER_CONFIG: {
    SHOW_AURA: true,            // Soft golden aura toggle around Lord Ganesha
    DUST_EFFECTS: true,         // Running dust puffs from Mushika's paws
    BOUNCE_INTENSITY: 1.0,      // Body bounce intensity
    SWAY_INTENSITY: 1.0,        // Tassels, hair, and garland sway intensity
  },

  // TASK 2: Parallax Scrolling Speeds (relative to player forward movement)
  PARALLAX: {
    FAR_MOUNTAINS: 0.05,       // Layer 1: Snowy mountain peaks & sky dome
    MID_TREES: 0.20,           // Layer 2: Distant tree lines & atmospheric haze
    NEAR_FOREST: 1.0,          // Layer 3: Dense 3D pine and mixed forest along trail
    FOREGROUND_FOLIAGE: 1.35,  // Layer 4: Passing foreground leaves and ferns
  },

  // TASK 2: Tree & Forest Density per Road Segment (50m length)
  FOREST_DENSITY: {
    PINES_PER_SEGMENT: 14,     // Dense layered pine & conifer trees on sides
    MIXED_TREES_PER_SEGMENT: 8, // Broadleaf / leafy mixed trees
    BUSHES_PER_SEGMENT: 12,    // Undergrowth bushes & ferns
    ROCKS_PER_SEGMENT: 8,      // Mossy mountain trail rocks & boulders
    FALLING_LEAVES_COUNT: 45,  // Drifting ambient leaves
    FOG_DENSITY: 0.0032,       // Mountain valley atmospheric fog density
  },

  // TASK 3: Cohesive Palette (Warm Gold & Saffron against Snowy Peaks & Deep Forest Greens)
  PALETTE: {
    trailDirt: '#5c4838',      // Mountain dirt trail base
    trailDirtLight: '#78614c', // Sunlit trail patch
    trailRock: '#4a3d34',      // Rocky trail borders and stones
    pineNeedleGreen: '#14532d',// Deep evergreen pine needles
    pineNeedleLight: '#166534',// Highlighted pine foliage
    pineBark: '#382516',       // Conifer trunk wood
    mixedLeafGreen: '#15803d', // Vibrant deciduous leaves
    mixedLeafAmber: '#ca8a04', // Autumn tint deciduous leaves
    bushGreen: '#1e3a24',      // Deep undergrowth bush green
    mossGreen: '#4d7c0f',      // Mossy rock accents
    mountainFar: '#312e81',    // Distant mountain base silhouette
    mountainMid: '#4338ca',    // Mid-range mountain base
    mountainHaze: '#c7d2fe',   // Atmospheric blue-white mountain valley haze
    sunlightGold: '#fef08a',   // Warm morning sunlight
    sunlightAmber: '#f59e0b',  // Sun corona & god rays
    divineAuraGold: '#fbbf24', // Lord Ganesha divine golden aura
    divineAuraCore: '#fffbeb', // Lord Ganesha core aura glow
    // Snowy Mountain Peaks
    snowPeakWhite: '#ffffff',  // Bright snowy Himalayan peak caps
    snowPeakShadow: '#cbd5e1', // Cool slate-blue snow shadow
    mountainRockSlate: '#334155', // Rocky mountain face slate
    mountainRockDark: '#1e293b',  // Deep mountain rock fissure
    // Mushika Dark Grey Fur & Red/Gold Saddle
    mushikaDarkFur: '#262b34', // Realistic dark charcoal-grey fur
    mushikaDeepFur: '#181d24', // Deep fur shadow
    mushikaUnderbelly: '#3f4756', // Slightly lighter chest/belly fur
    saddleRed: '#991b1b',      // Rich royal crimson saddle blanket
    saddleRedDark: '#7f1d1d',  // Deep crimson saddle shadow
    saddleGoldTrim: '#f59e0b', // Ornate gold brocade trim
    saddleTassel: '#d97706',   // Hanging gold tassels
    // Lord Ganesha Saffron Dhoti & Accents
    saffronDhoti: '#ea580c',   // Warm saffron silk dhoti
    saffronDhotiLight: '#f97316', // Shimmering saffron highlight
    lotusPink: '#f472b6',      // Sacred pink lotus petals
    lotusPinkDeep: '#db2777',  // Deep lotus petal base
    modakSweetGold: '#fde047', // Delicious golden modak sweets
  },
  // Level 2: Subterranean Minecart Railway Palette
  MINECART: {
    woodPlank: '#3d2314',
    woodPlankLight: '#5a371e',
    ironBrace: '#2a2e37',
    ironRivet: '#64748b',
    wheelIron: '#334155',
    wheelFlange: '#475569',
    railSteel: '#94a3b8',
    railSteelShine: '#f1f5f9',
    railSleeperWood: '#2b1d16',
    ballastGravel: '#181d27',
    timberBeam: '#452b1b',
    cavernRock: '#1e2430',
    cavernRockDark: '#0f131a',
    cavernCeiling: '#090d14',
    cavernFog: '#0b0f19',
    crystalAmethyst: '#c084fc',
    crystalSapphire: '#38bdf8',
    crystalEmerald: '#34d399',
    torchFlame: '#f97316',
    torchCore: '#fef08a',
  },
};

export interface LevelThreshold {
  level: number;
  minScore: number;
  name: string;
  subtitle: string;
  badge: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  {
    level: 1,
    minScore: 0,
    name: 'Mountain Forest Trail',
    subtitle: 'Dawn Forest Trail of Lord Ganesha',
    badge: '🌲 LEVEL 1',
  },
  {
    level: 2,
    minScore: 500,
    name: 'Minecart Railway',
    subtitle: 'Subterranean Crystal Cavern',
    badge: '🚂 LEVEL 2',
  },
];

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    name: 'Mountain Forest Trail of Lord Ganesha',
    subtitle: 'Winding mountain dirt trail flanked by dense pine forests under morning mist and golden sun rays',
    skyColor: '#fed7aa',
    groundColor: '#5c4838',
    roadColor: '#5c4838',
    decorColor: '#166534',
    speed: 18,
    targetDistance: 5000,
    obstacleTypes: ['STONE_PILLAR', 'WOODEN_CART'],
    pandalTheme: 'Sacred Mountain Forest Trail',
    blessingName: 'Vakratunda Mahakaya Mountain Blessing',
    blessingDesc: 'Lord Ganesha showers divine wisdom, obstacle removal, and radiant prosperity upon your journey!',
  },
  {
    id: 2,
    name: 'Subterranean Minecart Railway',
    subtitle: 'Underground crystal caverns and railway tracks flanked by sturdy mine timber supports and blazing torches',
    skyColor: '#0b0f19',
    groundColor: '#181d27',
    roadColor: '#1e2430',
    decorColor: '#d97706',
    speed: 20,
    targetDistance: 10000,
    obstacleTypes: ['STONE_PILLAR', 'WOODEN_CART'],
    pandalTheme: 'Subterranean Crystal Mine',
    blessingName: 'Patalavasi Vigneshwara Protection',
    blessingDesc: 'Lord Ganesha guides your minecart through subterranean depths with blazing divine light!',
  },
];

