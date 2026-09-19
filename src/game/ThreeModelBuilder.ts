import * as THREE from 'three';
import { LANE_WIDTH, PALETTE, ROAD_SEGMENT_LENGTH, GAME_CONFIG } from './constants';

export interface PlayerCharacterMeshes {
  root: THREE.Group;
  characterRotator: THREE.Group;
  legs: THREE.Mesh[];
  tail: THREE.Group;
  auraInner: THREE.Mesh;
  auraOuter: THREE.Mesh;
  ears: THREE.Group[];
  mooshikaGroup: THREE.Group;
  ganeshaGroup: THREE.Group;
  tassels: THREE.Group[];
  hairGroup: THREE.Group;
  minecartGroup: THREE.Group;
  minecartWheels: THREE.Mesh[];
}

export class ThreeModelBuilder {
  // Shared materials for top performance and visual consistency
  private goldMaterial: THREE.MeshStandardMaterial;
  private shinyGoldMaterial: THREE.MeshStandardMaterial;
  private ganeshaSkinMaterial: THREE.MeshStandardMaterial;

  // Lord Ganesha Saffron Dhoti, Lotus & Flowing Hair Materials
  private saffronDhotiMaterial: THREE.MeshStandardMaterial;
  private lotusPetalMaterial: THREE.MeshStandardMaterial;
  private lotusCenterMaterial: THREE.MeshStandardMaterial;
  private hairMaterial: THREE.MeshStandardMaterial;

  // Mooshika Dark Grey Rat Materials & Red/Gold Saddle
  private pinkSkinMaterial: THREE.MeshStandardMaterial;
  private mushikaDarkFurMaterial: THREE.MeshStandardMaterial;
  private mushikaUnderbellyMaterial: THREE.MeshStandardMaterial;
  private mushikaGoldenArmorMaterial: THREE.MeshStandardMaterial;
  private saddleCrimsonMaterial: THREE.MeshStandardMaterial;

  // Snowy Mountain Materials
  private snowMaterial: THREE.MeshStandardMaterial;
  private mountainSlateMaterial: THREE.MeshStandardMaterial;

  private carvedPillarMaterial: THREE.MeshStandardMaterial;
  private cartWoodMaterial: THREE.MeshStandardMaterial;
  private marigoldOrangeMaterial: THREE.MeshStandardMaterial;
  private marigoldYellowMaterial: THREE.MeshStandardMaterial;

  // Mountain Trail & Dense Forest Materials (Task 1 & Task 3)
  private mountainTrailMaterial: THREE.MeshStandardMaterial;
  private mountainRockMaterial: THREE.MeshStandardMaterial;
  private pineNeedleMaterial: THREE.MeshStandardMaterial;
  private pineNeedleLightMaterial: THREE.MeshStandardMaterial;
  private pineBarkMaterial: THREE.MeshStandardMaterial;
  private mixedLeafMaterial: THREE.MeshStandardMaterial;
  private mixedLeafAmberMaterial: THREE.MeshStandardMaterial;
  private bushMaterial: THREE.MeshStandardMaterial;
  private fernMaterial: THREE.MeshStandardMaterial;
  private mountainHazeMat: THREE.MeshBasicMaterial;

  // Level 2: Subterranean Minecart Railway Materials
  private minecartWoodMaterial: THREE.MeshStandardMaterial;
  private minecartIronMaterial: THREE.MeshStandardMaterial;
  private steelRailMaterial: THREE.MeshStandardMaterial;
  private woodenSleeperMaterial: THREE.MeshStandardMaterial;
  private ballastMaterial: THREE.MeshStandardMaterial;
  private timberArchMaterial: THREE.MeshStandardMaterial;
  private cavernRockMaterial: THREE.MeshStandardMaterial;
  private crystalAmethystMaterial: THREE.MeshStandardMaterial;
  private crystalSapphireMaterial: THREE.MeshStandardMaterial;
  private crystalEmeraldMaterial: THREE.MeshStandardMaterial;
  private torchFlameMat: THREE.MeshBasicMaterial;
  private torchFlameCoreMat: THREE.MeshBasicMaterial;
  private torchLightPoolMat: THREE.MeshBasicMaterial;

  // Diya & Lighting Materials
  private diyaBrassMaterial: THREE.MeshStandardMaterial;
  private diyaFlameMat: THREE.MeshBasicMaterial;
  private diyaFlameCoreMat: THREE.MeshBasicMaterial;
  private diyaLightPoolMat: THREE.MeshBasicMaterial;

  // Collectible Materials
  private modakRingMat: THREE.MeshBasicMaterial;
  private megaModakMat: THREE.MeshStandardMaterial;
  private megaModakAuraMat: THREE.MeshBasicMaterial;
  private megaModakRingMat: THREE.MeshBasicMaterial;
  private megaModakBeaconMat: THREE.MeshBasicMaterial;

  // Sun, God Rays & Temple Silhouette Materials
  private sunCoreMat: THREE.MeshBasicMaterial;
  private sunGlowMat: THREE.MeshBasicMaterial;
  private godRayMat: THREE.MeshBasicMaterial;
  private mountainSilhouetteMatMid: THREE.MeshStandardMaterial;

  // Shared Geometries
  private modakBaseGeo: THREE.BufferGeometry;
  private modakTopGeo: THREE.BufferGeometry;
  private modakRidgeGeo: THREE.BufferGeometry;
  private modakRingGeo: THREE.BufferGeometry;

  // Mega Modak Geometries
  private megaModakBaseGeo: THREE.BufferGeometry;
  private megaModakTopGeo: THREE.BufferGeometry;
  private megaModakRidgeGeo: THREE.BufferGeometry;
  private megaModakAuraGeo: THREE.BufferGeometry;
  private megaModakRingGeo: THREE.BufferGeometry;
  private megaModakBeaconGeo: THREE.BufferGeometry;

  // Diya Geometries
  private diyaPedestalGeo: THREE.BufferGeometry;
  private diyaBowlGeo: THREE.BufferGeometry;
  private diyaFlameGeo: THREE.BufferGeometry;
  private diyaFlameCoreGeo: THREE.BufferGeometry;
  private diyaLightPoolGeo: THREE.BufferGeometry;

  // Level 2 Geometries
  private steelRailGeo: THREE.BufferGeometry;
  private sleeperGeo: THREE.BufferGeometry;
  private crystalGeo: THREE.BufferGeometry;
  private stalactiteGeo: THREE.BufferGeometry;

  // Obstacle Geometries
  private pillarBaseGeo: THREE.BufferGeometry;
  private pillarColumnGeo: THREE.BufferGeometry;
  private pillarCapitalGeo: THREE.BufferGeometry;
  private pillarTopCapGeo: THREE.BufferGeometry;

  private cartBodyGeo: THREE.BufferGeometry;
  private cartWheelGeo: THREE.BufferGeometry;
  private cartHubGeo: THREE.BufferGeometry;
  private cartRoofGeo: THREE.BufferGeometry;
  private cartPotGeo: THREE.BufferGeometry;

  private barricadePostGeo: THREE.BufferGeometry;
  private barricadeBeamGeo: THREE.BufferGeometry;
  private barricadeFinialGeo: THREE.BufferGeometry;

  // Road & Mountain Trail Geometries
  private roadPlaneGeo: THREE.BufferGeometry;
  private roadLineGeo: THREE.BufferGeometry;
  private roadCurbGeo: THREE.BufferGeometry;
  private mandalaDecalGeo: THREE.BufferGeometry;
  private roadGarlandFlowerGeo: THREE.BufferGeometry;

  // Dense Forest Geometries (Task 1)
  private pineTier1Geo: THREE.BufferGeometry;
  private pineTier2Geo: THREE.BufferGeometry;
  private pineTier3Geo: THREE.BufferGeometry;
  private pineTrunkGeo: THREE.BufferGeometry;
  private broadleafCanopyGeo: THREE.BufferGeometry;
  private broadleafTrunkGeo: THREE.BufferGeometry;
  private mountainRockGeo: THREE.BufferGeometry;
  private bushGeo: THREE.BufferGeometry;
  private fernGeo: THREE.BufferGeometry;

  // Static cached textures
  private static cachedDawnSkyTexture: THREE.CanvasTexture | null = null;
  private static cachedMountainTrailTexture: THREE.CanvasTexture | null = null;
  private static cachedSilkTexture: THREE.CanvasTexture | null = null;
  private static cachedSaddleTexture: THREE.CanvasTexture | null = null;
  private static cachedStoneRoadTexture: THREE.CanvasTexture | null = null;
  private static cachedMandalaTexture: THREE.CanvasTexture | null = null;
  private static cachedDiyaGlowTexture: THREE.CanvasTexture | null = null;
  private static cachedGodRayTexture: THREE.CanvasTexture | null = null;
  private static cachedAlpineMountainTexture: THREE.CanvasTexture | null = null;
  private static cachedCavernRockTexture: THREE.CanvasTexture | null = null;
  private static cachedBallastTexture: THREE.CanvasTexture | null = null;
  private static cachedWoodPlankTexture: THREE.CanvasTexture | null = null;

