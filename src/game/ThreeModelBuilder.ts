import * as THREE from 'three';
import { LANE_WIDTH, PALETTE, ROAD_SEGMENT_LENGTH } from './constants';

export interface PlayerCharacterMeshes {
  root: THREE.Group;
  characterRotator: THREE.Group;
  legs: THREE.Mesh[];
  tail: THREE.Group;
  auraInner: THREE.Mesh;
  auraOuter: THREE.Mesh;
  ears: THREE.Group[];
}

export class ThreeModelBuilder {
  // Shared materials for top performance and visual consistency
  private goldMaterial: THREE.MeshStandardMaterial;
  private shinyGoldMaterial: THREE.MeshStandardMaterial;
  private royalSilkMaterial: THREE.MeshStandardMaterial;
  private ganeshaSkinMaterial: THREE.MeshStandardMaterial;

  // Mooshika Grey Rat Materials
  private mooshikaGreyMaterial: THREE.MeshStandardMaterial;
  private mooshikaLightGreyMaterial: THREE.MeshStandardMaterial;
  private pinkSkinMaterial: THREE.MeshStandardMaterial;

  // Grey Stone Road & Carved Mandala Materials
  private greyStoneRoadMaterial: THREE.MeshStandardMaterial;
  private carvedMandalaMaterial: THREE.MeshStandardMaterial;
  private carvedPillarMaterial: THREE.MeshStandardMaterial;
  private cartWoodMaterial: THREE.MeshStandardMaterial;
  private marigoldOrangeMaterial: THREE.MeshStandardMaterial;
  private marigoldYellowMaterial: THREE.MeshStandardMaterial;

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
  private templeSilhouetteMat: THREE.MeshBasicMaterial;

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

  // Road Geometries
  private roadPlaneGeo: THREE.BufferGeometry;
  private roadLineGeo: THREE.BufferGeometry;
  private roadCurbGeo: THREE.BufferGeometry;
  private mandalaDecalGeo: THREE.BufferGeometry;
  private roadGarlandFlowerGeo: THREE.BufferGeometry;

  // Static cached textures
  private static cachedDawnSkyTexture: THREE.CanvasTexture | null = null;
  private static cachedSilkTexture: THREE.CanvasTexture | null = null;
  private static cachedSaddleTexture: THREE.CanvasTexture | null = null;
  private static cachedStoneRoadTexture: THREE.CanvasTexture | null = null;
  private static cachedMandalaTexture: THREE.CanvasTexture | null = null;
  private static cachedDiyaGlowTexture: THREE.CanvasTexture | null = null;
  private static cachedGodRayTexture: THREE.CanvasTexture | null = null;

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