  constructor() {
    this.initStaticTextures();

    // 1. Shimmering Gold Materials for Divine Jewelry & Mukut
    this.goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.divineGold),
      metalness: 0.88,
      roughness: 0.2,
      emissive: new THREE.Color('#78350f'),
      emissiveIntensity: 0.28,
    });

    this.shinyGoldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.brightGold),
      metalness: 0.94,
      roughness: 0.1,
      emissive: new THREE.Color('#d97706'),
      emissiveIntensity: 0.58,
    });

    // Warm Gold & Saffron Silk Dhoti (Matching Reference Image)
    this.saffronDhotiMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.saffronDhoti),
      map: ThreeModelBuilder.cachedSilkTexture,
      roughness: 0.35,
      metalness: 0.2,
      emissive: new THREE.Color('#9a3412'),
      emissiveIntensity: 0.22,
    });

    // Sacred Pink Lotus Petals & Golden Center
    this.lotusPetalMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.lotusPink),
      roughness: 0.3,
      metalness: 0.1,
      emissive: new THREE.Color(GAME_CONFIG.PALETTE.lotusPinkDeep),
      emissiveIntensity: 0.25,
    });

    this.lotusCenterMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fde047'),
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color('#d97706'),
      emissiveIntensity: 0.35,
    });

    // Flowing Dark Hair Cascading behind Crown
    this.hairMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0a0d14'),
      roughness: 0.65,
      metalness: 0.15,
    });

    // 3. Divine Radiant Skin Tone (Lord Ganesha)
    this.ganeshaSkinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f59e0b'),
      roughness: 0.32,
      metalness: 0.1,
      emissive: new THREE.Color('#92400e'),
      emissiveIntensity: 0.22,
    });

    // 4. Mooshika Fur & Pink Skin
    this.pinkSkinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.mooshikaPink),
      roughness: 0.55,
      metalness: 0.0,
    });

    // Realistic Dark Grey Fur for Mooshika (Task 1: Matching Reference Image)
    this.mushikaDarkFurMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.mushikaDarkFur),
      roughness: 0.85,
      metalness: 0.08,
    });

    this.mushikaUnderbellyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.mushikaUnderbelly),
      roughness: 0.8,
      metalness: 0.05,
    });

    // Ornate Golden Head Armor for Mooshika
    this.mushikaGoldenArmorMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.divineGold),
      metalness: 0.92,
      roughness: 0.15,
      emissive: new THREE.Color('#b45309'),
      emissiveIntensity: 0.32,
    });

    // Rich Royal Crimson & Gold Saddle Blanket
    this.saddleCrimsonMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.saddleRed),
      map: ThreeModelBuilder.cachedSaddleTexture,
      roughness: 0.38,
      metalness: 0.25,
      emissive: new THREE.Color(GAME_CONFIG.PALETTE.saddleRedDark),
      emissiveIntensity: 0.2,
    });

    // High-Fidelity Snowy Mountain Materials (Matching Reference Image)
    this.snowMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.snowPeakWhite),
      roughness: 0.2,
      metalness: 0.08,
      emissive: new THREE.Color('#cbd5e1'),
      emissiveIntensity: 0.16,
      flatShading: true,
    });

    this.mountainSlateMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.mountainRockSlate),
      map: ThreeModelBuilder.cachedAlpineMountainTexture,
      roughness: 0.82,
      metalness: 0.16,
      flatShading: true,
    });

    this.carvedPillarMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.stonePillar),
      roughness: 0.75,
      metalness: 0.18,
    });

    this.cartWoodMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#452b1a'),
      roughness: 0.82,
      metalness: 0.08,
    });

    this.marigoldOrangeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.marigoldOrange),
      roughness: 0.6,
      emissive: new THREE.Color('#c2410c'),
      emissiveIntensity: 0.25,
    });

    this.marigoldYellowMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.marigoldYellow),
      roughness: 0.55,
      emissive: new THREE.Color('#ca8a04'),
      emissiveIntensity: 0.3,
    });

    // 6. Traditional Brass Oil Lamps (Diyas) Materials
    this.diyaBrassMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d97706'),
      metalness: 0.88,
      roughness: 0.25,
      emissive: new THREE.Color('#78350f'),
      emissiveIntensity: 0.3,
    });

    this.diyaFlameMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.95,
    });

    this.diyaFlameCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    });

    this.diyaLightPoolMat = new THREE.MeshBasicMaterial({
      map: ThreeModelBuilder.cachedDiyaGlowTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // 7. Collectible Materials (Standard Modak & Mega Modak)
    this.modakRingMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });

    this.megaModakMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fbbf24'),
      metalness: 0.9,
      roughness: 0.15,
      emissive: new THREE.Color('#ea580c'),
      emissiveIntensity: 0.65,
    });

    this.megaModakAuraMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.megaModakRingMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.megaModakBeaconMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // 8. Sun, God Rays & Temple Silhouette Materials
    this.sunCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfffbeb,
      depthWrite: false,
    });

    this.sunGlowMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.godRayMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      map: ThreeModelBuilder.cachedGodRayTexture,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Mountain silhouettes and atmospheric haze
    this.mountainSilhouetteMatMid = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#252f40'),
      map: ThreeModelBuilder.cachedAlpineMountainTexture,
      roughness: 0.85,
      metalness: 0.12,
      flatShading: true,
    });

    this.mountainHazeMat = new THREE.MeshBasicMaterial({
      color: 0xc7d2fe,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Mountain Trail & Dense Forest Materials
    this.mountainTrailMaterial = new THREE.MeshStandardMaterial({
      map: ThreeModelBuilder.cachedMountainTrailTexture,
      roughness: 0.88,
      metalness: 0.06,
    });

    this.mountainRockMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.trailRock),
      roughness: 0.9,
      metalness: 0.08,
    });

    this.pineNeedleMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.pineNeedleGreen),
      roughness: 0.72,
      metalness: 0.05,
    });

    this.pineNeedleLightMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.pineNeedleLight),
      roughness: 0.68,
      metalness: 0.05,
    });

    this.pineBarkMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.pineBark),
      roughness: 0.85,
      metalness: 0.06,
    });

    this.mixedLeafMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.mixedLeafGreen),
      roughness: 0.65,
      metalness: 0.05,
    });

    this.mixedLeafAmberMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.mixedLeafAmber),
      roughness: 0.65,
      metalness: 0.05,
    });

    this.bushMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.PALETTE.bushGreen),
      roughness: 0.75,
      metalness: 0.05,
    });

    this.fernMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22c55e'),
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    // --- Pre-build Shared Geometries ---
    // 1. Regular Modak
    this.modakBaseGeo = new THREE.SphereGeometry(0.38, 14, 14);
    this.modakBaseGeo.scale(1.0, 0.78, 1.0);
    this.modakTopGeo = new THREE.ConeGeometry(0.36, 0.68, 14);
    this.modakRidgeGeo = new THREE.CylinderGeometry(0.02, 0.045, 0.58, 6);
    this.modakRingGeo = new THREE.RingGeometry(0.2, 0.54, 18);
    this.modakRingGeo.rotateX(-Math.PI / 2);

    // 2. Oversized Mega Modak
    this.megaModakBaseGeo = new THREE.SphereGeometry(0.85, 18, 18);
    this.megaModakBaseGeo.scale(1.0, 0.78, 1.0);
    this.megaModakTopGeo = new THREE.ConeGeometry(0.8, 1.45, 18);
    this.megaModakRidgeGeo = new THREE.CylinderGeometry(0.04, 0.08, 1.25, 8);
    this.megaModakAuraGeo = new THREE.SphereGeometry(1.35, 16, 16);
    this.megaModakRingGeo = new THREE.RingGeometry(0.7, 1.6, 24);
    this.megaModakRingGeo.rotateX(-Math.PI / 2);
    this.megaModakBeaconGeo = new THREE.CylinderGeometry(0.55, 0.95, 10.0, 16, 1, true);

    // 3. Oil Lamp (Diya)
    this.diyaPedestalGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.65, 10);
    this.diyaBowlGeo = new THREE.CylinderGeometry(0.24, 0.14, 0.16, 12);
    this.diyaFlameGeo = new THREE.ConeGeometry(0.09, 0.26, 8);
    this.diyaFlameCoreGeo = new THREE.ConeGeometry(0.04, 0.16, 8);
    this.diyaLightPoolGeo = new THREE.PlaneGeometry(2.4, 2.4);
    this.diyaLightPoolGeo.rotateX(-Math.PI / 2);

    // 4. Obstacles
    this.pillarBaseGeo = new THREE.BoxGeometry(1.0, 0.5, 1.0);
    this.pillarColumnGeo = new THREE.CylinderGeometry(0.36, 0.42, 2.6, 14);
    this.pillarCapitalGeo = new THREE.CylinderGeometry(0.56, 0.35, 0.4, 14);
    this.pillarTopCapGeo = new THREE.BoxGeometry(0.95, 0.22, 0.95);

    this.cartBodyGeo = new THREE.BoxGeometry(1.4, 0.42, 1.1);
    this.cartWheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.09, 12);
    this.cartWheelGeo.rotateZ(Math.PI / 2);
    this.cartHubGeo = new THREE.SphereGeometry(0.08, 8, 8);
    this.cartRoofGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 12, 1, false, 0, Math.PI);
    this.cartRoofGeo.rotateZ(Math.PI / 2);
    this.cartRoofGeo.rotateY(Math.PI / 2);
    this.cartPotGeo = new THREE.SphereGeometry(0.18, 10, 10);

    this.barricadePostGeo = new THREE.CylinderGeometry(0.13, 0.15, 1.6, 10);
    this.barricadeFinialGeo = new THREE.SphereGeometry(0.15, 8, 8);
    this.barricadeBeamGeo = new THREE.BoxGeometry(2.2, 0.16, 0.1);

    // 5. Road & Mandala Relief Decals
    this.roadPlaneGeo = new THREE.PlaneGeometry(8.6, ROAD_SEGMENT_LENGTH);
    this.roadPlaneGeo.rotateX(-Math.PI / 2);
    this.roadLineGeo = new THREE.PlaneGeometry(0.14, ROAD_SEGMENT_LENGTH);
    this.roadLineGeo.rotateX(-Math.PI / 2);
    this.roadCurbGeo = new THREE.BoxGeometry(0.65, 0.38, ROAD_SEGMENT_LENGTH);
    this.mandalaDecalGeo = new THREE.PlaneGeometry(2.1, 2.1);
    this.mandalaDecalGeo.rotateX(-Math.PI / 2);
    this.roadGarlandFlowerGeo = new THREE.SphereGeometry(0.12, 6, 6);

    // 6. Dense Forest & Mountain Assets (Task 1)
    this.pineTier1Geo = new THREE.ConeGeometry(1.6, 2.8, 7);
    this.pineTier2Geo = new THREE.ConeGeometry(1.3, 2.4, 7);
    this.pineTier3Geo = new THREE.ConeGeometry(0.9, 2.0, 7);
    this.pineTrunkGeo = new THREE.CylinderGeometry(0.22, 0.34, 3.5, 7);

    this.broadleafCanopyGeo = new THREE.DodecahedronGeometry(1.5, 1);
    this.broadleafTrunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2.8, 6);

    this.mountainRockGeo = new THREE.DodecahedronGeometry(0.85, 0);
    this.bushGeo = new THREE.SphereGeometry(0.7, 7, 6);
    this.fernGeo = new THREE.PlaneGeometry(0.5, 0.85);

    // 7. Level 2: Subterranean Minecart Railway Materials & Geometries
    this.minecartWoodMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.woodPlank),
      map: ThreeModelBuilder.cachedWoodPlankTexture,
      roughness: 0.82,
      metalness: 0.1,
    });

    this.minecartIronMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.ironBrace),
      roughness: 0.45,
      metalness: 0.88,
    });

    this.steelRailMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.railSteel),
      roughness: 0.22,
      metalness: 0.95,
      emissive: new THREE.Color('#334155'),
      emissiveIntensity: 0.2,
    });

    this.woodenSleeperMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.railSleeperWood),
      map: ThreeModelBuilder.cachedWoodPlankTexture,
      roughness: 0.88,
      metalness: 0.05,
    });

    this.ballastMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.ballastGravel),
      map: ThreeModelBuilder.cachedBallastTexture,
      roughness: 0.94,
      metalness: 0.08,
    });

    this.timberArchMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.timberBeam),
      map: ThreeModelBuilder.cachedWoodPlankTexture,
      roughness: 0.85,
      metalness: 0.08,
    });

    this.cavernRockMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.cavernRock),
      map: ThreeModelBuilder.cachedCavernRockTexture,
      roughness: 0.88,
      metalness: 0.15,
      flatShading: true,
    });

    this.crystalAmethystMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.crystalAmethyst),
      roughness: 0.15,
      metalness: 0.65,
      emissive: new THREE.Color('#a855f7'),
      emissiveIntensity: 0.65,
    });

    this.crystalSapphireMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.crystalSapphire),
      roughness: 0.15,
      metalness: 0.65,
      emissive: new THREE.Color('#0284c7'),
      emissiveIntensity: 0.65,
    });

    this.crystalEmeraldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(GAME_CONFIG.MINECART.crystalEmerald),
      roughness: 0.15,
      metalness: 0.65,
      emissive: new THREE.Color('#059669'),
      emissiveIntensity: 0.65,
    });

    this.torchFlameMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.95,
    });

    this.torchFlameCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    });

    this.torchLightPoolMat = new THREE.MeshBasicMaterial({
      map: ThreeModelBuilder.cachedDiyaGlowTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.steelRailGeo = new THREE.BoxGeometry(0.08, 0.12, ROAD_SEGMENT_LENGTH);
    this.sleeperGeo = new THREE.BoxGeometry(1.36, 0.08, 0.22);
    this.crystalGeo = new THREE.ConeGeometry(0.18, 0.75, 6);
    this.stalactiteGeo = new THREE.ConeGeometry(0.45, 3.2, 7);
  }

  // =========================================================================
  // STATIC PROCEDURAL HIGH-RES TEXTURES
  // =========================================================================
  private initStaticTextures() {
    // Mountain Dirt Trail Texture (Task 1: Dirt/Rock path with natural gravel & pine needles)
    if (!ThreeModelBuilder.cachedMountainTrailTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Rich earthy brown mountain dirt base
        ctx.fillStyle = '#5c4838';
        ctx.fillRect(0, 0, 1024, 1024);

        // Dirt path subtle layers & natural color variations
        for (let i = 0; i < 60; i++) {
          const gx = Math.random() * 1024;
          const gy = Math.random() * 1024;
          const gw = 120 + Math.random() * 200;
          const gh = 60 + Math.random() * 120;
          const shades = ['#6b5442', '#523f31', '#634d3b', '#735c49', '#4d392a'];
          ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
          ctx.beginPath();
          ctx.ellipse(gx, gy, gw / 2, gh / 2, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }

        // Central worn trail ruts (subtly compacted soil)
        const rutGrad = ctx.createLinearGradient(0, 0, 1024, 0);
        rutGrad.addColorStop(0, 'rgba(74, 61, 52, 0.4)');
        rutGrad.addColorStop(0.2, 'rgba(115, 92, 73, 0.25)');
        rutGrad.addColorStop(0.5, 'rgba(125, 105, 91, 0.35)');
        rutGrad.addColorStop(0.8, 'rgba(115, 92, 73, 0.25)');
        rutGrad.addColorStop(1, 'rgba(74, 61, 52, 0.4)');
        ctx.fillStyle = rutGrad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Embedded pebbles and mountain gravel
        for (let p = 0; p < 1200; p++) {
          const px = Math.random() * 1024;
          const py = Math.random() * 1024;
          const size = 1.5 + Math.random() * 3.5;
          const isLight = Math.random() > 0.4;
          ctx.fillStyle = isLight ? 'rgba(195, 175, 155, 0.3)' : 'rgba(35, 25, 18, 0.35)';
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Scattered fallen evergreen pine needles
        for (let n = 0; n < 800; n++) {
          const nx = Math.random() * 1024;
          const ny = Math.random() * 1024;
          const angle = Math.random() * Math.PI * 2;
          const len = 8 + Math.random() * 12;
          ctx.strokeStyle = Math.random() > 0.6 ? '#2d4a22' : '#854d0e';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(nx + Math.cos(angle) * len, ny + Math.sin(angle) * len);
          ctx.stroke();
        }
      }
      ThreeModelBuilder.cachedMountainTrailTexture = new THREE.CanvasTexture(canvas);
      ThreeModelBuilder.cachedMountainTrailTexture.wrapS = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedMountainTrailTexture.wrapT = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedMountainTrailTexture.repeat.set(2, 6);
    }

    // 1. Early Morning Dawn Sky Texture (Smooth gradient of peach, pink, and gold)
    if (!ThreeModelBuilder.cachedDawnSkyTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Vertical Dawn Sky Gradient: Deep Blue-Purple Zenith -> Warm Amber -> Glowing Peach Horizon
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
        bgGrad.addColorStop(0.0, '#312e81'); // Deep mountain indigo
        bgGrad.addColorStop(0.25, '#6366f1'); // Mountain atmospheric haze
        bgGrad.addColorStop(0.55, '#f472b6'); // Soft dawn pink
        bgGrad.addColorStop(0.8, '#fda4af');  // Warm rose peach
        bgGrad.addColorStop(1.0, '#fed7aa');  // Glowing peach horizon mist
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Radiant Golden Morning Sun Glow centered on forward horizon
        ctx.globalCompositeOperation = 'screen';
        const sunGlow = ctx.createRadialGradient(512, 880, 20, 512, 880, 550);
        sunGlow.addColorStop(0.0, 'rgba(255, 251, 235, 0.95)'); // White-hot core
        sunGlow.addColorStop(0.25, 'rgba(254, 224, 71, 0.75)'); // Radiant gold
        sunGlow.addColorStop(0.6, 'rgba(249, 115, 22, 0.45)');  // Orange warm halo
        sunGlow.addColorStop(1.0, 'rgba(244, 114, 182, 0.0)');  // Blending into pink
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(512, 880, 550, 0, Math.PI * 2);
        ctx.fill();

        // Soft wispy morning clouds
        ctx.globalCompositeOperation = 'lighter';
        const drawCloud = (cx: number, cy: number, w: number, h: number, alpha: number) => {
          const grad = ctx.createRadialGradient(cx, cy, h * 0.2, cx, cy, w);
          grad.addColorStop(0, `rgba(254, 240, 138, ${alpha})`);
          grad.addColorStop(0.5, `rgba(251, 146, 60, ${alpha * 0.4})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
          ctx.fill();
        };

        drawCloud(260, 680, 320, 45, 0.25);
        drawCloud(780, 720, 280, 40, 0.22);
        drawCloud(450, 560, 360, 50, 0.18);
        drawCloud(150, 500, 220, 35, 0.15);
        drawCloud(850, 530, 240, 38, 0.15);

        ctx.globalCompositeOperation = 'source-over';
      }
      ThreeModelBuilder.cachedDawnSkyTexture = new THREE.CanvasTexture(canvas);
    }

    // 2. Lord Ganesha Silk Cloth Brocade Texture (Rich Royal Purple with Gold Filigree)
    if (!ThreeModelBuilder.cachedSilkTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#4c1d95'; // Royal silk purple
        ctx.fillRect(0, 0, 512, 512);

        // Intricate Golden Brocade Pattern / Sacred Lotus Filigree
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        const step = 64;
        for (let x = 0; x <= 512; x += step) {
          for (let y = 0; y <= 512; y += step) {
            ctx.beginPath();
            ctx.moveTo(x + step / 2, y);
            ctx.lineTo(x + step, y + step / 2);
            ctx.lineTo(x + step / 2, y + step);
            ctx.lineTo(x, y + step / 2);
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(x + step / 2, y + step / 2, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Gold border bands
        ctx.fillStyle = '#eab308';
        ctx.fillRect(0, 0, 512, 16);
        ctx.fillRect(0, 496, 512, 16);
      }
      ThreeModelBuilder.cachedSilkTexture = new THREE.CanvasTexture(canvas);
      ThreeModelBuilder.cachedSilkTexture.wrapS = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedSilkTexture.wrapT = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedSilkTexture.repeat.set(2, 2);
    }

    // 3. Mooshika Royal Saddle Velvet Texture
    if (!ThreeModelBuilder.cachedSaddleTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#581c87';
        ctx.fillRect(0, 0, 512, 512);

        ctx.lineWidth = 14;
        ctx.strokeStyle = '#f59e0b';
        ctx.strokeRect(12, 12, 488, 488);

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fde047';
        ctx.strokeRect(28, 28, 456, 456);

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(256, 256, 48, 0, Math.PI * 2);
        ctx.fill();
      }
      ThreeModelBuilder.cachedSaddleTexture = new THREE.CanvasTexture(canvas);
    }

    // 4. Grey Stone Road Pavement Texture (Natural grey flagstone slabs)
    if (!ThreeModelBuilder.cachedStoneRoadTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Base grey stone
        ctx.fillStyle = '#787f8b';
        ctx.fillRect(0, 0, 1024, 1024);

        // Stone slabs grid with subtle chiseled variation
        const cols = 8;
        const rows = 16;
        const colW = 1024 / cols;
        const rowH = 1024 / rows;

        for (let r = 0; r < rows; r++) {
          const offset = (r % 2) * (colW / 2);
          for (let c = -1; c <= cols + 1; c++) {
            const x = c * colW + offset;
            const y = r * rowH;

            // Subtle hue shifts per stone slab
            const shade = 115 + Math.floor((Math.random() - 0.5) * 20);
            ctx.fillStyle = `rgb(${shade}, ${shade + 6}, ${shade + 14})`;
            ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

            // Bevel highlights & shadows on slab edges
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fillRect(x + 2, y + 2, colW - 4, 2);
            ctx.fillRect(x + 2, y + 2, 2, rowH - 4);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
            ctx.fillRect(x + 2, y + rowH - 4, colW - 4, 2);
            ctx.fillRect(x + colW - 4, y + 2, 2, rowH - 4);
          }
        }

        // Mortar lines between stone slabs
        ctx.strokeStyle = '#4e5561';
        ctx.lineWidth = 3;
        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * rowH);
          ctx.lineTo(1024, r * rowH);
          ctx.stroke();
        }

        // Fine granite speckles
        for (let i = 0; i < 2000; i++) {
          const sx = Math.random() * 1024;
          const sy = Math.random() * 1024;
          const bright = Math.random() > 0.5;
          ctx.fillStyle = bright ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
          ctx.fillRect(sx, sy, 2, 2);
        }
      }
      ThreeModelBuilder.cachedStoneRoadTexture = new THREE.CanvasTexture(canvas);
      ThreeModelBuilder.cachedStoneRoadTexture.wrapS = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedStoneRoadTexture.wrapT = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedStoneRoadTexture.repeat.set(2, 6);
    }

    // 5. Intricate Carved Mandala Relief Stone Texture
    if (!ThreeModelBuilder.cachedMandalaTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 512, 512);

        const cx = 256;
        const cy = 256;

        // Outer circular stone relief medallion
        const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 250);
        bgGrad.addColorStop(0, '#8f96a3');
        bgGrad.addColorStop(0.85, '#767d8a');
        bgGrad.addColorStop(1, '#5a616d');
        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 248, 0, Math.PI * 2);
        ctx.fill();

        // Outer Chiseled Bevel Rims
        ctx.strokeStyle = '#a4abb8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, 244, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#434a56';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 236, 0, Math.PI * 2);
        ctx.stroke();

        // Tier 1: 24 Carved Outer Lotus Petals
        const petalCount = 24;
        ctx.fillStyle = '#9aa1ad';
        ctx.strokeStyle = '#3e4550';
        ctx.lineWidth = 2.5;

        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2;
          const nextAngle = ((i + 1) / petalCount) * Math.PI * 2;
          const midAngle = angle + (nextAngle - angle) / 2;

          const r1 = 180;
          const r2 = 230;

          const x1 = cx + Math.cos(angle) * r1;
          const y1 = cy + Math.sin(angle) * r1;
          const x2 = cx + Math.cos(midAngle) * r2;
          const y2 = cy + Math.sin(midAngle) * r2;
          const x3 = cx + Math.cos(nextAngle) * r1;
          const y3 = cy + Math.sin(nextAngle) * r1;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Petal central spine highlight
          ctx.strokeStyle = '#bdc4ce';
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(midAngle) * r1, cy + Math.sin(midAngle) * r1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.strokeStyle = '#3e4550';
        }

        // Tier 2: Concentric Pearl Beaded Ring
        ctx.strokeStyle = '#434a56';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 175, 0, Math.PI * 2);
        ctx.stroke();

        const beadCount = 36;
        for (let i = 0; i < beadCount; i++) {
          const angle = (i / beadCount) * Math.PI * 2;
          const bx = cx + Math.cos(angle) * 165;
          const by = cy + Math.sin(angle) * 165;

          ctx.fillStyle = '#b5bcc7';
          ctx.beginPath();
          ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Tier 3: 16-Point Sacred Star Chakra
        ctx.fillStyle = '#89909c';
        const starPoints = 16;
        for (let i = 0; i < starPoints; i++) {
          const angle = (i / starPoints) * Math.PI * 2;
          const midAngle = angle + Math.PI / starPoints;
          const nextAngle = ((i + 1) / starPoints) * Math.PI * 2;

          const px1 = cx + Math.cos(angle) * 105;
          const py1 = cy + Math.sin(angle) * 105;
          const px2 = cx + Math.cos(midAngle) * 150;
          const py2 = cy + Math.sin(midAngle) * 150;
          const px3 = cx + Math.cos(nextAngle) * 105;
          const py3 = cy + Math.sin(nextAngle) * 105;

          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.lineTo(px3, py3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Tier 4: Inner 8-Petaled Lotus Blossom
        const innerPetals = 8;
        ctx.fillStyle = '#a6adb8';
        for (let i = 0; i < innerPetals; i++) {
          const angle = (i / innerPetals) * Math.PI * 2;
          const midAngle = angle + Math.PI / innerPetals;
          const nextAngle = ((i + 1) / innerPetals) * Math.PI * 2;

          const ix1 = cx + Math.cos(angle) * 45;
          const iy1 = cy + Math.sin(angle) * 45;
          const ix2 = cx + Math.cos(midAngle) * 98;
          const iy2 = cy + Math.sin(midAngle) * 98;
          const ix3 = cx + Math.cos(nextAngle) * 45;
          const iy3 = cy + Math.sin(nextAngle) * 45;

          ctx.beginPath();
          ctx.moveTo(ix1, iy1);
          ctx.lineTo(ix2, iy2);
          ctx.lineTo(ix3, iy3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Center Sacred Lotus Bindu Medallion
        const centerGrad = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, 42);
        centerGrad.addColorStop(0, '#fde047'); // Golden center sheen
        centerGrad.addColorStop(0.5, '#d97706');
        centerGrad.addColorStop(1, '#525864');
        ctx.fillStyle = centerGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ThreeModelBuilder.cachedMandalaTexture = new THREE.CanvasTexture(canvas);
    }

    // 6. Crepuscular Ray Soft Falloff Texture
    if (!ThreeModelBuilder.cachedGodRayTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.3, 'rgba(254, 240, 138, 0.75)');
        grad.addColorStop(0.7, 'rgba(251, 191, 36, 0.35)');
        grad.addColorStop(1.0, 'rgba(249, 115, 22, 0.0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 512);
      }
      ThreeModelBuilder.cachedGodRayTexture = new THREE.CanvasTexture(canvas);
    }

    // 7. Diya Ground Glow Light Decal
    if (!ThreeModelBuilder.cachedDiyaGlowTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
        grad.addColorStop(0, 'rgba(253, 224, 71, 0.9)');
        grad.addColorStop(0.35, 'rgba(245, 158, 11, 0.6)');
        grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      ThreeModelBuilder.cachedDiyaGlowTexture = new THREE.CanvasTexture(canvas);
    }

    // 8. Alpine Himalayan Mountain Texture (Slate Rock Strata, Snow Couloirs & Fissures)
    if (!ThreeModelBuilder.cachedAlpineMountainTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Deep slate-grey and charcoal rock base
        const rockGrad = ctx.createLinearGradient(0, 0, 0, 1024);
        rockGrad.addColorStop(0.0, '#334155'); // Cool slate blue at crest
        rockGrad.addColorStop(0.3, '#1e293b'); // Dark rock chasm
        rockGrad.addColorStop(0.7, '#0f172a'); // Deep shadow rock
        rockGrad.addColorStop(1.0, '#1e293b');
        ctx.fillStyle = rockGrad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Vertical rock strata, striations, and craggy fissures
        for (let i = 0; i < 220; i++) {
          const rx = Math.random() * 1024;
          const ry = Math.random() * 1024;
          const rw = 2 + Math.random() * 6;
          const rh = 60 + Math.random() * 240;
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(15, 23, 42, 0.45)' : 'rgba(71, 85, 105, 0.35)';
          ctx.fillRect(rx, ry, rw, rh);
        }

        // Snowfield accumulation in upper regions (pure white with soft slate shadows)
        const snowGrad = ctx.createLinearGradient(0, 0, 0, 520);
        snowGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
        snowGrad.addColorStop(0.25, 'rgba(248, 250, 252, 0.92)');
        snowGrad.addColorStop(0.55, 'rgba(226, 232, 240, 0.7)');
        snowGrad.addColorStop(0.85, 'rgba(203, 213, 225, 0.3)');
        snowGrad.addColorStop(1.0, 'rgba(203, 213, 225, 0.0)');
        ctx.fillStyle = snowGrad;
        ctx.fillRect(0, 0, 1024, 520);

        // Snow couloirs & gullies running down the rock face
        for (let c = 0; c < 38; c++) {
          const cx = Math.random() * 1024;
          const cy = Math.random() * 260;
          const len = 180 + Math.random() * 380;
          const wTop = 8 + Math.random() * 20;

          ctx.beginPath();
          ctx.moveTo(cx - wTop / 2, cy);
          ctx.lineTo(cx + wTop / 2, cy);
          ctx.lineTo(cx + (Math.random() - 0.5) * 45, cy + len);
          ctx.closePath();

          const couloirGrad = ctx.createLinearGradient(0, cy, 0, cy + len);
          couloirGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.92)');
          couloirGrad.addColorStop(0.7, 'rgba(241, 245, 249, 0.65)');
          couloirGrad.addColorStop(1.0, 'rgba(203, 213, 225, 0.0)');
          ctx.fillStyle = couloirGrad;
          ctx.fill();
        }

        // Glacial ice & sunlit highlight flecks
        for (let g = 0; g < 400; g++) {
          const gx = Math.random() * 1024;
          const gy = Math.random() * 600;
          const size = 1 + Math.random() * 3;
          ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(199, 210, 254, 0.5)';
          ctx.beginPath();
          ctx.arc(gx, gy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ThreeModelBuilder.cachedAlpineMountainTexture = new THREE.CanvasTexture(canvas);
      ThreeModelBuilder.cachedAlpineMountainTexture.wrapS = THREE.ClampToEdgeWrapping;
      ThreeModelBuilder.cachedAlpineMountainTexture.wrapT = THREE.ClampToEdgeWrapping;
    }

    // 9. Subterranean Cavern Rock Texture (Slate rock, fissures, deep shadows)
    if (!ThreeModelBuilder.cachedCavernRockTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e2430'; // Dark slate cavern base
        ctx.fillRect(0, 0, 1024, 1024);

        // Craggy rock fissures and deep cavern shadows
        for (let i = 0; i < 90; i++) {
          const cx = Math.random() * 1024;
          const cy = Math.random() * 1024;
          const cw = 60 + Math.random() * 180;
          const ch = 40 + Math.random() * 120;
          ctx.fillStyle = Math.random() > 0.4 ? '#121620' : '#283142';
          ctx.beginPath();
          ctx.ellipse(cx, cy, cw / 2, ch / 2, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }

        // Jagged rock cracks
        for (let c = 0; c < 40; c++) {
          let x = Math.random() * 1024;
          let y = Math.random() * 1024;
          ctx.strokeStyle = '#090d14';
          ctx.lineWidth = 2 + Math.random() * 3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          for (let s = 0; s < 5; s++) {
            x += (Math.random() - 0.5) * 80;
            y += Math.random() * 60;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Subtle mineral crystal flecks
        for (let m = 0; m < 500; m++) {
          const mx = Math.random() * 1024;
          const my = Math.random() * 1024;
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(192, 132, 252, 0.35)' : 'rgba(56, 189, 248, 0.35)';
          ctx.beginPath();
          ctx.arc(mx, my, 1.5 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ThreeModelBuilder.cachedCavernRockTexture = new THREE.CanvasTexture(canvas);
      ThreeModelBuilder.cachedCavernRockTexture.wrapS = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedCavernRockTexture.wrapT = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedCavernRockTexture.repeat.set(2, 2);
    }

    // 10. Railway Ballast Gravel Texture (Crushed stone, rail patina)
    if (!ThreeModelBuilder.cachedBallastTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#181d27';
        ctx.fillRect(0, 0, 1024, 1024);

        // Crushed stone ballast pebbles
        for (let p = 0; p < 3500; p++) {
          const px = Math.random() * 1024;
          const py = Math.random() * 1024;
          const size = 2 + Math.random() * 5;
          const shades = ['#0f131a', '#222834', '#2d3545', '#161a22', '#374151'];
          ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Subtle rail oil streaks along center
        const oilGrad = ctx.createLinearGradient(0, 0, 1024, 0);
        oilGrad.addColorStop(0, 'rgba(10, 12, 18, 0.4)');
        oilGrad.addColorStop(0.5, 'rgba(20, 15, 25, 0.6)');
        oilGrad.addColorStop(1, 'rgba(10, 12, 18, 0.4)');
        ctx.fillStyle = oilGrad;
        ctx.fillRect(0, 0, 1024, 1024);
      }
      ThreeModelBuilder.cachedBallastTexture = new THREE.CanvasTexture(canvas);
      ThreeModelBuilder.cachedBallastTexture.wrapS = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedBallastTexture.wrapT = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedBallastTexture.repeat.set(2, 6);
    }

    // 11. Weathered Dark Oak Wood Plank Texture (Minecart & Timber Frames)
    if (!ThreeModelBuilder.cachedWoodPlankTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#3d2314';
        ctx.fillRect(0, 0, 512, 512);

        // Horizontal plank seams
        const plankHeight = 64;
        for (let y = 0; y < 512; y += plankHeight) {
          ctx.strokeStyle = '#1d1008';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(512, y);
          ctx.stroke();

          // Wood grain striations
          for (let g = 0; g < 14; g++) {
            const gy = y + Math.random() * plankHeight;
            ctx.strokeStyle = Math.random() > 0.5 ? '#4e2f1b' : '#2b170c';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.lineTo(512, gy + (Math.random() - 0.5) * 6);
            ctx.stroke();
          }

          // Iron nails at plank ends
          [20, 512 - 20].forEach((nx) => {
            ctx.fillStyle = '#1c1917';
            ctx.beginPath();
            ctx.arc(nx, y + plankHeight / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }
      ThreeModelBuilder.cachedWoodPlankTexture = new THREE.CanvasTexture(canvas);
      ThreeModelBuilder.cachedWoodPlankTexture.wrapS = THREE.RepeatWrapping;
      ThreeModelBuilder.cachedWoodPlankTexture.wrapT = THREE.RepeatWrapping;
    }
  }

  // =========================================================================
  // 3D MINECART MODEL FOR LEVEL 2 (MINECART RAILWAY)
  // =========================================================================
  public createMinecart(): { group: THREE.Group; wheels: THREE.Mesh[]; lanternFlame: THREE.Mesh } {
    const group = new THREE.Group();
    group.name = 'MINECART_GROUP';

    const cartWidth = 1.34;
    const cartHeight = 0.68;
    const cartLength = 1.76;

    // Wooden plank main body
    const bodyGeo = new THREE.BoxGeometry(cartWidth, cartHeight, cartLength);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.minecartWoodMaterial);
    bodyMesh.position.set(0, 0.44, 0);
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Inner hollow rim / cavity illusion (dark interior floor)
    const interiorFloorGeo = new THREE.PlaneGeometry(cartWidth - 0.14, cartLength - 0.14);
    interiorFloorGeo.rotateX(-Math.PI / 2);
    const interiorFloor = new THREE.Mesh(interiorFloorGeo, new THREE.MeshBasicMaterial({ color: 0x140e0a }));
    interiorFloor.position.set(0, 0.52, 0);
    group.add(interiorFloor);

    // Top iron rim
    const topRimGeo = new THREE.BoxGeometry(cartWidth + 0.06, 0.08, cartLength + 0.06);
    const topRim = new THREE.Mesh(topRimGeo, this.minecartIronMaterial);
    topRim.position.set(0, 0.78, 0);
    group.add(topRim);

    // Bottom chassis iron frame
    const bottomFrameGeo = new THREE.BoxGeometry(cartWidth + 0.04, 0.09, cartLength + 0.04);
    const bottomFrame = new THREE.Mesh(bottomFrameGeo, this.minecartIronMaterial);
    bottomFrame.position.set(0, 0.14, 0);
    group.add(bottomFrame);

    // 4 Corner Iron Angles with Rivets
    const cornerOffsets = [
      { x: -cartWidth / 2 - 0.01, z: -cartLength / 2 - 0.01 },
      { x: cartWidth / 2 + 0.01, z: -cartLength / 2 - 0.01 },
      { x: -cartWidth / 2 - 0.01, z: cartLength / 2 + 0.01 },
      { x: cartWidth / 2 + 0.01, z: cartLength / 2 + 0.01 },
    ];
    cornerOffsets.forEach((co) => {
      const cornerGeo = new THREE.BoxGeometry(0.1, cartHeight + 0.04, 0.1);
      const corner = new THREE.Mesh(cornerGeo, this.minecartIronMaterial);
      corner.position.set(co.x, 0.44, co.z);
      group.add(corner);

      [-0.18, 0, 0.18].forEach((ry) => {
        const rivetGeo = new THREE.SphereGeometry(0.024, 6, 6);
        const rivet = new THREE.Mesh(rivetGeo, this.goldMaterial);
        rivet.position.set(co.x + (co.x > 0 ? 0.04 : -0.04), 0.44 + ry, co.z);
        group.add(rivet);
      });
    });

    // 4 Flanged Iron Railway Wheels on 2 Steel Axles
    const wheels: THREE.Mesh[] = [];
    const wheelRadius = 0.22;
    const wheelWidth = 0.07;
    const flangeRadius = 0.26;
    const flangeWidth = 0.025;

    const axleOffsets = [-0.52, 0.52]; // Front & Rear axles
    const sideOffsets = [-0.54, 0.54]; // Left & Right wheel centers (matches 1.08m rail spacing)

    axleOffsets.forEach((az) => {
      const axleGeo = new THREE.CylinderGeometry(0.04, 0.04, cartWidth + 0.1, 8);
      axleGeo.rotateZ(Math.PI / 2);
      const axle = new THREE.Mesh(axleGeo, this.minecartIronMaterial);
      axle.position.set(0, 0.15, az);
      group.add(axle);

      sideOffsets.forEach((sx) => {
        const boxGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
        const box = new THREE.Mesh(boxGeo, this.minecartIronMaterial);
        box.position.set(sx > 0 ? sx - 0.06 : sx + 0.06, 0.15, az);
        group.add(box);
      });
    });

    axleOffsets.forEach((az) => {
      sideOffsets.forEach((sx) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(sx, 0.15, az);

        const treadGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 14);
        treadGeo.rotateZ(Math.PI / 2);
        const tread = new THREE.Mesh(treadGeo, this.minecartIronMaterial);
        wheelGroup.add(tread);

        const flangeGeo = new THREE.CylinderGeometry(flangeRadius, flangeRadius, flangeWidth, 14);
        flangeGeo.rotateZ(Math.PI / 2);
        const flange = new THREE.Mesh(flangeGeo, this.minecartIronMaterial);
        flange.position.x = sx > 0 ? -wheelWidth / 2 : wheelWidth / 2;
        wheelGroup.add(flange);

        const hubGeo = new THREE.CylinderGeometry(0.05, 0.05, wheelWidth + 0.02, 8);
        hubGeo.rotateZ(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, this.goldMaterial);
        wheelGroup.add(hub);

        group.add(wheelGroup);
        wheels.push(wheelGroup as unknown as THREE.Mesh);
      });
    });

    // Front Brass Lantern mounted on Minecart front
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(0, 0.68, -cartLength / 2 - 0.12);

    const bracketGeo = new THREE.BoxGeometry(0.06, 0.16, 0.14);
    const bracket = new THREE.Mesh(bracketGeo, this.minecartIronMaterial);
    lanternGroup.add(bracket);

    const lanternBodyGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.18, 8);
    const lanternBody = new THREE.Mesh(lanternBodyGeo, this.diyaBrassMaterial);
    lanternBody.position.set(0, 0.08, -0.06);
    lanternGroup.add(lanternBody);

    const flameGeo = new THREE.ConeGeometry(0.045, 0.14, 8);
    const flame = new THREE.Mesh(flameGeo, this.torchFlameMat);
    flame.position.set(0, 0.1, -0.06);
    lanternGroup.add(flame);

    const lanternGlowGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const lanternGlow = new THREE.Mesh(lanternGlowGeo, new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    }));
    lanternGlow.position.set(0, 0.1, -0.06);
    lanternGroup.add(lanternGlow);

    group.add(lanternGroup);

    return { group, wheels, lanternFlame: flame };
  }

  // =========================================================================
  // 1. PLAYER: PERMANENT LORD GANESHA RIDING MUSHIKA THE GIANT MOUSE
  // Matching Reference Image (/assets/ganesh.jpg)
  // =========================================================================
  public createPlayerCharacter(): PlayerCharacterMeshes {
    const root = new THREE.Group();
    const characterRotator = new THREE.Group();
    root.add(characterRotator);

    const legs: THREE.Mesh[] = [];
    const ears: THREE.Group[] = [];
    const tassels: THREE.Group[] = [];

    // --- MUSHIKA (VAHANA - LARGE DARK GREY SACRED MOUSE) ---
    const mooshikaGroup = new THREE.Group();
    mooshikaGroup.position.set(0, 0.4, 0);

    // 1. Large, Powerful Dark Grey Body (Matching Reference)
    const bodyGeo = new THREE.SphereGeometry(0.56, 18, 18);
    bodyGeo.scale(1.18, 0.78, 1.68);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.mushikaDarkFurMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    mooshikaGroup.add(bodyMesh);

    // Underbelly & Chest (Slightly softer charcoal fur)
    const chestGeo = new THREE.SphereGeometry(0.5, 16, 16);
    chestGeo.scale(0.96, 0.64, 1.36);
    const chestMesh = new THREE.Mesh(chestGeo, this.mushikaUnderbellyMaterial);
    chestMesh.position.set(0, -0.07, -0.16);
    mooshikaGroup.add(chestMesh);

    // 2. Mushika Dark Grey Head
    const headGeo = new THREE.ConeGeometry(0.38, 0.82, 18);
    headGeo.rotateX(-Math.PI / 2);
    const headMesh = new THREE.Mesh(headGeo, this.mushikaDarkFurMaterial);
    headMesh.position.set(0, 0.15, -0.92);
    headMesh.castShadow = true;
    mooshikaGroup.add(headMesh);

    // Realistic Snout Tip
    const noseGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const noseMesh = new THREE.Mesh(noseGeo, this.pinkSkinMaterial);
    noseMesh.position.set(0, 0.12, -1.34);
    mooshikaGroup.add(noseMesh);

    // Realistic Whiskers (3 on left, 3 on right)
    const whiskerMat = new THREE.LineBasicMaterial({ color: 0x334155 });
    for (let w = 0; w < 3; w++) {
      const leftWGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.06, 0.12, -1.3),
        new THREE.Vector3(-0.35, 0.1 + w * 0.04, -1.2 + w * 0.08),
      ]);
      const leftW = new THREE.Line(leftWGeo, whiskerMat);

      const rightWGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0.06, 0.12, -1.3),
        new THREE.Vector3(0.35, 0.1 + w * 0.04, -1.2 + w * 0.08),
      ]);
      const rightW = new THREE.Line(rightWGeo, whiskerMat);
      mooshikaGroup.add(leftW, rightW);
    }

    // Glistening Expressive Dark Eyes with Catchlight
    const eyeGeo = new THREE.SphereGeometry(0.065, 14, 14);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0a0f1d });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.21, 0.3, -0.96);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.21, 0.3, -0.96);

    // White catchlight gleam in eyes
    const gleamGeo = new THREE.SphereGeometry(0.018, 8, 8);
    const gleamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftGleam = new THREE.Mesh(gleamGeo, gleamMat);
    leftGleam.position.set(-0.02, 0.02, -0.05);
    leftEye.add(leftGleam);
    const rightGleam = new THREE.Mesh(gleamGeo, gleamMat);
    rightGleam.position.set(-0.02, 0.02, -0.05);
    rightEye.add(rightGleam);
    mooshikaGroup.add(leftEye, rightEye);

    // Rounded Mouse Ears with Soft Pink Inner & Dark Fur Shell
    const ratEarGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.04, 16);
    ratEarGeo.rotateX(Math.PI / 2);

    const leftRatEar = new THREE.Mesh(ratEarGeo, this.pinkSkinMaterial);
    leftRatEar.position.set(-0.33, 0.44, -0.7);
    leftRatEar.rotation.z = 0.28;

    const rightRatEar = new THREE.Mesh(ratEarGeo, this.pinkSkinMaterial);
    rightRatEar.position.set(0.33, 0.44, -0.7);
    rightRatEar.rotation.z = -0.28;
    mooshikaGroup.add(leftRatEar, rightRatEar);

    // 3. ORNATE GOLDEN HEAD ARMOR / FOREHEAD PLATE (Matching Reference Image)
    const headArmorGroup = new THREE.Group();
    headArmorGroup.position.set(0, 0.36, -0.85);

    // Crown filigree plate between the ears
    const plateGeo = new THREE.BoxGeometry(0.36, 0.04, 0.28);
    const plateMesh = new THREE.Mesh(plateGeo, this.mushikaGoldenArmorMaterial);
    plateMesh.rotation.x = -0.3;
    headArmorGroup.add(plateMesh);

    // Central golden arch & jewel
    const archGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 16);
    archGeo.rotateX(Math.PI / 2);
    const archMesh = new THREE.Mesh(archGeo, this.shinyGoldMaterial);
    archMesh.position.set(0, 0.03, -0.06);
    headArmorGroup.add(archMesh);

    const headJewelGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const headJewelMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.1, metalness: 0.9 });
    const headJewel = new THREE.Mesh(headJewelGeo, headJewelMat);
    headJewel.position.set(0, 0.04, -0.06);
    headArmorGroup.add(headJewel);

    mooshikaGroup.add(headArmorGroup);

    // 4. Animated Gallop Legs with Gold Anklets on Paws
    const legGeo = new THREE.CapsuleGeometry(0.11, 0.36, 8, 8);
    const legPositions = [
      { x: -0.44, y: -0.22, z: -0.45 },
      { x: 0.44, y: -0.22, z: -0.45 },
      { x: -0.46, y: -0.22, z: 0.55 },
      { x: 0.46, y: -0.22, z: 0.55 },
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeo, this.mushikaDarkFurMaterial);
      leg.position.set(pos.x, pos.y, pos.z);
      leg.castShadow = true;

      // Paw with claws
      const pawGeo = new THREE.SphereGeometry(0.075, 8, 8);
      const paw = new THREE.Mesh(pawGeo, this.pinkSkinMaterial);
      paw.position.set(0, -0.19, 0.04);
      leg.add(paw);

      // Claws (dark tiny cones)
      for (let c = -1; c <= 1; c++) {
        const clawGeo = new THREE.ConeGeometry(0.015, 0.05, 6);
        clawGeo.rotateX(Math.PI / 2);
        const clawMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
        const claw = new THREE.Mesh(clawGeo, clawMat);
        claw.position.set(c * 0.035, -0.2, 0.1);
        leg.add(claw);
      }

      // Golden Anklet (Kada) above Paw (Matching Reference Image)
      const ankletGeo = new THREE.TorusGeometry(0.09, 0.022, 8, 16);
      ankletGeo.rotateX(Math.PI / 2);
      const anklet = new THREE.Mesh(ankletGeo, this.shinyGoldMaterial);
      anklet.position.set(0, -0.14, 0);
      leg.add(anklet);

      mooshikaGroup.add(leg);
      legs.push(leg);
    });

    // 5. Swishing Dark Grey Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.1, 0.95);
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.22, 0.35),
      new THREE.Vector3(0.09, 0.48, 0.72),
      new THREE.Vector3(-0.06, 0.68, 0.95),
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 14, 0.05, 8, false);
    const tailMesh = new THREE.Mesh(tailGeo, this.mushikaDarkFurMaterial);
    tailGroup.add(tailMesh);
    mooshikaGroup.add(tailGroup);

    // 6. RED AND GOLD SADDLE BLANKET WITH TASSELS (Matching Reference Image)
    const saddleGeo = new THREE.BoxGeometry(0.96, 0.09, 1.05);
    const saddleMesh = new THREE.Mesh(saddleGeo, this.saddleCrimsonMaterial);
    saddleMesh.position.set(0, 0.41, 0.06);
    saddleMesh.castShadow = true;

    // Gold Brocade Trim Border
    const trimGeo = new THREE.BoxGeometry(1.02, 0.06, 1.12);
    const trimMesh = new THREE.Mesh(trimGeo, this.shinyGoldMaterial);
    trimMesh.position.set(0, 0.39, 0.06);
    mooshikaGroup.add(trimMesh, saddleMesh);

    // Golden Hanging Tassels along left, right, and rear
    const tasselPositions = [
      // Left side tassels
      { x: -0.5, y: 0.36, z: -0.3 },
      { x: -0.5, y: 0.36, z: 0.05 },
      { x: -0.5, y: 0.36, z: 0.4 },
      // Right side tassels
      { x: 0.5, y: 0.36, z: -0.3 },
      { x: 0.5, y: 0.36, z: 0.05 },
      { x: 0.5, y: 0.36, z: 0.4 },
      // Rear tassels
      { x: -0.25, y: 0.36, z: 0.58 },
      { x: 0.25, y: 0.36, z: 0.58 },
    ];

    tasselPositions.forEach((tp) => {
      const tasselGrp = new THREE.Group();
      tasselGrp.position.set(tp.x, tp.y, tp.z);

      // Gold bead bulb
      const beadGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const bead = new THREE.Mesh(beadGeo, this.shinyGoldMaterial);
      bead.position.y = -0.02;

      // Hanging gold tassel skirt
      const skirtGeo = new THREE.ConeGeometry(0.035, 0.1, 8);
      const skirt = new THREE.Mesh(skirtGeo, this.goldMaterial);
      skirt.position.y = -0.08;

      tasselGrp.add(bead, skirt);
      mooshikaGroup.add(tasselGrp);
      tassels.push(tasselGrp);
    });

    // 7. Golden Collar & Bell on Mooshika's Chest
    const collarGeo = new THREE.TorusGeometry(0.34, 0.045, 8, 20);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, this.shinyGoldMaterial);
    collarMesh.position.set(0, 0.1, -0.74);

    const bellGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const bellMesh = new THREE.Mesh(bellGeo, this.shinyGoldMaterial);
    bellMesh.position.set(0, -0.06, -0.87);
    mooshikaGroup.add(collarMesh, bellMesh);

    characterRotator.add(mooshikaGroup);

    // --- LORD GANESHA (WARM GOLD & SAFFRON DHOTI, JEWELRY & 4 ARMS) ---
    const ganeshaGroup = new THREE.Group();
    ganeshaGroup.position.set(0, 0.88, 0.05);

    // 1. Warm Saffron Silk Dhoti Seated in Sukhasana Pose (Matching Reference Image)
    const dhotiGeo = new THREE.CylinderGeometry(0.48, 0.64, 0.42, 18);
    const dhotiMesh = new THREE.Mesh(dhotiGeo, this.saffronDhotiMaterial);
    dhotiMesh.position.set(0, 0.12, 0);
    dhotiMesh.castShadow = true;
    ganeshaGroup.add(dhotiMesh);

    // Gold Embroidered Dhoti Pleats
    const pleatsGeo = new THREE.BoxGeometry(0.25, 0.42, 0.16);
    const pleatsMesh = new THREE.Mesh(pleatsGeo, this.shinyGoldMaterial);
    pleatsMesh.position.set(0, 0.1, -0.46);
    ganeshaGroup.add(pleatsMesh);

    // Golden Waist Belt (Kamarband) with Dangling Jewels
    const beltGeo = new THREE.TorusGeometry(0.51, 0.055, 8, 24);
    beltGeo.rotateX(Math.PI / 2);
    const beltMesh = new THREE.Mesh(beltGeo, this.shinyGoldMaterial);
    beltMesh.position.set(0, 0.3, 0);
    ganeshaGroup.add(beltMesh);

    // 2. Torso (Lambodara - Chubby Divine Golden-Amber Belly)
    const bellyGeo = new THREE.SphereGeometry(0.49, 18, 18);
    bellyGeo.scale(1.06, 1.0, 0.96);
    const bellyMesh = new THREE.Mesh(bellyGeo, this.ganeshaSkinMaterial);
    bellyMesh.position.set(0, 0.6, -0.02);
    bellyMesh.castShadow = true;
    ganeshaGroup.add(bellyMesh);

    // Saffron Silk Angavastram (Shoulder Sash)
    const sashCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0.85, -0.1),
      new THREE.Vector3(-0.1, 0.75, -0.32),
      new THREE.Vector3(0.3, 0.55, -0.2),
      new THREE.Vector3(0.42, 0.4, 0.1),
    ]);
    const sashGeo = new THREE.TubeGeometry(sashCurve, 14, 0.075, 8, false);
    const sashMesh = new THREE.Mesh(sashGeo, this.saffronDhotiMaterial);
    ganeshaGroup.add(sashMesh);

    // Sacred Thread (Yajnopavita) across Chest
    const threadGeo = new THREE.TorusGeometry(0.45, 0.022, 6, 24);
    threadGeo.rotateX(Math.PI / 3);
    threadGeo.rotateZ(Math.PI / 4);
    const threadMesh = new THREE.Mesh(threadGeo, this.shinyGoldMaterial);
    threadMesh.position.set(0, 0.65, 0);
    ganeshaGroup.add(threadMesh);

    // Beautiful Flower Garland (Marigold Orange & Yellow) over Chest
    const garlandGroup = this.createFlowerGarland();
    garlandGroup.position.set(0, 0.75, -0.15);
    ganeshaGroup.add(garlandGroup);

    // Layered Golden Necklaces (Kanthi)
    const necklaceGeo = new THREE.TorusGeometry(0.37, 0.045, 8, 22);
    necklaceGeo.rotateX(Math.PI / 2);
    const necklaceMesh = new THREE.Mesh(necklaceGeo, this.shinyGoldMaterial);
    necklaceMesh.position.set(0, 0.9, -0.05);

    const innerNecklaceGeo = new THREE.TorusGeometry(0.29, 0.035, 8, 20);
    innerNecklaceGeo.rotateX(Math.PI / 2);
    const innerNecklace = new THREE.Mesh(innerNecklaceGeo, this.goldMaterial);
    innerNecklace.position.set(0, 0.95, -0.08);
    ganeshaGroup.add(necklaceMesh, innerNecklace);

    // 3. Elephant Head
    const headBaseGeo = new THREE.SphereGeometry(0.39, 18, 18);
    headBaseGeo.scale(1.0, 1.05, 0.95);
    const headBaseMesh = new THREE.Mesh(headBaseGeo, this.ganeshaSkinMaterial);
    headBaseMesh.position.set(0, 1.25, -0.06);
    headBaseMesh.castShadow = true;
    ganeshaGroup.add(headBaseMesh);

    // Gracefully Curved Trunk (Vakratunda) with Golden Tip Ornament
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.2, -0.38),
      new THREE.Vector3(0, 0.9, -0.48),
      new THREE.Vector3(0.08, 0.72, -0.52),
      new THREE.Vector3(0.22, 0.78, -0.48),
    ]);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 18, 0.11, 10, false);
    const trunkMesh = new THREE.Mesh(trunkGeo, this.ganeshaSkinMaterial);
    trunkMesh.castShadow = true;

    // Golden trunk tip ring
    const trunkRingGeo = new THREE.TorusGeometry(0.1, 0.025, 6, 14);
    const trunkRing = new THREE.Mesh(trunkRingGeo, this.shinyGoldMaterial);
    trunkRing.position.set(0.2, 0.77, -0.48);
    ganeshaGroup.add(trunkMesh, trunkRing);

    // Sacred Red Tilak on Forehead (Matching Reference)
    const tilakGeo = new THREE.BoxGeometry(0.08, 0.16, 0.02);
    const tilakMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const tilakMesh = new THREE.Mesh(tilakGeo, tilakMat);
    tilakMesh.position.set(0, 1.4, -0.42);
    ganeshaGroup.add(tilakMesh);

    // Ekadanta (Single Tusk with Golden Ring)
    const tuskGeo = new THREE.ConeGeometry(0.04, 0.18, 8);
    tuskGeo.rotateX(Math.PI / 1.5);
    const tuskMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const rightTusk = new THREE.Mesh(tuskGeo, tuskMat);
    rightTusk.position.set(-0.16, 1.04, -0.36);
    ganeshaGroup.add(rightTusk);

    // Large Divine Elephant Ears with Golden Kundala Earrings
    const leftEarGroup = new THREE.Group();
    const rightEarGroup = new THREE.Group();

    const earGeo = new THREE.CylinderGeometry(0.32, 0.24, 0.04, 18);
    earGeo.rotateZ(Math.PI / 2);

    const leftEarMesh = new THREE.Mesh(earGeo, this.ganeshaSkinMaterial);
    leftEarMesh.position.set(-0.48, 1.25, -0.06);
    leftEarMesh.rotation.y = -0.25;
    leftEarGroup.add(leftEarMesh);

    const earringGeo = new THREE.TorusGeometry(0.085, 0.022, 6, 16);
    const leftEarring = new THREE.Mesh(earringGeo, this.shinyGoldMaterial);
    leftEarring.position.set(-0.5, 1.02, -0.06);
    leftEarGroup.add(leftEarring);

    const rightEarMesh = new THREE.Mesh(earGeo, this.ganeshaSkinMaterial);
    rightEarMesh.position.set(0.48, 1.25, -0.06);
    rightEarMesh.rotation.y = 0.25;
    rightEarGroup.add(rightEarMesh);

    const rightEarring = new THREE.Mesh(earringGeo, this.shinyGoldMaterial);
    rightEarring.position.set(0.5, 1.02, -0.06);
    rightEarGroup.add(rightEarring);

    ganeshaGroup.add(leftEarGroup, rightEarGroup);
    ears.push(leftEarGroup, rightEarGroup);

    // 4. Long Flowing Dark Hair Cascading behind Crown (Matching Reference Image)
    const hairGroup = this.createFlowingDarkHair();
    hairGroup.position.set(0, 1.35, 0.08);
    ganeshaGroup.add(hairGroup);

    // 5. Four Divine Arms with Sacred Items (Matching Reference Image)
    // - Axe in upper right hand
    // - Pink Lotus in upper left hand
    // - Bowl of Modak sweets in lower left hand
    // - Abhaya Mudra blessing pose in lower right hand
    this.attachGaneshaArms(ganeshaGroup);

    // 6. Magnificent Tiered Golden Mukut (Crown) with Jewels
    const mukutGroup = this.createMagnificentMukut();
    mukutGroup.position.set(0, 1.55, -0.06);
    ganeshaGroup.add(mukutGroup);

    // 7. Soft Golden Aura (Prabhavali)
    const auraInnerGeo = new THREE.RingGeometry(0.68, 0.92, 24);
    const auraInnerMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const auraInner = new THREE.Mesh(auraInnerGeo, auraInnerMat);
    auraInner.position.set(0, 1.35, 0.2);

    const auraOuterGeo = new THREE.RingGeometry(0.85, 1.18, 24);
    const auraOuterMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const auraOuter = new THREE.Mesh(auraOuterGeo, auraOuterMat);
    auraOuter.position.set(0, 1.35, 0.21);

    ganeshaGroup.add(auraInner, auraOuter);
    characterRotator.add(ganeshaGroup);

    // 8. 3D Minecart for Level 2 (Subterranean Railway)
    const { group: minecartGroup, wheels: minecartWheels } = this.createMinecart();
    minecartGroup.visible = false; // Initially hidden in Level 1
    characterRotator.add(minecartGroup);

    return {
      root,
      characterRotator,
      legs,
      tail: tailGroup,
      auraInner,
      auraOuter,
      ears,
      mooshikaGroup,
      ganeshaGroup,
      tassels,
      hairGroup,
      minecartGroup,
      minecartWheels,
    };
  }

  // Long Flowing Dark Hair Cascading behind Crown
  private createFlowingDarkHair(): THREE.Group {
    const group = new THREE.Group();

    // Cascading strands down shoulders and back
    const strands = [
      // Left shoulder cascade
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.25, 0.1, -0.05),
        new THREE.Vector3(-0.42, -0.15, -0.02),
        new THREE.Vector3(-0.46, -0.45, 0.04),
      ]),
      // Right shoulder cascade
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.25, 0.1, -0.05),
        new THREE.Vector3(0.42, -0.15, -0.02),
        new THREE.Vector3(0.46, -0.45, 0.04),
      ]),
      // Center back cascade
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.15, 0.02),
        new THREE.Vector3(0, -0.2, 0.12),
        new THREE.Vector3(0, -0.55, 0.18),
      ]),
    ];

    strands.forEach((curve) => {
      const geo = new THREE.TubeGeometry(curve, 12, 0.065, 8, false);
      const mesh = new THREE.Mesh(geo, this.hairMaterial);
      group.add(mesh);
    });

    return group;
  }

  // Flower Garland cascading over chest
  private createFlowerGarland(): THREE.Group {
    const group = new THREE.Group();
    const flowerCount = 12;

    for (let i = 0; i < flowerCount; i++) {
      const angle = (i / (flowerCount - 1)) * Math.PI;
      const x = Math.cos(angle) * 0.32;
      const y = -Math.sin(angle) * 0.36;
      const z = -Math.sin(angle) * 0.1;

      const geo = new THREE.SphereGeometry(0.045, 8, 8);
      const mat = i % 2 === 0 ? this.marigoldOrangeMaterial : this.marigoldYellowMaterial;
      const flower = new THREE.Mesh(geo, mat);
      flower.position.set(x, y, z);
      group.add(flower);
    }

    return group;
  }

  // 4 Divine Arms with Sacred Items (Matching Reference Image)
  private attachGaneshaArms(parent: THREE.Group) {
    const armGeo = new THREE.CapsuleGeometry(0.08, 0.28, 6, 8);

    // 1. Upper Right Arm (Holding Sacred Golden Axe - Parashu)
    const upRightArm = new THREE.Mesh(armGeo, this.ganeshaSkinMaterial);
    upRightArm.position.set(0.48, 0.92, 0.05);
    upRightArm.rotation.z = -0.6;
    upRightArm.rotation.x = -0.3;

    const axe = this.createSacredAxe();
    axe.position.set(0, 0.22, 0);
    upRightArm.add(axe);

    // 2. Upper Left Arm (Holding Sacred Pink Lotus - Padma)
    const upLeftArm = new THREE.Mesh(armGeo, this.ganeshaSkinMaterial);
    upLeftArm.position.set(-0.48, 0.92, 0.05);
    upLeftArm.rotation.z = 0.6;
    upLeftArm.rotation.x = -0.3;

    const lotus = this.createSacredLotus();
    lotus.position.set(0, 0.22, 0);
    upLeftArm.add(lotus);

    // 3. Lower Left Arm (Holding Bowl of Modak Sweets)
    const lowLeftArm = new THREE.Mesh(armGeo, this.ganeshaSkinMaterial);
    lowLeftArm.position.set(-0.42, 0.65, -0.18);
    lowLeftArm.rotation.z = 0.4;
    lowLeftArm.rotation.x = 0.5;

    const modakBowl = this.createModakBowl();
    modakBowl.position.set(0, 0.2, 0.05);
    lowLeftArm.add(modakBowl);

    // 4. Lower Right Arm (Abhaya Mudra - Blessing & Protection Pose)
    const lowRightArm = new THREE.Mesh(armGeo, this.ganeshaSkinMaterial);
    lowRightArm.position.set(0.42, 0.65, -0.18);
    lowRightArm.rotation.z = -0.4;
    lowRightArm.rotation.x = -0.3;

    const abhayaHand = this.createAbhayaMudraHand();
    abhayaHand.position.set(0, 0.2, 0.05);
    lowRightArm.add(abhayaHand);

    // Golden Armlets (Bajubands) & Bangles (Kadas) on all 4 arms
    [upRightArm, upLeftArm, lowLeftArm, lowRightArm].forEach((arm) => {
      // Armlet on upper arm
      const armletGeo = new THREE.TorusGeometry(0.09, 0.02, 6, 14);
      const armlet = new THREE.Mesh(armletGeo, this.shinyGoldMaterial);
      armlet.position.set(0, 0.05, 0);

      // Bangle on wrist
      const bangleGeo = new THREE.TorusGeometry(0.08, 0.02, 6, 14);
      const bangle = new THREE.Mesh(bangleGeo, this.shinyGoldMaterial);
      bangle.position.set(0, 0.16, 0);

      arm.add(armlet, bangle);
    });

    parent.add(upRightArm, upLeftArm, lowLeftArm, lowRightArm);
  }

  // Sacred Axe (Parashu)
  private createSacredAxe(): THREE.Group {
    const group = new THREE.Group();
    const handleGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.45, 8);
    const handle = new THREE.Mesh(handleGeo, this.shinyGoldMaterial);

    const bladeGeo = new THREE.BoxGeometry(0.15, 0.2, 0.03);
    const blade = new THREE.Mesh(bladeGeo, this.goldMaterial);
    blade.position.set(0.09, 0.16, 0);

    // Ornate finial on top of axe
    const finialGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const finial = new THREE.Mesh(finialGeo, this.shinyGoldMaterial);
    finial.position.y = 0.24;

    group.add(handle, blade, finial);
    group.scale.set(0.85, 0.85, 0.85);
    return group;
  }

  // Sacred Pink Lotus Flower (Padma) (Matching Reference Image)
  private createSacredLotus(): THREE.Group {
    const group = new THREE.Group();

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = -0.1;
    group.add(stem);

    // Golden Stamen Center
    const centerGeo = new THREE.SphereGeometry(0.05, 10, 10);
    const center = new THREE.Mesh(centerGeo, this.lotusCenterMaterial);
    center.position.y = 0.06;
    group.add(center);

    // Tier 1: Inner Petals (6 petals)
    const innerPetalGeo = new THREE.ConeGeometry(0.04, 0.12, 6);
    innerPetalGeo.rotateX(Math.PI / 4);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const petal = new THREE.Mesh(innerPetalGeo, this.lotusPetalMaterial);
      petal.position.set(Math.cos(angle) * 0.04, 0.06, Math.sin(angle) * 0.04);
      petal.rotation.y = -angle;
      group.add(petal);
    }

    // Tier 2: Outer Petals (8 petals spreading outward)
    const outerPetalGeo = new THREE.ConeGeometry(0.05, 0.15, 6);
    outerPetalGeo.rotateX(Math.PI / 3);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const petal = new THREE.Mesh(outerPetalGeo, this.lotusPetalMaterial);
      petal.position.set(Math.cos(angle) * 0.07, 0.04, Math.sin(angle) * 0.07);
      petal.rotation.y = -angle;
      group.add(petal);
    }

    group.scale.set(0.9, 0.9, 0.9);
    return group;
  }

  // Golden Bowl filled with Modak Sweets (Matching Reference Image)
  private createModakBowl(): THREE.Group {
    const group = new THREE.Group();

    // Golden Ornate Bowl
    const bowlGeo = new THREE.CylinderGeometry(0.14, 0.08, 0.08, 14);
    const bowl = new THREE.Mesh(bowlGeo, this.shinyGoldMaterial);
    group.add(bowl);

    // Pyramid mound of golden modak sweets
    const modakCount = 7;
    for (let m = 0; m < modakCount; m++) {
      const angle = (m / (modakCount - 1)) * Math.PI * 2;
      const radius = m === modakCount - 1 ? 0 : 0.07;
      const yOffset = m === modakCount - 1 ? 0.08 : 0.04;

      const sweetGeo = new THREE.ConeGeometry(0.035, 0.06, 8);
      const sweet = new THREE.Mesh(sweetGeo, this.shinyGoldMaterial);
      sweet.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      group.add(sweet);
    }

    group.scale.set(0.9, 0.9, 0.9);
    return group;
  }

  // Abhaya Mudra Hand with Sacred Red Palm Mark (Matching Reference Image)
  private createAbhayaMudraHand(): THREE.Group {
    const group = new THREE.Group();

    // Open Palm
    const palmGeo = new THREE.BoxGeometry(0.09, 0.12, 0.03);
    const palm = new THREE.Mesh(palmGeo, this.ganeshaSkinMaterial);
    group.add(palm);

    // Sacred Red Auspicious Mark on Palm
    const markGeo = new THREE.CircleGeometry(0.025, 12);
    const markMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const mark = new THREE.Mesh(markGeo, markMat);
    mark.position.set(0, 0, 0.016);
    group.add(mark);

    // Fingers extended upward in blessing pose
    for (let f = -1.5; f <= 1.5; f++) {
      const fingerGeo = new THREE.CapsuleGeometry(0.012, 0.05, 4, 6);
      const finger = new THREE.Mesh(fingerGeo, this.ganeshaSkinMaterial);
      finger.position.set(f * 0.022, 0.08, 0);
      group.add(finger);
    }

    return group;
  }

  // Magnificent Tiered Golden Mukut (Crown) with Jewels (Matching Reference Image)
  private createMagnificentMukut(): THREE.Group {
    const group = new THREE.Group();

    // Tier 1 Base Crown Ring
    const baseGeo = new THREE.CylinderGeometry(0.36, 0.38, 0.18, 16);
    const base = new THREE.Mesh(baseGeo, this.shinyGoldMaterial);
    base.position.y = 0.09;

    // Tier 2 Middle Stepped Ring
    const midGeo = new THREE.CylinderGeometry(0.28, 0.34, 0.22, 16);
    const mid = new THREE.Mesh(midGeo, this.goldMaterial);
    mid.position.y = 0.28;

    // Tier 3 Top Tapered Shikhara
    const topGeo = new THREE.ConeGeometry(0.24, 0.45, 16);
    const top = new THREE.Mesh(topGeo, this.shinyGoldMaterial);
    top.position.y = 0.58;

    // Kalasha Spire Finial
    const spireGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const spire = new THREE.Mesh(spireGeo, this.shinyGoldMaterial);
    spire.position.y = 0.82;

    // Rubies & Emerald Insets on Crown
    const rubyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.1, metalness: 0.8 });
    const emeraldMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.1, metalness: 0.8 });
    const gemGeo = new THREE.SphereGeometry(0.045, 8, 8);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const gem = new THREE.Mesh(gemGeo, i % 2 === 0 ? rubyMat : emeraldMat);
      gem.position.set(Math.cos(angle) * 0.38, 0.09, Math.sin(angle) * 0.38);
      group.add(gem);
    }

    group.add(base, mid, top, spire);
    return group;
  }

  // =========================================================================
  // 2. COLLECTIBLE: REGULAR GLOWING GOLDEN MODAK (+10 POINTS)
  // =========================================================================
  public createModakMesh(): THREE.Group {
    const group = new THREE.Group();

    const baseMesh = new THREE.Mesh(this.modakBaseGeo, this.shinyGoldMaterial);
    baseMesh.position.y = 0.25;

    const topMesh = new THREE.Mesh(this.modakTopGeo, this.shinyGoldMaterial);
    topMesh.position.y = 0.6;

    // Pleated ridges
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const ridge = new THREE.Mesh(this.modakRidgeGeo, this.goldMaterial);
      ridge.position.set(Math.cos(angle) * 0.26, 0.45, Math.sin(angle) * 0.26);
      ridge.rotation.z = Math.cos(angle) * 0.2;
      ridge.rotation.x = -Math.sin(angle) * 0.2;
      group.add(ridge);
    }

    // Glowing halo ring
    const ringMesh = new THREE.Mesh(this.modakRingGeo, this.modakRingMat);
    ringMesh.position.y = 0.05;

    group.add(baseMesh, topMesh, ringMesh);
    group.scale.set(0.9, 0.9, 0.9);

    return group;
  }

  // =========================================================================
  // 3. SPECIAL BONUS: RARE OVERSIZED MEGA MODAK WITH INTENSE GOLDEN AURA (+100 POINTS)
  // =========================================================================
  public createMegaModakMesh(): THREE.Group {
    const group = new THREE.Group();

    // Oversized Golden Modak Base
    const baseMesh = new THREE.Mesh(this.megaModakBaseGeo, this.megaModakMat);
    baseMesh.position.y = 0.65;
    baseMesh.castShadow = true;

    // Oversized Golden Modak Top Point
    const topMesh = new THREE.Mesh(this.megaModakTopGeo, this.megaModakMat);
    topMesh.position.y = 1.45;
    topMesh.castShadow = true;

    // Pronounced pleat ridges
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const ridge = new THREE.Mesh(this.megaModakRidgeGeo, this.shinyGoldMaterial);
      ridge.position.set(Math.cos(angle) * 0.6, 1.1, Math.sin(angle) * 0.6);
      ridge.rotation.z = Math.cos(angle) * 0.22;
      ridge.rotation.x = -Math.sin(angle) * 0.22;
      group.add(ridge);
    }

    // Intense Golden Particle Aura (Outer Pulsing Energy Shell)
    const auraMesh = new THREE.Mesh(this.megaModakAuraGeo, this.megaModakAuraMat);
    auraMesh.position.y = 1.1;
    auraMesh.name = 'MEGA_MODAK_AURA';

    // Spinning Celestial Sun Halo Ring
    const ringMesh = new THREE.Mesh(this.megaModakRingGeo, this.megaModakRingMat);
    ringMesh.position.y = 1.1;
    ringMesh.name = 'MEGA_MODAK_RING';

    // Vertical Golden Beacon Light Beam
    const beaconMesh = new THREE.Mesh(this.megaModakBeaconGeo, this.megaModakBeaconMat);
    beaconMesh.position.y = 5.0;
    beaconMesh.name = 'MEGA_MODAK_BEACON';

    group.add(baseMesh, topMesh, auraMesh, ringMesh, beaconMesh);
    group.name = 'MEGA_MODAK_MESH';

    return group;
  }

  // Alias for backward compatibility
  public createMegaLaddooMesh(): THREE.Group {
    return this.createMegaModakMesh();
  }

  // =========================================================================
  // 4. OBSTACLES: ANCIENT STONE PILLARS & ORNATE WOODEN CARTS WITH LIT LANTERNS
  // =========================================================================

  public createFrontObstacleLantern(glowScale: number = 1.0): THREE.Group {
    const lanternGroup = new THREE.Group();

    // 1. Ornate Traditional Brass Wall Bracket extending toward +Z (facing oncoming player)
    const bracketArmGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8);
    bracketArmGeo.rotateX(Math.PI / 2);
    const bracketArm = new THREE.Mesh(bracketArmGeo, this.diyaBrassMaterial);
    bracketArm.position.set(0, 0, 0.15);

    // 2. Brass Sconce Mounting Plate
    const plateGeo = new THREE.BoxGeometry(0.22, 0.3, 0.05);
    const plate = new THREE.Mesh(plateGeo, this.diyaBrassMaterial);
    plate.position.set(0, 0, 0);

    // 3. Ornate Traditional Brass Lantern Housing
    const cageGeo = new THREE.CylinderGeometry(0.24 * glowScale, 0.15 * glowScale, 0.28 * glowScale, 10);
    const cage = new THREE.Mesh(cageGeo, this.diyaBrassMaterial);
    cage.position.set(0, -0.05, 0.32);

    const topFinialGeo = new THREE.SphereGeometry(0.08 * glowScale, 8, 8);
    const topFinial = new THREE.Mesh(topFinialGeo, this.shinyGoldMaterial);
    topFinial.position.set(0, 0.14 * glowScale, 0.32);

    // 4. Warm-Glowing Flame
    const flameGeo = new THREE.ConeGeometry(0.13 * glowScale, 0.34 * glowScale, 10);
    const flame = new THREE.Mesh(flameGeo, this.diyaFlameMat);
    flame.position.set(0, 0.05 * glowScale, 0.32);
    flame.name = 'OBSTACLE_LANTERN_FLAME';

    const coreGeo = new THREE.ConeGeometry(0.06 * glowScale, 0.22 * glowScale, 8);
    const flameCore = new THREE.Mesh(coreGeo, this.diyaFlameCoreMat);
    flameCore.position.set(0, 0.02 * glowScale, 0.32);

    // 5. Radiant Golden Glow Aura Ring
    const auraHaloGeo = new THREE.RingGeometry(0.1 * glowScale, 0.75 * glowScale, 16);
    const auraHaloMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const auraHalo = new THREE.Mesh(auraHaloGeo, auraHaloMat);
    auraHalo.position.set(0, 0.05 * glowScale, 0.38);

    // 6. Forward Warm Light Pool Decal cast onto pavement
    const lightPoolGeo = new THREE.PlaneGeometry(3.2 * glowScale, 3.2 * glowScale);
    lightPoolGeo.rotateX(-Math.PI / 2);
    const lightPool = new THREE.Mesh(lightPoolGeo, this.diyaLightPoolMat);
    lightPool.name = 'OBSTACLE_LIGHT_POOL';

    lanternGroup.add(plate, bracketArm, cage, topFinial, flame, flameCore, auraHalo, lightPool);
    lanternGroup.userData.flame = flame;
    return lanternGroup;
  }

  // Ancient Fluted South Indian Stone Pillar
  public createStonePillar(): THREE.Group {
    const group = new THREE.Group();

    // Carved Grey Stone Base Plinth
    const base = new THREE.Mesh(this.pillarBaseGeo, this.carvedPillarMaterial);
    base.position.y = 0.25;

    // Fluted Carved Column
    const column = new THREE.Mesh(this.pillarColumnGeo, this.carvedPillarMaterial);
    column.position.y = 1.65;

    // Carved Lotus Capital
    const capital = new THREE.Mesh(this.pillarCapitalGeo, this.carvedPillarMaterial);
    capital.position.y = 3.05;

    // Top Cap
    const topCap = new THREE.Mesh(this.pillarTopCapGeo, this.carvedPillarMaterial);
    topCap.position.y = 3.3;

    // Carved finial on top
    const finialGeo = new THREE.SphereGeometry(0.2, 10, 10);
    const finial = new THREE.Mesh(finialGeo, this.carvedPillarMaterial);
    finial.position.y = 3.52;

    // Front-mounted lit brass lantern facing oncoming player
    const frontLantern = this.createFrontObstacleLantern(1.15);
    frontLantern.position.set(0, 1.8, 0.45);
    const pool = frontLantern.getObjectByName('OBSTACLE_LIGHT_POOL');
    if (pool) {
      pool.position.set(0, -1.78, 0.95);
    }

    group.add(base, column, capital, topCap, finial, frontLantern);
    group.userData.flames = [frontLantern.userData.flame];
    return group;
  }

  // Stationary Ornate Wooden Cart with Lit Lanterns (Scaled & lowered for fair jumping)
  public createWoodenCart(): THREE.Group {
    const group = new THREE.Group();

    // Teak Timber Cart Frame (Lowered to 0.42m)
    const cartBody = new THREE.Mesh(this.cartBodyGeo, this.cartWoodMaterial);
    cartBody.position.y = 0.42;

    // Spoked Wooden Wheels
    const leftWheel = new THREE.Mesh(this.cartWheelGeo, this.cartWoodMaterial);
    leftWheel.position.set(-0.74, 0.32, 0);

    const rightWheel = new THREE.Mesh(this.cartWheelGeo, this.cartWoodMaterial);
    rightWheel.position.set(0.74, 0.32, 0);

    const leftHub = new THREE.Mesh(this.cartHubGeo, this.goldMaterial);
    leftHub.position.set(-0.8, 0.32, 0);
    const rightHub = new THREE.Mesh(this.cartHubGeo, this.goldMaterial);
    rightHub.position.set(0.8, 0.32, 0);

    // Decorative Low Carved Teak & Gold Railing
    const railGeo = new THREE.BoxGeometry(1.42, 0.08, 1.12);
    const rail = new THREE.Mesh(railGeo, this.shinyGoldMaterial);
    rail.position.set(0, 0.65, 0);

    // Clay Pots / Modak Offerings
    const pot1 = new THREE.Mesh(this.cartPotGeo, this.carvedPillarMaterial);
    pot1.position.set(-0.28, 0.7, -0.15);
    const pot2 = new THREE.Mesh(this.cartPotGeo, this.carvedPillarMaterial);
    pot2.position.set(0.28, 0.7, 0.15);

    // Front-mounted Lit Brass Lantern
    const centerLantern = this.createFrontObstacleLantern(0.95);
    centerLantern.position.set(0, 0.52, 0.58);
    const centerPool = centerLantern.getObjectByName('OBSTACLE_LIGHT_POOL');
    if (centerPool) centerPool.position.set(0, -0.5, 0.85);

    group.add(cartBody, leftWheel, rightWheel, leftHub, rightHub, rail, pot1, pot2, centerLantern);
    group.userData.flames = [centerLantern.userData.flame];
    return group;
  }

  public createFestiveBarricade(): THREE.Group {
    const group = new THREE.Group();

    const leftPost = new THREE.Mesh(this.barricadePostGeo, this.cartWoodMaterial);
    leftPost.position.set(-0.95, 0.8, 0);

    const rightPost = new THREE.Mesh(this.barricadePostGeo, this.cartWoodMaterial);
    rightPost.position.set(0.95, 0.8, 0);

    const leftFinial = new THREE.Mesh(this.barricadeFinialGeo, this.shinyGoldMaterial);
    leftFinial.position.set(-0.95, 1.65, 0);
    const rightFinial = new THREE.Mesh(this.barricadeFinialGeo, this.shinyGoldMaterial);
    rightFinial.position.set(0.95, 1.65, 0);

    const topBeam = new THREE.Mesh(this.barricadeBeamGeo, this.cartWoodMaterial);
    topBeam.position.set(0, 1.3, 0);

    const bottomBeam = new THREE.Mesh(this.barricadeBeamGeo, this.cartWoodMaterial);
    bottomBeam.position.set(0, 0.65, 0);

    const leftLantern = this.createFrontObstacleLantern(0.9);
    leftLantern.position.set(-0.95, 1.1, 0.15);
    const rightLantern = this.createFrontObstacleLantern(0.9);
    rightLantern.position.set(0.95, 1.1, 0.15);

    group.add(leftPost, rightPost, leftFinial, rightFinial, topBeam, bottomBeam, leftLantern, rightLantern);
    group.userData.flames = [
      leftLantern.userData.flame,
      rightLantern.userData.flame,
    ];
    return group;
  }

  // =========================================================================
  // 5. MOUNTAIN TRAIL WITH DENSE FOREST ON LEFT & RIGHT SIDES (TASK 1)
  // =========================================================================
  public createRoadSegment(length: number): THREE.Group {
    const segment = new THREE.Group();
    segment.name = 'DUAL_LEVEL_ROAD_SEGMENT';

    // -----------------------------------------------------------------------
    // LEVEL 1: MOUNTAIN FOREST TRAIL
    // -----------------------------------------------------------------------
    const level1Group = new THREE.Group();
    level1Group.name = 'LEVEL_1_GROUP';

    // 1. Mountain Trail Dirt Surface (Earthy mountain trail texture)
    const roadMesh = new THREE.Mesh(this.roadPlaneGeo, this.mountainTrailMaterial);
    level1Group.add(roadMesh);

    // 2. Clear 3-Lane Dividers (Soft golden sandstone/brass inlay)
    [-LANE_WIDTH / 2 - 0.1, LANE_WIDTH / 2 + 0.1].forEach((lx) => {
      const lineMesh = new THREE.Mesh(this.roadLineGeo, this.goldMaterial);
      lineMesh.position.set(lx, 0.015, 0);
      level1Group.add(lineMesh);
    });

    // 3. Natural Mountain Trail Curbs (Mossy granite stone edges)
    const roadWidth = 8.6;
    const leftCurb = new THREE.Mesh(this.roadCurbGeo, this.mountainRockMaterial);
    leftCurb.position.set(-roadWidth / 2 - 0.32, 0.16, 0);
    const rightCurb = new THREE.Mesh(this.roadCurbGeo, this.mountainRockMaterial);
    rightCurb.position.set(roadWidth / 2 + 0.32, 0.16, 0);
    level1Group.add(leftCurb, rightCurb);

    // 4. Dense Forest on Left & Right Sides
    this.populateDenseForestSides(level1Group, length, roadWidth);

    // 5. Rustic Stone Pedestals with Lit Diyas along the Trail Borders
    const lampStep = 25;
    for (let pz = -length / 2 + 12; pz <= length / 2 - 12; pz += lampStep) {
      [-roadWidth / 2 - 0.9, roadWidth / 2 + 0.9].forEach((px) => {
        const diyaPost = this.createGlowingDiyaPost();
        diyaPost.position.set(px, 0.16, pz);
        level1Group.add(diyaPost);

        const poolMesh = new THREE.Mesh(this.diyaLightPoolGeo, this.diyaLightPoolMat);
        const roadInwardOffset = px < 0 ? 0.7 : -0.7;
        poolMesh.position.set(px + roadInwardOffset, 0.02, pz);
        level1Group.add(poolMesh);
      });
    }

    segment.add(level1Group);

    // -----------------------------------------------------------------------
    // LEVEL 2: SUBTERRANEAN MINECART RAILWAY (TUNNELS, TRACKS, TIMBERS & CRYSTALS)
    // -----------------------------------------------------------------------
    const level2Group = new THREE.Group();
    level2Group.name = 'LEVEL_2_GROUP';
    level2Group.visible = false; // Initially hidden, enabled when level >= 2

    this.populateRailwayMineSegment(level2Group, length, roadWidth);
    segment.add(level2Group);

    segment.userData.level1Group = level1Group;
    segment.userData.level2Group = level2Group;

    return segment;
  }

  // Helper to populate Subterranean Minecart Railway (Level 2)
  private populateRailwayMineSegment(level2Group: THREE.Group, length: number, roadWidth: number) {
    // 1. Ballast Bed Ground
    const ballastGeo = new THREE.PlaneGeometry(roadWidth, length);
    ballastGeo.rotateX(-Math.PI / 2);
    const ballastMesh = new THREE.Mesh(ballastGeo, this.ballastMaterial);
    level2Group.add(ballastMesh);

    // Side Timber Curbs / Retaining Beams
    const curbGeo = new THREE.BoxGeometry(0.55, 0.32, length);
    const leftCurb = new THREE.Mesh(curbGeo, this.timberArchMaterial);
    leftCurb.position.set(-roadWidth / 2 - 0.28, 0.16, 0);
    const rightCurb = new THREE.Mesh(curbGeo, this.timberArchMaterial);
    rightCurb.position.set(roadWidth / 2 + 0.28, 0.16, 0);
    level2Group.add(leftCurb, rightCurb);

    // 2. 3 Sets of Steel Railway Tracks & Wooden Sleepers
    const lanes = [-LANE_WIDTH, 0, LANE_WIDTH]; // [-2.4, 0, 2.4]
    const railHalfGauge = 0.54; // Rail spacing = 1.08m

    lanes.forEach((lx) => {
      // Left and Right Steel Rails for this lane
      const leftRail = new THREE.Mesh(this.steelRailGeo, this.steelRailMaterial);
      leftRail.position.set(lx - railHalfGauge, 0.08, 0);
      const rightRail = new THREE.Mesh(this.steelRailGeo, this.steelRailMaterial);
      rightRail.position.set(lx + railHalfGauge, 0.08, 0);
      level2Group.add(leftRail, rightRail);

      // Wooden Sleepers (Ties) spaced every 1.5m
      const tieStep = 1.5;
      for (let sz = -length / 2 + 0.75; sz <= length / 2 - 0.75; sz += tieStep) {
        const tie = new THREE.Mesh(this.sleeperGeo, this.woodenSleeperMaterial);
        tie.position.set(lx, 0.035, sz);
        level2Group.add(tie);

        // Small iron tie plates where rails rest on sleeper
        [-railHalfGauge, railHalfGauge].forEach((rx) => {
          const plateGeo = new THREE.BoxGeometry(0.12, 0.015, 0.18);
          const plate = new THREE.Mesh(plateGeo, this.minecartIronMaterial);
          plate.position.set(lx + rx, 0.075, sz);
          level2Group.add(plate);
        });
      }
    });

    // 3. Underground Mine Timber Support Frames (Arches)
    [-12.5, 12.5].forEach((az) => {
      const arch = this.createMineTimberArch(roadWidth);
      arch.position.set(0, 0, az);
      level2Group.add(arch);
    });

    // 4. Subterranean Cavern Rock Walls, Crystals & Torches along both sides
    const sides = [-1, 1];
    sides.forEach((sideSign) => {
      const baseOffset = (roadWidth / 2 + 1.8) * sideSign;

      // Rugged Cavern Rock Boulders along the tunnel walls
      const rockOffsets = [
        { x: 1.5, z: -20, s: 1.8 },
        { x: 3.8, z: -14, s: 2.2 },
        { x: 1.8, z: -6, s: 1.9 },
        { x: 4.2, z: 2, s: 2.4 },
        { x: 1.6, z: 10, s: 1.7 },
        { x: 3.5, z: 18, s: 2.1 },
        { x: 2.0, z: 23, s: 1.8 },
      ];

      rockOffsets.forEach((ro) => {
        const rock = this.createCavernRock(ro.s);
        rock.position.set(baseOffset + ro.x * sideSign, 0, ro.z);
        level2Group.add(rock);
      });

      // Glowing Crystal Clusters (Amethyst, Sapphire, Emerald)
      const crystalPositions = [
        { x: 0.9, z: -17, type: 'amethyst' },
        { x: 2.2, z: -8, type: 'sapphire' },
        { x: 0.8, z: 5, type: 'emerald' },
        { x: 2.5, z: 15, type: 'amethyst' },
        { x: 1.1, z: -23, type: 'sapphire' },
      ];

      crystalPositions.forEach((cp) => {
        const cluster = this.createCrystalCluster(cp.type as 'amethyst' | 'sapphire' | 'emerald');
        cluster.position.set(baseOffset + cp.x * sideSign, 0.1, cp.z);
        level2Group.add(cluster);
      });

      // Wall-mounted mine torches
      [-18, 0, 18].forEach((tz) => {
        const torch = this.createMineTorch(sideSign < 0);
        torch.position.set(baseOffset + 0.4 * sideSign, 1.6, tz);
        level2Group.add(torch);
      });
    });
  }

  // Heavy Mine Timber Arch spanning across road
  public createMineTimberArch(roadWidth: number): THREE.Group {
    const arch = new THREE.Group();
    arch.name = 'MINE_TIMBER_ARCH';

    const postHeight = 5.4;
    const postThick = 0.38;
    const span = roadWidth + 1.2;

    // Left and Right Vertical Posts
    const postGeo = new THREE.BoxGeometry(postThick, postHeight, postThick);
    const leftPost = new THREE.Mesh(postGeo, this.timberArchMaterial);
    leftPost.position.set(-span / 2, postHeight / 2, 0);
    const rightPost = new THREE.Mesh(postGeo, this.timberArchMaterial);
    rightPost.position.set(span / 2, postHeight / 2, 0);
    arch.add(leftPost, rightPost);

    // Top Cross Lintel Beam
    const lintelGeo = new THREE.BoxGeometry(span + 0.6, postThick + 0.04, postThick + 0.04);
    const lintel = new THREE.Mesh(lintelGeo, this.timberArchMaterial);
    lintel.position.set(0, postHeight + 0.08, 0);
    arch.add(lintel);

    // Diagonal Corner Timber Knee-Braces
    const braceGeo = new THREE.BoxGeometry(0.24, 1.2, 0.24);
    const leftBrace = new THREE.Mesh(braceGeo, this.timberArchMaterial);
    leftBrace.position.set(-span / 2 + 0.45, postHeight - 0.45, 0);
    leftBrace.rotation.z = Math.PI / 4;

    const rightBrace = new THREE.Mesh(braceGeo, this.timberArchMaterial);
    rightBrace.position.set(span / 2 - 0.45, postHeight - 0.45, 0);
    rightBrace.rotation.z = -Math.PI / 4;
    arch.add(leftBrace, rightBrace);

    // Iron Plates and Bolts at joints
    [-span / 2, span / 2].forEach((px) => {
      const plateGeo = new THREE.BoxGeometry(0.44, 0.44, postThick + 0.06);
      const plate = new THREE.Mesh(plateGeo, this.minecartIronMaterial);
      plate.position.set(px, postHeight, 0);
      arch.add(plate);
    });

    // Hanging Brass Mine Lantern from center of lintel
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(0, postHeight - 0.2, 0);

    const chainGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.0, 6);
    const chain = new THREE.Mesh(chainGeo, this.minecartIronMaterial);
    chain.position.set(0, -0.5, 0);
    lanternGroup.add(chain);

    const lanternBodyGeo = new THREE.CylinderGeometry(0.18, 0.12, 0.34, 8);
    const lanternBody = new THREE.Mesh(lanternBodyGeo, this.diyaBrassMaterial);
    lanternBody.position.set(0, -1.15, 0);
    lanternGroup.add(lanternBody);

    const flame = new THREE.Mesh(this.diyaFlameGeo, this.torchFlameMat);
    flame.position.set(0, -1.05, 0);
    flame.name = 'DIYA_FLAME';
    lanternGroup.add(flame);

    const flameCore = new THREE.Mesh(this.diyaFlameCoreGeo, this.torchFlameCoreMat);
    flameCore.position.set(0, -1.07, 0);
    lanternGroup.add(flameCore);

    const poolMesh = new THREE.Mesh(this.diyaLightPoolGeo, this.torchLightPoolMat);
    poolMesh.position.set(0, 0.02, 0);
    arch.add(poolMesh);

    arch.add(lanternGroup);

    return arch;
  }

  // Rugged Subterranean Cavern Rock
  public createCavernRock(scale: number = 1.0): THREE.Mesh {
    const geo = new THREE.DodecahedronGeometry(scale, 1);
    const rock = new THREE.Mesh(geo, this.cavernRockMaterial);
    rock.position.y = 0.5 * scale;
    rock.scale.set(scale * 1.2, scale * 1.5, scale * 1.1);
    rock.rotation.set((scale * 1.7) % Math.PI, (scale * 2.3) % Math.PI, 0.1);
    rock.castShadow = true;
    return rock;
  }

  // Glowing Crystal Cluster (Amethyst, Sapphire, Emerald)
  public createCrystalCluster(type: 'amethyst' | 'sapphire' | 'emerald'): THREE.Group {
    const cluster = new THREE.Group();
    let mat = this.crystalAmethystMaterial;
    if (type === 'sapphire') mat = this.crystalSapphireMaterial;
    if (type === 'emerald') mat = this.crystalEmeraldMaterial;

    const crystalCount = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < crystalCount; i++) {
      const angle = (i / crystalCount) * Math.PI * 2;
      const dist = 0.12 + (i % 3) * 0.08;
      const heightScale = 0.6 + (i % 4) * 0.35;

      const crystal = new THREE.Mesh(this.crystalGeo, mat);
      crystal.position.set(Math.cos(angle) * dist, 0.38 * heightScale, Math.sin(angle) * dist);
      crystal.rotation.set((Math.random() - 0.5) * 0.3, angle, (Math.random() - 0.5) * 0.3);
      crystal.scale.set(0.85, heightScale, 0.85);
      cluster.add(crystal);
    }

    const glowColor = type === 'amethyst' ? 0xc084fc : type === 'sapphire' ? 0x38bdf8 : 0x34d399;
    const glowGeo = new THREE.PlaneGeometry(1.4, 1.4);
    glowGeo.rotateX(-Math.PI / 2);
    const glowMat = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 0.02, 0);
    cluster.add(glow);

    return cluster;
  }

  // Wall-Mounted Mine Torch
  public createMineTorch(facingRight: boolean): THREE.Group {
    const torchGroup = new THREE.Group();

    const bracketGeo = new THREE.BoxGeometry(0.35, 0.08, 0.08);
    const bracket = new THREE.Mesh(bracketGeo, this.minecartIronMaterial);
    torchGroup.add(bracket);

    const handleGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.55, 6);
    const handle = new THREE.Mesh(handleGeo, this.timberArchMaterial);
    handle.position.set(facingRight ? 0.18 : -0.18, 0.15, 0);
    handle.rotation.z = facingRight ? -0.2 : 0.2;
    torchGroup.add(handle);

    const flame = new THREE.Mesh(this.diyaFlameGeo, this.torchFlameMat);
    flame.position.set(facingRight ? 0.22 : -0.22, 0.48, 0);
    flame.name = 'DIYA_FLAME';
    torchGroup.add(flame);

    const flameCore = new THREE.Mesh(this.diyaFlameCoreGeo, this.torchFlameCoreMat);
    flameCore.position.set(facingRight ? 0.22 : -0.22, 0.44, 0);
    torchGroup.add(flameCore);

    return torchGroup;
  }

  // =========================================================================
  // SUBTERRANEAN CAVERN SKY / CEILING (LEVEL 2)
  // =========================================================================
  public createUndergroundCavernSky(): THREE.Group {
    const cavernGroup = new THREE.Group();
    cavernGroup.name = 'UNDERGROUND_CAVERN_SKY';

    // 1. Massive Cavern Rock Vault Dome
    const domeGeo = new THREE.SphereGeometry(350, 32, 22);
    const domeMat = new THREE.MeshStandardMaterial({
      map: ThreeModelBuilder.cachedCavernRockTexture,
      side: THREE.BackSide,
      roughness: 0.92,
      metalness: 0.1,
      color: 0x181d27,
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    cavernGroup.add(domeMesh);

    // 2. Hanging Stalactites from Cavern Roof
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 25 + (i % 5) * 18;
      const sx = Math.cos(angle) * radius;
      const sz = -60 - (i % 7) * 35;
      const sy = 45 + ((i * 7) % 25);
      const sScale = 2.5 + (i % 3) * 1.5;

      const stalactite = new THREE.Mesh(this.stalactiteGeo, this.cavernRockMaterial);
      stalactite.position.set(sx, sy, sz);
      stalactite.rotation.x = Math.PI; // Point down!
      stalactite.scale.set(sScale, sScale * 1.4, sScale);
      cavernGroup.add(stalactite);
    }

    // 3. Giant Glowing Crystal Geode Veins in Distant Cavern Vault
    const crystalColors = [0xc084fc, 0x38bdf8, 0x34d399];
    for (let c = 0; c < 12; c++) {
      const cx = (c % 2 === 0 ? -1 : 1) * (45 + (c % 4) * 20);
      const cz = -120 - c * 18;
      const cy = 20 + (c % 3) * 15;
      const col = crystalColors[c % 3];

      const geodeGeo = new THREE.DodecahedronGeometry(12, 1);
      const geodeMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.75,
        roughness: 0.2,
        metalness: 0.8,
      });
      const geode = new THREE.Mesh(geodeGeo, geodeMat);
      geode.position.set(cx, cy, cz);
      cavernGroup.add(geode);

      const auraGeo = new THREE.RingGeometry(12, 28, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.position.set(cx, cy, cz + 1);
      cavernGroup.add(aura);
    }

    return cavernGroup;
  }

  // Helper to populate dense layered pine and mixed forest along trail sides
  private populateDenseForestSides(segment: THREE.Group, length: number, roadWidth: number) {
    const sides = [-1, 1]; // -1: Left side, +1: Right side

    sides.forEach((sideSign) => {
      const baseOffset = (roadWidth / 2 + 1.6) * sideSign;

      // Layer 3 Near Trees: Layered Conifer Pines (14 per segment)
      const pineOffsets = [
        { x: 2.2, z: -21, s: 1.35, light: false },
        { x: 5.8, z: -18, s: 1.15, light: true },
        { x: 9.5, z: -14, s: 1.55, light: false },
        { x: 3.4, z: -10, s: 1.25, light: true },
        { x: 7.2, z: -6, s: 1.45, light: false },
        { x: 12.0, z: -2, s: 1.65, light: false },
        { x: 2.6, z: 2, s: 1.30, light: true },
        { x: 6.4, z: 6, s: 1.40, light: false },
        { x: 10.5, z: 10, s: 1.50, light: true },
        { x: 3.8, z: 14, s: 1.20, light: false },
        { x: 8.0, z: 18, s: 1.45, light: true },
        { x: 13.5, z: 21, s: 1.60, light: false },
        { x: 4.5, z: -24, s: 1.35, light: false },
        { x: 11.0, z: 24, s: 1.50, light: true },
      ];

      pineOffsets.forEach((p) => {
        const pine = this.createPineTree(p.s, p.light);
        pine.position.set(baseOffset + p.x * sideSign, 0, p.z);
        pine.rotation.y = (p.x * 1.7) % (Math.PI * 2);
        segment.add(pine);
      });

      // Layer 3 Near Trees: Broadleaf Mixed Trees (8 per segment)
      const mixedOffsets = [
        { x: 4.2, z: -15, s: 1.2, amber: false },
        { x: 8.2, z: -9, s: 1.35, amber: true },
        { x: 3.1, z: -3, s: 1.1, amber: false },
        { x: 7.5, z: 3, s: 1.25, amber: true },
        { x: 4.8, z: 9, s: 1.15, amber: false },
        { x: 9.0, z: 15, s: 1.30, amber: true },
        { x: 6.0, z: -22, s: 1.25, amber: false },
        { x: 5.5, z: 22, s: 1.2, amber: false },
      ];

      mixedOffsets.forEach((m) => {
        const tree = this.createMixedTree(m.s, m.amber);
        tree.position.set(baseOffset + m.x * sideSign, 0, m.z);
        tree.rotation.y = (m.x * 2.3) % (Math.PI * 2);
        segment.add(tree);
      });

      // Undergrowth: Mountain Bushes (12 per segment)
      for (let b = 0; b < 12; b++) {
        const u = (b / 12) - 0.5;
        const bz = u * (length - 4);
        const bx = baseOffset + (1.2 + ((b * 3.7) % 6.5)) * sideSign;
        const bush = this.createForestBush(0.85 + ((b * 1.3) % 0.5));
        bush.position.set(bx, 0, bz);
        segment.add(bush);
      }

      // Undergrowth: Mossy Mountain Rocks (8 per segment)
      for (let r = 0; r < 8; r++) {
        const u = (r / 8) - 0.5;
        const rz = u * (length - 6) + 2;
        const rx = baseOffset + (0.8 + ((r * 2.9) % 4.5)) * sideSign;
        const rock = this.createMountainRock(0.75 + ((r * 1.1) % 0.6));
        rock.position.set(rx, 0, rz);
        segment.add(rock);
      }

      // Undergrowth: Fern Patches (6 per segment)
      for (let f = 0; f < 6; f++) {
        const u = (f / 6) - 0.5;
        const fz = u * (length - 8) - 1;
        const fx = baseOffset + (1.0 + ((f * 2.1) % 3.5)) * sideSign;
        const fern = this.createFernPatch();
        fern.position.set(fx, 0, fz);
        segment.add(fern);
      }
    });
  }

  // Procedural Conifer Pine Tree (Task 1: Layered conifer with tiered needles)
  public createPineTree(scale: number = 1.0, isLight: boolean = false): THREE.Group {
    const group = new THREE.Group();
    group.name = 'PINE_TREE';

    // Bark Trunk
    const trunk = new THREE.Mesh(this.pineTrunkGeo, this.pineBarkMaterial);
    trunk.position.y = 1.75;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage Tiers
    const mat = isLight ? this.pineNeedleLightMaterial : this.pineNeedleMaterial;
    const tier1 = new THREE.Mesh(this.pineTier1Geo, mat);
    tier1.position.y = 3.2;
    tier1.castShadow = true;
    tier1.userData.isFoliage = true;

    const tier2 = new THREE.Mesh(this.pineTier2Geo, mat);
    tier2.position.y = 4.4;
    tier2.castShadow = true;
    tier2.userData.isFoliage = true;

    const tier3 = new THREE.Mesh(this.pineTier3Geo, mat);
    tier3.position.y = 5.5;
    tier3.castShadow = true;
    tier3.userData.isFoliage = true;

    group.add(tier1, tier2, tier3);
    group.scale.set(scale, scale, scale);
    return group;
  }

  // Procedural Broadleaf Mixed Tree (Task 1: Organic foliage canopy)
  public createMixedTree(scale: number = 1.0, isAmber: boolean = false): THREE.Group {
    const group = new THREE.Group();
    group.name = 'MIXED_TREE';

    // Trunk
    const trunk = new THREE.Mesh(this.broadleafTrunkGeo, this.pineBarkMaterial);
    trunk.position.y = 1.4;
    trunk.castShadow = true;
    group.add(trunk);

    // Canopy
    const mat = isAmber ? this.mixedLeafAmberMaterial : this.mixedLeafMaterial;
    const canopy = new THREE.Mesh(this.broadleafCanopyGeo, mat);
    canopy.position.y = 3.2;
    canopy.scale.set(1.1, 1.25, 1.05);
    canopy.castShadow = true;
    canopy.userData.isFoliage = true;
    group.add(canopy);

    group.scale.set(scale, scale, scale);
    return group;
  }

  // Mossy Mountain Rock (Task 1)
  public createMountainRock(scale: number = 1.0): THREE.Mesh {
    const rock = new THREE.Mesh(this.mountainRockGeo, this.mountainRockMaterial);
    rock.position.y = 0.42 * scale;
    rock.scale.set(scale * 1.1, scale * 0.75, scale * 1.0);
    rock.rotation.set(0.2, (scale * 3.7) % Math.PI, 0.1);
    rock.castShadow = true;
    return rock;
  }

  // Mountain Undergrowth Bush (Task 1)
  public createForestBush(scale: number = 1.0): THREE.Mesh {
    const bush = new THREE.Mesh(this.bushGeo, this.bushMaterial);
    bush.position.y = 0.38 * scale;
    bush.scale.set(scale * 1.15, scale * 0.75, scale * 1.15);
    bush.castShadow = true;
    bush.userData.isFoliage = true;
    return bush;
  }

  // Mountain Trail Fern Patch (Task 1)
  public createFernPatch(): THREE.Group {
    const patch = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const frond = new THREE.Mesh(this.fernGeo, this.fernMaterial);
      frond.position.set(Math.cos(angle) * 0.28, 0.32, Math.sin(angle) * 0.28);
      frond.rotation.y = angle;
      frond.rotation.x = 0.45;
      frond.userData.isFoliage = true;
      patch.add(frond);
    }
    return patch;
  }

  // Decorative roadside stone pillar without obstacle collision
  public createRoadsidePillar(): THREE.Group {
    const group = new THREE.Group();
    const base = new THREE.Mesh(this.pillarBaseGeo, this.carvedPillarMaterial);
    base.position.y = 0.25;
    const col = new THREE.Mesh(this.pillarColumnGeo, this.carvedPillarMaterial);
    col.position.y = 1.65;
    const cap = new THREE.Mesh(this.pillarCapitalGeo, this.carvedPillarMaterial);
    cap.position.y = 3.05;
    const top = new THREE.Mesh(this.pillarTopCapGeo, this.carvedPillarMaterial);
    top.position.y = 3.3;

    // Small brass hanging lantern
    const lantern = this.createFrontObstacleLantern(0.85);
    lantern.position.set(0, 1.8, 0.4);

    group.add(base, col, cap, top, lantern);
    return group;
  }

  public createRoadsideDecorativeCart(): THREE.Group {
    const group = this.createWoodenCart();
    group.scale.set(0.85, 0.85, 0.85);
    group.rotation.y = 0.15;
    return group;
  }

  private createGlowingDiyaPost(): THREE.Group {
    const postGroup = new THREE.Group();

    const pedestal = new THREE.Mesh(this.diyaPedestalGeo, this.carvedPillarMaterial);
    pedestal.position.y = 0.32;

    const diyaBowl = new THREE.Mesh(this.diyaBowlGeo, this.diyaBrassMaterial);
    diyaBowl.position.y = 0.7;

    const flame = new THREE.Mesh(this.diyaFlameGeo, this.diyaFlameMat);
    flame.position.y = 0.88;
    flame.name = 'DIYA_FLAME';

    const flameCore = new THREE.Mesh(this.diyaFlameCoreGeo, this.diyaFlameCoreMat);
    flameCore.position.y = 0.84;

    postGroup.add(pedestal, diyaBowl, flame, flameCore);
    return postGroup;
  }

  public createDrapedMarigoldGarland(span: number): THREE.Group {
    const group = new THREE.Group();
    const flowerCount = 8;

    for (let i = 0; i <= flowerCount; i++) {
      const u = i / flowerCount;
      const z = (u - 0.5) * span;
      const sag = Math.sin(u * Math.PI) * 0.26;
      const y = -sag;

      const mat = i % 2 === 0 ? this.marigoldOrangeMaterial : this.marigoldYellowMaterial;
      const flower = new THREE.Mesh(this.roadGarlandFlowerGeo, mat);
      flower.position.set(0, y, z);
      group.add(flower);
    }

    return group;
  }

  // =========================================================================
  // 6. MOUNTAIN FOREST SKY WITH PARALLAX RIDGES & SUN (TASK 1 & TASK 3)
  // =========================================================================
  public createMorningDawnSky(): THREE.Group {
    const skyGroup = new THREE.Group();

    // 1. Layer 1 (Far): Mountain Sky Dome with Sunrise & Soft Clouds
    const skyGeo = new THREE.SphereGeometry(350, 32, 22);
    const skyMat = new THREE.MeshBasicMaterial({
      map: ThreeModelBuilder.cachedDawnSkyTexture,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyGroup.add(skyMesh);

    // 2. MASSIVE GOLDEN-ORANGE MORNING SUN ON FORWARD HORIZON
    const sunZ = -340;
    const sunY = 16;
    const sunGroup = new THREE.Group();
    sunGroup.position.set(0, sunY, sunZ);

    // Sun Luminous Core
    const sunCoreGeo = new THREE.CircleGeometry(42, 36);
    const sunCore = new THREE.Mesh(sunCoreGeo, this.sunCoreMat);
    sunGroup.add(sunCore);

    // Sun Radiant Solar Corona Ring
    const sunCoronaGeo = new THREE.RingGeometry(40, 95, 36);
    const sunCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const sunCorona = new THREE.Mesh(sunCoronaGeo, sunCoronaMat);
    sunCorona.position.z = 0.1;
    sunGroup.add(sunCorona);

    // Broad Outer Sun Glow Aura
    const sunOuterAuraGeo = new THREE.CircleGeometry(160, 32);
    const sunOuterAura = new THREE.Mesh(sunOuterAuraGeo, this.sunGlowMat);
    sunOuterAura.position.z = -0.1;
    sunGroup.add(sunOuterAura);

    skyGroup.add(sunGroup);

    // 3. LAYER 1: FAR MISTY MOUNTAIN SILHOUETTES
    const farMountainGroup = this.createMistyMountainSilhouettes(sunZ + 15);
    skyGroup.add(farMountainGroup);

    // 4. LAYER 2: MID-DISTANCE MOUNTAIN TREE LINE WITH ATMOSPHERIC HAZE
    const midTreeLineGroup = this.createMidDistanceTreeLine(sunZ + 55);
    skyGroup.add(midTreeLineGroup);

    // 5. DISTINCT CREPUSCULAR RAYS (GOD RAYS) BEAMING THROUGH MOUNTAIN PEAKS
    const godRaysGroup = new THREE.Group();
    godRaysGroup.name = 'CREPUSCULAR_GOD_RAYS';

    const rayCount = 14;
    for (let i = 0; i < rayCount; i++) {
      const angleProgress = (i / (rayCount - 1)) - 0.5;
      const fanAngle = angleProgress * 1.35;

      const rayLength = 360;
      const rayWidthEnd = 38 + Math.abs(angleProgress) * 25;

      const rayGeo = new THREE.PlaneGeometry(rayWidthEnd, rayLength, 1, 4);
      rayGeo.translate(0, -rayLength / 2, 0);

      const rayMesh = new THREE.Mesh(rayGeo, this.godRayMat);
      rayMesh.position.set(0, sunY + 4, sunZ + 2);

      rayMesh.rotation.z = fanAngle;
      rayMesh.rotation.x = -Math.PI / 2.35 + Math.abs(angleProgress) * 0.15;

      rayMesh.userData = {
        baseOpacity: 0.28 + (Math.sin(i * 1.7) * 0.1),
        speed: 0.6 + (i % 3) * 0.25,
        phase: i * 0.8,
      };

      godRaysGroup.add(rayMesh);
    }
    skyGroup.add(godRaysGroup);

    return skyGroup;
  }

  // High-Detail Rugged Himalayan Alpine Mountain Peak (Matching Reference Image)
  private createRuggedAlpinePeak(
    width: number,
    height: number,
    snowCoverage: number, // e.g. 0.45 (top 45% is heavy snow)
    seed: number
  ): THREE.Group {
    const group = new THREE.Group();

    // 1. Procedural Jagged Multi-Arête Mountain Geometry
    const radialSegments = 10;
    const heightTiers = 6;
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Apex vertex (the summit peak)
    vertices.push(0, height, 0);
    uvs.push(0.5, 0.0);

    // Generate tiers of vertices from near-summit to mountain base
    for (let t = 1; t <= heightTiers; t++) {
      const vProgress = t / heightTiers; // 0 near top, 1 at base
      const tierY = height * (1 - Math.pow(vProgress, 1.25));

      // Base radius flares exponentially towards the ground like real mountains
      const tierBaseRadius = (width / 2) * Math.pow(vProgress, 0.9);

      for (let s = 0; s < radialSegments; s++) {
        const angle = (s / radialSegments) * Math.PI * 2;

        // Multi-frequency fractal ridge noise for sharp jagged arêtes
        const ridgeNoise =
          Math.sin(angle * 3 + seed * 1.7) * 0.18 +
          Math.cos(angle * 5 + seed * 3.1) * 0.12 +
          Math.sin(angle * 8 + t * 2.3) * 0.08;

        const radX = tierBaseRadius * (1.0 + ridgeNoise);
        const radZ = tierBaseRadius * (0.85 + Math.cos(angle * 2 + seed) * 0.2);

        // Jagged cliff ledges
        const cliffY = tierY + (Math.sin(angle * 4 + t * 3) * height * 0.04);

        const vx = Math.cos(angle) * radX;
        const vz = Math.sin(angle) * radZ;

        vertices.push(vx, Math.max(0, cliffY), vz);
        uvs.push(s / radialSegments, vProgress);
      }
    }

    // Connect apex (vertex 0) to tier 1
    for (let s = 0; s < radialSegments; s++) {
      const nextS = (s + 1) % radialSegments;
      indices.push(0, 1 + s, 1 + nextS);
    }

    // Connect successive tiers with quad triangles
    for (let t = 1; t < heightTiers; t++) {
      const currentTierStart = 1 + (t - 1) * radialSegments;
      const nextTierStart = 1 + t * radialSegments;

      for (let s = 0; s < radialSegments; s++) {
        const nextS = (s + 1) % radialSegments;

        const c1 = currentTierStart + s;
        const c2 = currentTierStart + nextS;
        const n1 = nextTierStart + s;
        const n2 = nextTierStart + nextS;

        indices.push(c1, n1, c2);
        indices.push(c2, n1, n2);
      }
    }

    const mountainGeo = new THREE.BufferGeometry();
    mountainGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    mountainGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    mountainGeo.setIndex(indices);
    mountainGeo.computeVertexNormals();

    const mountainMesh = new THREE.Mesh(mountainGeo, this.mountainSlateMaterial);
    mountainMesh.castShadow = true;
    mountainMesh.receiveShadow = true;
    group.add(mountainMesh);

    // 2. High-Altitude Glacial Snow Cap & Jagged Snow Chutes
    const snowTiers = Math.max(2, Math.round(heightTiers * snowCoverage));
    const snowVertices: number[] = [];
    const snowUvs: number[] = [];
    const snowIndices: number[] = [];

    snowVertices.push(0, height + 0.05, 0); // Slight offset above rock to avoid z-fighting
    snowUvs.push(0.5, 0.0);

    for (let t = 1; t <= snowTiers; t++) {
      const vProgress = t / heightTiers;
      const tierY = height * (1 - Math.pow(vProgress, 1.25));
      const tierBaseRadius = (width / 2) * Math.pow(vProgress, 0.9);

      for (let s = 0; s < radialSegments; s++) {
        const angle = (s / radialSegments) * Math.PI * 2;

        const ridgeNoise =
          Math.sin(angle * 3 + seed * 1.7) * 0.18 +
          Math.cos(angle * 5 + seed * 3.1) * 0.12 +
          Math.sin(angle * 8 + t * 2.3) * 0.08;

        // Snow extends further down the valleys between ridges
        const chuteExtension = Math.sin(angle * 4 + seed) > 0 ? 1.08 : 0.95;
        const radX = tierBaseRadius * (1.0 + ridgeNoise) * chuteExtension + 0.08;
        const radZ = tierBaseRadius * (0.85 + Math.cos(angle * 2 + seed) * 0.2) * chuteExtension + 0.08;
        const cliffY = tierY + (Math.sin(angle * 4 + t * 3) * height * 0.04) + 0.05;

        snowVertices.push(Math.cos(angle) * radX, Math.max(0, cliffY), Math.sin(angle) * radZ);
        snowUvs.push(s / radialSegments, vProgress);
      }
    }

    // Connect snow apex to tier 1
    for (let s = 0; s < radialSegments; s++) {
      const nextS = (s + 1) % radialSegments;
      snowIndices.push(0, 1 + s, 1 + nextS);
    }

    // Connect snow tiers
    for (let t = 1; t < snowTiers; t++) {
      const currentTierStart = 1 + (t - 1) * radialSegments;
      const nextTierStart = 1 + t * radialSegments;

      for (let s = 0; s < radialSegments; s++) {
        const nextS = (s + 1) % radialSegments;
        const c1 = currentTierStart + s;
        const c2 = currentTierStart + nextS;
        const n1 = nextTierStart + s;
        const n2 = nextTierStart + nextS;

        snowIndices.push(c1, n1, c2);
        snowIndices.push(c2, n1, n2);
      }
    }

    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute('position', new THREE.Float32BufferAttribute(snowVertices, 3));
    snowGeo.setAttribute('uv', new THREE.Float32BufferAttribute(snowUvs, 2));
    snowGeo.setIndex(snowIndices);
    snowGeo.computeVertexNormals();

    const snowMesh = new THREE.Mesh(snowGeo, this.snowMaterial);
    snowMesh.castShadow = true;
    group.add(snowMesh);

    return group;
  }

  // Layer 1 (Far): High-Fidelity Himalayan Alpine Mountain Range (Matching Reference Image)
  private createMistyMountainSilhouettes(horizonZ: number): THREE.Group {
    const group = new THREE.Group();
    group.name = 'FAR_MOUNTAIN_SILHOUETTES';

    // 1. LAYER 1: Colossal Himalayan Crest (Backdrop Range)
    const farPeaks = [
      { x: -220, w: 165, h: 122, snow: 0.52, seed: 1.2 },
      { x: -145, w: 140, h: 105, snow: 0.48, seed: 2.5 },
      { x: -72, w: 120, h: 88, snow: 0.45, seed: 3.8 },
      { x: 0, w: 130, h: 72, snow: 0.40, seed: 4.1 }, // Saddle valley framing horizon sun
      { x: 72, w: 120, h: 88, snow: 0.45, seed: 5.4 },
      { x: 145, w: 140, h: 105, snow: 0.48, seed: 6.7 },
      { x: 220, w: 165, h: 122, snow: 0.52, seed: 7.9 },
    ];

    farPeaks.forEach((p) => {
      const peakGroup = this.createRuggedAlpinePeak(p.w, p.h, p.snow, p.seed);
      peakGroup.position.set(p.x, 0, horizonZ);
      group.add(peakGroup);
    });

    // Connecting mountain saddles/cols between adjacent peaks (seamless skyline with zero gaps)
    const saddles = [
      { x: -180, w: 90, h: 58, z: horizonZ + 5, seed: 2.1 },
      { x: -108, w: 85, h: 52, z: horizonZ + 5, seed: 3.4 },
      { x: -36, w: 80, h: 44, z: horizonZ + 5, seed: 4.7 },
      { x: 36, w: 80, h: 44, z: horizonZ + 5, seed: 5.1 },
      { x: 108, w: 85, h: 52, z: horizonZ + 5, seed: 6.3 },
      { x: 180, w: 90, h: 58, z: horizonZ + 5, seed: 7.2 },
    ];

    saddles.forEach((s) => {
      const saddleMesh = this.createRuggedAlpinePeak(s.w, s.h, 0.35, s.seed);
      saddleMesh.position.set(s.x, 0, s.z);
      group.add(saddleMesh);
    });

    // 2. LAYER 2: Mid-Distance Jagged Alpine Arêtes & Cirques
    const midPeaks = [
      { x: -185, w: 115, h: 72, snow: 0.45, seed: 8.3 },
      { x: -110, w: 98, h: 60, snow: 0.40, seed: 9.1 },
      { x: -42, w: 88, h: 48, snow: 0.35, seed: 10.4 },
      { x: 42, w: 88, h: 48, snow: 0.35, seed: 11.2 },
      { x: 110, w: 98, h: 60, snow: 0.40, seed: 12.6 },
      { x: 185, w: 115, h: 72, snow: 0.45, seed: 13.9 },
    ];

    midPeaks.forEach((p) => {
      const midGroup = this.createRuggedAlpinePeak(p.w, p.h, p.snow, p.seed);
      midGroup.position.set(p.x, 0, horizonZ + 25);
      group.add(midGroup);
    });

    // 3. LAYER 3: Volumetric Atmospheric Mountain Mist & Cloud Bands
    const mistBands = [
      { y: 14, z: horizonZ + 12, w: 380, h: 28, opacity: 0.42 },
      { y: 26, z: horizonZ + 18, w: 350, h: 32, opacity: 0.32 },
      { y: 38, z: horizonZ + 32, w: 320, h: 24, opacity: 0.25 },
    ];

    mistBands.forEach((mb) => {
      const mistGeo = new THREE.PlaneGeometry(mb.w, mb.h);
      const mistMat = new THREE.MeshBasicMaterial({
        color: 0xc7d2fe,
        transparent: true,
        opacity: mb.opacity,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mistMesh = new THREE.Mesh(mistGeo, mistMat);
      mistMesh.position.set(0, mb.y, mb.z);
      group.add(mistMesh);
    });

    return group;
  }

  // Layer 2 (Mid): Distant Tree Line with Atmospheric Haze
  private createMidDistanceTreeLine(depthZ: number): THREE.Group {
    const group = new THREE.Group();
    group.name = 'MID_TREELINE_RIDGE';

    // Undulating tree line silhouette across the middle distance
    const treeCount = 28;
    for (let t = 0; t < treeCount; t++) {
      const u = (t / (treeCount - 1)) - 0.5;
      const tx = u * 240;
      const th = 16 + Math.sin(t * 1.4) * 6 + ((t * 3.7) % 5);
      const tw = 8 + (t % 3) * 2;

      const treeGeo = new THREE.ConeGeometry(tw, th, 5);
      const treeMesh = new THREE.Mesh(treeGeo, this.mountainSilhouetteMatMid);
      treeMesh.position.set(tx, th / 2, depthZ + (t % 4) * 5);
      group.add(treeMesh);
    }

    // Atmospheric valley mist haze band
    const hazeGeo = new THREE.PlaneGeometry(300, 24);
    const hazeMesh = new THREE.Mesh(hazeGeo, this.mountainHazeMat);
    hazeMesh.position.set(0, 10, depthZ + 8);
    group.add(hazeMesh);

    return group;
  }

  // Alias for backward compatibility
  public createCelestialSky(): THREE.Group {
    return this.createMorningDawnSky();
  }
}