    // 2. Lord Ganesha's Royal Silk Cloth (Rich Royal Purple with Gold Brocade Texture)
    this.royalSilkMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#581c87'),
      map: ThreeModelBuilder.cachedSilkTexture,
      roughness: 0.32,
      metalness: 0.22,
    });

    // 3. Divine Radiant Skin Tone (Lord Ganesha)
    this.ganeshaSkinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f59e0b'),
      roughness: 0.32,
      metalness: 0.1,
      emissive: new THREE.Color('#92400e'),
      emissiveIntensity: 0.22,
    });

    // 4. Mooshika Fur (Grey Rat) & Pink Skin
    this.mooshikaGreyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.mooshikaGrey),
      roughness: 0.52,
      metalness: 0.08,
    });

    this.mooshikaLightGreyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.mooshikaLightGrey),
      roughness: 0.48,
      metalness: 0.06,
    });

    this.pinkSkinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.mooshikaPink),
      roughness: 0.55,
      metalness: 0.0,
    });

    // 5. Early Morning Grey Stone Road & Carved Mandala Materials
    this.greyStoneRoadMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.stoneRoad),
      map: ThreeModelBuilder.cachedStoneRoadTexture,
      roughness: 0.82,
      metalness: 0.12,
    });

    this.carvedMandalaMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      map: ThreeModelBuilder.cachedMandalaTexture,
      transparent: true,
      roughness: 0.75,
      metalness: 0.15,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
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

    this.templeSilhouetteMat = new THREE.MeshBasicMaterial({
      color: 0xb4533c,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
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
  }

  // =========================================================================
  // STATIC PROCEDURAL HIGH-RES TEXTURES
  // =========================================================================
  private initStaticTextures() {
    // 1. Early Morning Dawn Sky Texture (Smooth gradient of peach, pink, and gold)
    if (!ThreeModelBuilder.cachedDawnSkyTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Vertical Dawn Sky Gradient: Golden Amber Zenith -> Rose Pink -> Peach Horizon
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
        bgGrad.addColorStop(0.0, '#ea580c'); // Golden-orange apex
        bgGrad.addColorStop(0.25, '#fb923c'); // Morning warm amber
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
  }

  // =========================================================================
  // 1. PLAYER: LORD GANESHA RIDING MOOSHIKA THE GREY RAT (180° ROTATION)
  // =========================================================================
  public createPlayerCharacter(): PlayerCharacterMeshes {
    const root = new THREE.Group();
    const characterRotator = new THREE.Group();
    root.add(characterRotator);

    const legs: THREE.Mesh[] = [];
    const ears: THREE.Group[] = [];

    // --- MOOSHIKA (VAHANA - GREY SACRED RAT) ---
    const mooshikaGroup = new THREE.Group();
    mooshikaGroup.position.set(0, 0.4, 0);

    // Mooshika Sleek Grey Body
    const bodyGeo = new THREE.SphereGeometry(0.55, 16, 16);
    bodyGeo.scale(1.1, 0.75, 1.6);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.mooshikaGreyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    mooshikaGroup.add(bodyMesh);

    // Lighter grey underbelly & chest
    const chestGeo = new THREE.SphereGeometry(0.48, 14, 14);
    chestGeo.scale(0.9, 0.6, 1.3);
    const chestMesh = new THREE.Mesh(chestGeo, this.mooshikaLightGreyMaterial);
    chestMesh.position.set(0, -0.08, -0.15);
    mooshikaGroup.add(chestMesh);

    // Mooshika Grey Head
    const headGeo = new THREE.ConeGeometry(0.35, 0.75, 16);
    headGeo.rotateX(-Math.PI / 2);
    const headMesh = new THREE.Mesh(headGeo, this.mooshikaGreyMaterial);
    headMesh.position.set(0, 0.15, -0.9);
    headMesh.castShadow = true;
    mooshikaGroup.add(headMesh);

    // Cute Pink Snout Tip
    const noseGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const noseMesh = new THREE.Mesh(noseGeo, this.pinkSkinMaterial);
    noseMesh.position.set(0, 0.12, -1.3);
    mooshikaGroup.add(noseMesh);

    // Cute Dark Eyes with Divine Sparkle
    const eyeGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 0.28, -0.95);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.2, 0.28, -0.95);
    mooshikaGroup.add(leftEye, rightEye);

    // Cute Round Ears with Soft Pink Inner Ear & Grey Outer Shell
    const ratEarGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16);
    ratEarGeo.rotateX(Math.PI / 2);

    const leftRatEar = new THREE.Mesh(ratEarGeo, this.pinkSkinMaterial);
    leftRatEar.position.set(-0.32, 0.42, -0.7);
    leftRatEar.rotation.z = 0.3;

    const rightRatEar = new THREE.Mesh(ratEarGeo, this.pinkSkinMaterial);
    rightRatEar.position.set(0.32, 0.42, -0.7);
    rightRatEar.rotation.z = -0.3;
    mooshikaGroup.add(leftRatEar, rightRatEar);

    // 4 Animated Running Gallop Grey Legs with Pink Paws
    const legGeo = new THREE.CapsuleGeometry(0.1, 0.35, 8, 8);
    const legPositions = [
      { x: -0.42, y: -0.22, z: -0.45 },
      { x: 0.42, y: -0.22, z: -0.45 },
      { x: -0.45, y: -0.22, z: 0.55 },
      { x: 0.45, y: -0.22, z: 0.55 },
    ];
    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeo, this.mooshikaGreyMaterial);
      leg.position.set(pos.x, pos.y, pos.z);
      leg.castShadow = true;

      // Small pink paw at foot
      const pawGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const paw = new THREE.Mesh(pawGeo, this.pinkSkinMaterial);
      paw.position.set(0, -0.18, 0.04);
      leg.add(paw);

      mooshikaGroup.add(leg);
      legs.push(leg);
    });

    // Swishing Grey Rat Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.1, 0.9);
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.2, 0.35),
      new THREE.Vector3(0.08, 0.45, 0.7),
      new THREE.Vector3(-0.05, 0.65, 0.9),
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 12, 0.05, 8, false);
    const tailMesh = new THREE.Mesh(tailGeo, this.mooshikaGreyMaterial);
    tailGroup.add(tailMesh);
    mooshikaGroup.add(tailGroup);

    // Royal Saddle Cloth with Intricate Gold Brocade & Tassels
    const saddleMat = new THREE.MeshStandardMaterial({
      color: 0x6b21a8,
      map: ThreeModelBuilder.cachedSaddleTexture,
      roughness: 0.35,
      metalness: 0.25,
    });
    const saddleGeo = new THREE.BoxGeometry(0.92, 0.08, 0.98);
    const saddleMesh = new THREE.Mesh(saddleGeo, saddleMat);
    saddleMesh.position.set(0, 0.4, 0.05);
    saddleMesh.castShadow = true;

    const trimGeo = new THREE.BoxGeometry(0.98, 0.05, 1.05);
    const trimMesh = new THREE.Mesh(trimGeo, this.shinyGoldMaterial);
    trimMesh.position.set(0, 0.38, 0.05);
    mooshikaGroup.add(trimMesh, saddleMesh);

    // Golden Collar & Bell on Mooshika's Chest
    const collarGeo = new THREE.TorusGeometry(0.32, 0.04, 8, 18);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, this.shinyGoldMaterial);
    collarMesh.position.set(0, 0.1, -0.72);

    const bellGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const bellMesh = new THREE.Mesh(bellGeo, this.shinyGoldMaterial);
    bellMesh.position.set(0, -0.05, -0.85);
    mooshikaGroup.add(collarMesh, bellMesh);

    characterRotator.add(mooshikaGroup);

    // --- LORD GANESHA (ROYAL PURPLE SILK & INTRICATE GOLD JEWELRY) ---
    const ganeshaGroup = new THREE.Group();
    ganeshaGroup.position.set(0, 0.88, 0.05);

    // Royal Purple Silk Dhoti Seated Sukhasana Pose
    const dhotiGeo = new THREE.CylinderGeometry(0.48, 0.62, 0.42, 16);
    const dhotiMesh = new THREE.Mesh(dhotiGeo, this.royalSilkMaterial);
    dhotiMesh.position.set(0, 0.12, 0);
    dhotiMesh.castShadow = true;
    ganeshaGroup.add(dhotiMesh);

    // Gold Embroidered Dhoti Pleats
    const pleatsGeo = new THREE.BoxGeometry(0.24, 0.42, 0.15);
    const pleatsMesh = new THREE.Mesh(pleatsGeo, this.shinyGoldMaterial);
    pleatsMesh.position.set(0, 0.1, -0.46);
    ganeshaGroup.add(pleatsMesh);

    // Golden Waist Belt (Kamarband) with Dangling Jewels
    const beltGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 24);
    beltGeo.rotateX(Math.PI / 2);
    const beltMesh = new THREE.Mesh(beltGeo, this.shinyGoldMaterial);
    beltMesh.position.set(0, 0.3, 0);
    ganeshaGroup.add(beltMesh);

    // Torso (Lambodara - Chubby Divine Golden-Amber Belly)
    const bellyGeo = new THREE.SphereGeometry(0.48, 16, 16);
    bellyGeo.scale(1.05, 1.0, 0.95);
    const bellyMesh = new THREE.Mesh(bellyGeo, this.ganeshaSkinMaterial);
    bellyMesh.position.set(0, 0.6, -0.02);
    bellyMesh.castShadow = true;
    ganeshaGroup.add(bellyMesh);

    // Royal Purple Silk Angavastram (Shoulder Sash)
    const sashCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0.85, -0.1),
      new THREE.Vector3(-0.1, 0.75, -0.32),
      new THREE.Vector3(0.3, 0.55, -0.2),
      new THREE.Vector3(0.42, 0.4, 0.1),
    ]);
    const sashGeo = new THREE.TubeGeometry(sashCurve, 12, 0.07, 8, false);
    const sashMesh = new THREE.Mesh(sashGeo, this.royalSilkMaterial);
    ganeshaGroup.add(sashMesh);

    // Sacred Thread (Yajnopavita) across Chest
    const threadGeo = new THREE.TorusGeometry(0.44, 0.02, 6, 24);
    threadGeo.rotateX(Math.PI / 3);
    threadGeo.rotateZ(Math.PI / 4);
    const threadMesh = new THREE.Mesh(threadGeo, this.shinyGoldMaterial);
    threadMesh.position.set(0, 0.65, 0);
    ganeshaGroup.add(threadMesh);

    // Layered Golden Necklaces (Kanthi)
    const necklaceGeo = new THREE.TorusGeometry(0.36, 0.045, 8, 20);
    necklaceGeo.rotateX(Math.PI / 2);
    const necklaceMesh = new THREE.Mesh(necklaceGeo, this.shinyGoldMaterial);
    necklaceMesh.position.set(0, 0.9, -0.05);

    const innerNecklaceGeo = new THREE.TorusGeometry(0.28, 0.035, 8, 18);
    innerNecklaceGeo.rotateX(Math.PI / 2);
    const innerNecklace = new THREE.Mesh(innerNecklaceGeo, this.goldMaterial);
    innerNecklace.position.set(0, 0.95, -0.08);
    ganeshaGroup.add(necklaceMesh, innerNecklace);

    // Elephant Head
    const headBaseGeo = new THREE.SphereGeometry(0.38, 16, 16);
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
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 16, 0.11, 10, false);
    const trunkMesh = new THREE.Mesh(trunkGeo, this.ganeshaSkinMaterial);
    trunkMesh.castShadow = true;

    // Golden trunk tip ring
    const trunkRingGeo = new THREE.TorusGeometry(0.1, 0.025, 6, 12);
    const trunkRing = new THREE.Mesh(trunkRingGeo, this.shinyGoldMaterial);
    trunkRing.position.set(0.2, 0.77, -0.48);
    ganeshaGroup.add(trunkMesh, trunkRing);

    // Sacred Red Tilak & Golden Trishul on Forehead
    const tilakGeo = new THREE.BoxGeometry(0.08, 0.16, 0.02);
    const tilakMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
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

    // Flapping Divine Elephant Ears with Intricate Golden Kundala Earrings
    const leftEarGroup = new THREE.Group();
    const rightEarGroup = new THREE.Group();

    const earGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.04, 16);
    earGeo.rotateZ(Math.PI / 2);

    const leftEarMesh = new THREE.Mesh(earGeo, this.ganeshaSkinMaterial);
    leftEarMesh.position.set(-0.46, 1.25, -0.06);
    leftEarMesh.rotation.y = -0.25;
    leftEarGroup.add(leftEarMesh);

    const earringGeo = new THREE.TorusGeometry(0.08, 0.02, 6, 16);
    const leftEarring = new THREE.Mesh(earringGeo, this.shinyGoldMaterial);
    leftEarring.position.set(-0.48, 1.02, -0.06);
    leftEarGroup.add(leftEarring);

    const rightEarMesh = new THREE.Mesh(earGeo, this.ganeshaSkinMaterial);
    rightEarMesh.position.set(0.46, 1.25, -0.06);
    rightEarMesh.rotation.y = 0.25;
    rightEarGroup.add(rightEarMesh);

    const rightEarring = new THREE.Mesh(earringGeo, this.shinyGoldMaterial);
    rightEarring.position.set(0.48, 1.02, -0.06);
    rightEarGroup.add(rightEarring);

    ganeshaGroup.add(leftEarGroup, rightEarGroup);
    ears.push(leftEarGroup, rightEarGroup);

    // 4 Divine Arms with Golden Armlets (Bajubands) & Bangles (Kadas)
    this.attachGaneshaArms(ganeshaGroup);

    // Magnificent Tiered Golden Mukut (Crown) with Jewels
    const mukutGroup = this.createMagnificentMukut();
    mukutGroup.position.set(0, 1.55, -0.06);
    ganeshaGroup.add(mukutGroup);

    // Radiant Sun Halo Aura (Prabhavali)
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

    return {
      root,
      characterRotator,
      legs,
      tail: tailGroup,
      auraInner,
      auraOuter,
      ears,
    };
  }

  // Arms and sacred items
  private attachGaneshaArms(parent: THREE.Group) {
    const armGeo = new THREE.CapsuleGeometry(0.08, 0.28, 6, 8);

    // Upper Right Arm (Holding Parashu Axe)
    const upRightArm = new THREE.Mesh(armGeo, this.ganeshaSkinMaterial);
    upRightArm.position.set(0.48, 0.92, 0.05);
    upRightArm.rotation.z = -0.6;
    upRightArm.rotation.x = -0.3;

    const axe = this.createSacredAxe();
    axe.position.set(0, 0.22, 0);
    upRightArm.add(axe);

    // Upper Left Arm (Holding Pasha Noose)
    const upLeftArm = new THREE.Mesh(armGeo, this.ganeshaSkinMaterial);
    upLeftArm.position.set(-0.48, 0.92, 0.05);
    upLeftArm.rotation.z = 0.6;
    upLeftArm.rotation.x = -0.3;

    const noose = this.createNoose();
    noose.position.set(0, 0.22, 0);
    upLeftArm.add(noose);

    // Lower Left Arm (Holding Golden Modak in Palm)
    const lowLeftArm = new THREE.Mesh(armGeo, this.ganeshaSkinMaterial);
    lowLeftArm.position.set(-0.42, 0.65, -0.18);
    lowLeftArm.rotation.z = 0.4;
    lowLeftArm.rotation.x = 0.5;

    const palmModak = this.createMiniModak();
    palmModak.position.set(0, 0.2, 0.05);
    lowLeftArm.add(palmModak);

    // Lower Right Arm (Abhaya Mudra - Blessing & Protection)
    const lowRightArm = new THREE.Mesh(armGeo, this.ganeshaSkinMaterial);
    lowRightArm.position.set(0.42, 0.65, -0.18);
    lowRightArm.rotation.z = -0.4;
    lowRightArm.rotation.x = -0.3;

    // Golden Armlets (Bajubands)
    [upRightArm, upLeftArm, lowLeftArm, lowRightArm].forEach((arm) => {
      const armletGeo = new THREE.TorusGeometry(0.09, 0.02, 6, 12);
      const armlet = new THREE.Mesh(armletGeo, this.shinyGoldMaterial);
      armlet.position.set(0, 0.05, 0);
      arm.add(armlet);
    });

    parent.add(upRightArm, upLeftArm, lowLeftArm, lowRightArm);
  }

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

  private createSacredAxe(): THREE.Group {
    const group = new THREE.Group();
    const handleGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.45, 8);
    const handle = new THREE.Mesh(handleGeo, this.shinyGoldMaterial);

    const bladeGeo = new THREE.BoxGeometry(0.14, 0.18, 0.03);
    const blade = new THREE.Mesh(bladeGeo, this.goldMaterial);
    blade.position.set(0.08, 0.16, 0);
    group.add(handle, blade);
    group.scale.set(0.8, 0.8, 0.8);
    return group;
  }

  private createNoose(): THREE.Group {
    const group = new THREE.Group();
    const loopGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 16);
    const loop = new THREE.Mesh(loopGeo, this.shinyGoldMaterial);
    group.add(loop);
    return group;
  }

  private createMiniModak(): THREE.Mesh {
    const geo = new THREE.ConeGeometry(0.08, 0.14, 12);
    return new THREE.Mesh(geo, this.shinyGoldMaterial);
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
  // 5. GREY STONE ROAD WITH CARVED MANDALA PATTERNS IN CENTER OF LANES
  // =========================================================================
  public createRoadSegment(length: number): THREE.Group {
    const segment = new THREE.Group();

    // 1. Grey Stone Paved Road Surface
    const roadMesh = new THREE.Mesh(this.roadPlaneGeo, this.greyStoneRoadMaterial);
    segment.add(roadMesh);

    // 2. Brass Inlay Lane Dividers for the 3 Lanes
    [-LANE_WIDTH / 2 - 0.1, LANE_WIDTH / 2 + 0.1].forEach((lx) => {
      const lineMesh = new THREE.Mesh(this.roadLineGeo, this.goldMaterial);
      lineMesh.position.set(lx, 0.015, 0);
      segment.add(lineMesh);
    });

    // 3. Intricate Carved Mandala Relief Patterns in the Center of Lanes
    // Placed in each of the 3 lanes (Left: -2.4, Center: 0, Right: +2.4)
    // spaced along the stone road!
    const mandalaStep = 12.5;

    for (let pz = -length / 2 + 6; pz <= length / 2 - 6; pz += mandalaStep) {
      // Center Lane Grand Carved Mandala
      const centerMandala = new THREE.Mesh(this.mandalaDecalGeo, this.carvedMandalaMaterial);
      centerMandala.position.set(0, 0.018, pz);
      segment.add(centerMandala);

      // Left & Right Lane Mandalas (Staggered by 6 meters)
      const staggeredZ = pz + 6 <= length / 2 - 6 ? pz + 6 : pz - 6;
      [-LANE_WIDTH, LANE_WIDTH].forEach((lx) => {
        const laneMandala = new THREE.Mesh(this.mandalaDecalGeo, this.carvedMandalaMaterial);
        laneMandala.position.set(lx, 0.018, staggeredZ);
        segment.add(laneMandala);
      });
    }

    // 4. Side Grey Stone Curbs
    const roadWidth = 8.6;
    const leftCurb = new THREE.Mesh(this.roadCurbGeo, this.carvedPillarMaterial);
    leftCurb.position.set(-roadWidth / 2 - 0.32, 0.16, 0);
    const rightCurb = new THREE.Mesh(this.roadCurbGeo, this.carvedPillarMaterial);
    rightCurb.position.set(roadWidth / 2 + 0.32, 0.16, 0);
    segment.add(leftCurb, rightCurb);

    // 5. Ancient Stone Pillars and Lit Diyas along the Curbs (Clean, optimized spacing)
    const lampStep = 20;
    for (let pz = -length / 2 + 10; pz <= length / 2 - 10; pz += lampStep) {
      const isPillar = (Math.abs(Math.round(pz / lampStep)) % 2) === 0;

      [-roadWidth / 2 - 0.8, roadWidth / 2 + 0.8].forEach((px) => {
        if (isPillar) {
          const pillar = this.createRoadsidePillar();
          pillar.position.set(px, 0.16, pz);
          segment.add(pillar);
        } else {
          const diyaPost = this.createGlowingDiyaPost();
          diyaPost.position.set(px, 0.16, pz);
          segment.add(diyaPost);
        }

        const poolMesh = new THREE.Mesh(this.diyaLightPoolGeo, this.diyaLightPoolMat);
        const roadInwardOffset = px < 0 ? 0.7 : -0.7;
        poolMesh.position.set(px + roadInwardOffset, 0.02, pz);
        segment.add(poolMesh);
      });
    }

    // Occasional decorative wooden cart parked by the roadside
    const roadsideCart = this.createRoadsideDecorativeCart();
    roadsideCart.position.set(-roadWidth / 2 - 1.8, 0, -length / 4);
    segment.add(roadsideCart);

    return segment;
  }

  // Decorative roadside stone pillar without obstacle collision
  private createRoadsidePillar(): THREE.Group {
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

  private createRoadsideDecorativeCart(): THREE.Group {
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
  // 6. EARLY MORNING DAWN SKY WITH MASSIVE HORIZON SUN, CREPUSCULAR GOD RAYS & TEMPLE SILHOUETTES
  // =========================================================================
  public createMorningDawnSky(): THREE.Group {
    const skyGroup = new THREE.Group();

    // 1. Sky Dome with Smooth Peach, Pink & Gold Dawn Gradient
    const skyGeo = new THREE.SphereGeometry(350, 32, 22);
    const skyMat = new THREE.MeshBasicMaterial({
      map: ThreeModelBuilder.cachedDawnSkyTexture,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyGroup.add(skyMesh);

    // 2. MASSIVE, BRIGHT GOLDEN-ORANGE SUN DIRECTLY ON FORWARD HORIZON
    const sunZ = -340;
    const sunY = 16;
    const sunGroup = new THREE.Group();
    sunGroup.position.set(0, sunY, sunZ);

    // Sun Luminous Core (White-hot golden center)
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

    // 3. DISTINCT CREPUSCULAR RAYS (GOD RAYS) BEAMING TOWARD THE CAMERA
    // Volumetric fan of radiant light shafts radiating from horizon sun toward camera down road corridor
    const godRaysGroup = new THREE.Group();
    godRaysGroup.name = 'CREPUSCULAR_GOD_RAYS';

    const rayCount = 14;
    for (let i = 0; i < rayCount; i++) {
      const angleProgress = (i / (rayCount - 1)) - 0.5; // -0.5 to +0.5 spread
      const fanAngle = angleProgress * 1.35; // Broad angular fan across sky and road

      // Angled volumetric ray plane extending from sun (z=-340) forward toward camera (z=20)
      const rayLength = 360;
      const rayWidthEnd = 38 + Math.abs(angleProgress) * 25;

      const rayGeo = new THREE.PlaneGeometry(rayWidthEnd, rayLength, 1, 4);
      // Anchor top to sun center
      rayGeo.translate(0, -rayLength / 2, 0);

      const rayMesh = new THREE.Mesh(rayGeo, this.godRayMat);
      rayMesh.position.set(0, sunY + 4, sunZ + 2);

      // Rotate fan outward from sun and tilted forward down along the road corridor
      rayMesh.rotation.z = fanAngle;
      rayMesh.rotation.x = -Math.PI / 2.35 + Math.abs(angleProgress) * 0.15;

      // Unique subtle oscillation data
      rayMesh.userData = {
        baseOpacity: 0.28 + (Math.sin(i * 1.7) * 0.1),
        speed: 0.6 + (i % 3) * 0.25,
        phase: i * 0.8,
      };

      godRaysGroup.add(rayMesh);
    }
    skyGroup.add(godRaysGroup);

    // 4. DISTANT SOUTH INDIAN TEMPLE SILHOUETTES ON HORIZON
    const templeGroup = this.createDistantTempleSilhouettes(sunZ + 10);
    skyGroup.add(templeGroup);

    return skyGroup;
  }

  // Helper to build majestic Dravidian Gopuram (Temple Gateway) silhouettes
  private createDistantTempleSilhouettes(horizonZ: number): THREE.Group {
    const group = new THREE.Group();

    const templePositions = [
      // Left Side Temple Skyline
      { x: -55, scale: 1.4, height: 62 },
      { x: -95, scale: 1.1, height: 48 },
      { x: -145, scale: 1.7, height: 75 },
      { x: -210, scale: 1.3, height: 55 },
      // Right Side Temple Skyline
      { x: 55, scale: 1.3, height: 58 },
      { x: 105, scale: 1.6, height: 72 },
      { x: 160, scale: 1.2, height: 52 },
      { x: 220, scale: 1.5, height: 65 },
    ];

    templePositions.forEach((pos) => {
      const gopuram = this.createDravidianGopuram(pos.height, pos.scale);
      gopuram.position.set(pos.x, 0, horizonZ);
      group.add(gopuram);
    });

    return group;
  }

  // Procedural multi-tiered Dravidian Gopuram pyramid silhouette
  private createDravidianGopuram(totalHeight: number, scale: number): THREE.Group {
    const temple = new THREE.Group();
    const tiers = 6;
    const tierHeight = (totalHeight * 0.75) / tiers;
    let currentWidth = 26 * scale;
    let currentY = 0;

    // Stepped Pyramidal Talas (Levels)
    for (let t = 0; t < tiers; t++) {
      const w = currentWidth * (1.0 - (t / tiers) * 0.62);
      const tierGeo = new THREE.BoxGeometry(w, tierHeight, 8 * scale);
      const tierMesh = new THREE.Mesh(tierGeo, this.templeSilhouetteMat);
      tierMesh.position.y = currentY + tierHeight / 2;
      temple.add(tierMesh);

      // Cornice ledge projection
      const ledgeGeo = new THREE.BoxGeometry(w * 1.08, tierHeight * 0.22, 9 * scale);
      const ledgeMesh = new THREE.Mesh(ledgeGeo, this.templeSilhouetteMat);
      ledgeMesh.position.y = currentY + tierHeight;
      temple.add(ledgeMesh);

      currentY += tierHeight;
    }

    // Barrel-Vaulted Shala Crown Roof (Gopuram Top)
    const roofWidth = currentWidth * 0.42;
    const roofHeight = totalHeight * 0.16;
    const roofGeo = new THREE.CylinderGeometry(roofWidth * 0.5, roofWidth * 0.5, 7 * scale, 12, 1, false, 0, Math.PI);
    roofGeo.rotateZ(Math.PI / 2);
    roofGeo.rotateY(Math.PI / 2);
    const roofMesh = new THREE.Mesh(roofGeo, this.templeSilhouetteMat);
    roofMesh.position.y = currentY + roofHeight * 0.4;
    temple.add(roofMesh);

    // Row of Golden Kalashas (Pinnacle Spires) atop the ridge
    const kalashaCount = 5;
    for (let k = 0; k < kalashaCount; k++) {
      const u = (k / (kalashaCount - 1)) - 0.5;
      const kx = u * (roofWidth * 0.75);

      const kalashaGeo = new THREE.ConeGeometry(0.8 * scale, 3.2 * scale, 8);
      const kalashaMat = new THREE.MeshBasicMaterial({ color: 0xfde047, depthWrite: false });
      const kalasha = new THREE.Mesh(kalashaGeo, kalashaMat);
      kalasha.position.set(kx, currentY + roofHeight + 1.2 * scale, 0);
      temple.add(kalasha);
    }

    return temple;
  }

  // Alias for backward compatibility
  public createCelestialSky(): THREE.Group {
    return this.createMorningDawnSky();
  }
}
