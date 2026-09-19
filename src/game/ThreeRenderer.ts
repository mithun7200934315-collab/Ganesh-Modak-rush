import * as THREE from 'three';
import { ThreeModelBuilder } from './ThreeModelBuilder';
import type { Player3D, Collectible3D, Obstacle3D, GameState, ObstacleType, CollectibleType } from '../types/game';
import { ROAD_SEGMENT_LENGTH, VISIBLE_ROAD_SEGMENTS, GAME_CONFIG } from './constants';

export class ThreeRenderer {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private modelBuilder: ThreeModelBuilder;

  // Character Mesh References
  private playerRoot: THREE.Group | null = null;
  private characterRotator: THREE.Group | null = null;
  private playerLegs: THREE.Mesh[] = [];
  private playerTail: THREE.Group | null = null;
  private playerAuraInner: THREE.Mesh | null = null;
  private playerAuraOuter: THREE.Mesh | null = null;
  private playerEars: THREE.Group[] = [];
  private ganeshaGroup: THREE.Group | null = null;
  private mooshikaGroup: THREE.Group | null = null;
  private tassels: THREE.Group[] = [];
  private hairGroup: THREE.Group | null = null;
  private dustParticles: { mesh: THREE.Mesh; active: boolean; life: number; maxLife: number; vx: number; vy: number; vz: number }[] = [];
  private dustTimer: number = 0;

  // Environment & Road
  private skyGroup: THREE.Group | null = null;
  private cavernSkyGroup: THREE.Group | null = null;
  private farMountainGroup: THREE.Group | null = null;
  private midTreeLineGroup: THREE.Group | null = null;
  private roadSegments: THREE.Group[] = [];
  private diyaFlames: THREE.Mesh[] = [];

  // Level System State
  private currentLevel: number = 1;
  private targetFogColor: THREE.Color = new THREE.Color(0xc7d2fe);
  private currentFogColor: THREE.Color = new THREE.Color(0xc7d2fe);
  private minecartGroup: THREE.Group | null = null;
  private minecartWheels: THREE.Mesh[] = [];

  // Ambient Falling Leaves (Task 1: Foreground / Ambience)
  private leafGeo!: THREE.BufferGeometry;
  private leafMat!: THREE.PointsMaterial;
  private leafPoints!: THREE.Points;
  private leafPositions!: Float32Array;
  private leafCount: number = 45;

  // Object Pooling for Collectibles & Obstacles
  private modakPool: THREE.Group[] = [];
  private megaLaddooPool: THREE.Group[] = [];
  private barricadePool: THREE.Group[] = [];
  private pillarPool: THREE.Group[] = [];
  private cartPool: THREE.Group[] = [];

  private activeCollectibles: Map<string, { mesh: THREE.Group; type: CollectibleType }> = new Map();
  private activeObstacles: Map<string, { mesh: THREE.Group; type: ObstacleType }> = new Map();

  // Reusable sets to eliminate GC pressure
  private reusableCollectibleIds: Set<string> = new Set();
  private reusableObstacleIds: Set<string> = new Set();

  // Contact shadow blob decal under player
  private godRaysGroup: THREE.Group | null = null;
  private playerShadowMesh!: THREE.Mesh;
  private playerShadowMat!: THREE.MeshBasicMaterial;
  private playerShadowTexture!: THREE.CanvasTexture;
  private lastPlayerZ: number = 0;

  // Ambient Stardust Particles
  private particleGeo!: THREE.BufferGeometry;
  private particleMat!: THREE.PointsMaterial;
  private particlePoints!: THREE.Points;
  private particlePositions!: Float32Array;
  private particleCount: number = 120;

  // Pre-allocated Particle Pool for Pickup Bursts
  private burstParticlePool: {
    mesh: THREE.Mesh;
    vx: number;
    vy: number;
    vz: number;
    life: number;
    active: boolean;
  }[] = [];
  private burstGeo!: THREE.SphereGeometry;
  private burstMatGold!: THREE.MeshBasicMaterial;
  private burstMatSaffron!: THREE.MeshBasicMaterial;

  // Lighting
  private dirLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;
  private playerPointLight!: THREE.PointLight;

  // Resize debouncing
  private resizeFrameId: number | null = null;

  constructor(_container: HTMLDivElement, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.modelBuilder = new ThreeModelBuilder();

    // 1. Scene & Mountain Atmosphere Fog (Task 1 & Task 3)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xc7d2fe, GAME_CONFIG.FOREST_DENSITY.FOG_DENSITY);

    // 2. Third-Person Straight-Behind Follow Camera looking down 3-lane road
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 900);
    this.camera.position.set(0, 3.8, 7.5);
    this.camera.lookAt(0, 1.6, -20);

    // 3. WebGL Renderer - Optimized for 60+ FPS high-performance rendering
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height, false);
    // Clamp pixelRatio to 1.25 to prevent 4K fill-rate choking while keeping visuals sharp
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    // Disable heavy shadow map pass (replaced by GPU-efficient soft contact shadow blob)
    this.renderer.shadowMap.enabled = false;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.32;

    // 4. Setup Lighting, Sky, Road, Character, Particles & Object Pools
    this.setupLighting();
    this.setupSky();
    this.setupRoad();
    this.setupPlayer();
    this.setupAmbientParticles();
    this.setupBurstParticlePool();
    this.prepopulatePools();

    window.addEventListener('resize', this.onWindowResize);
  }

  private setupLighting() {
    // Warm Peach & Golden Dawn Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffedd5, 1.15);
    this.scene.add(this.ambientLight);

    // Early Morning Sun Directional Light (beaming from forward horizon toward camera)
    this.dirLight = new THREE.DirectionalLight(0xfef08a, 1.65);
    this.dirLight.position.set(0, 18, -45);
    this.dirLight.castShadow = false;
    this.scene.add(this.dirLight);
    this.scene.add(this.dirLight.target);

    // Subtle Rose/Gold Rim Light for Divine Character Silhouette
    const rimLight = new THREE.DirectionalLight(0xf472b6, 0.75);
    rimLight.position.set(0, 16, 20);
    this.scene.add(rimLight);

    // Warm Golden Lantern PointLight following the player for road illumination
    this.playerPointLight = new THREE.PointLight(0xfbbf24, 1.9, 14);
    this.playerPointLight.position.set(0, 2.5, 0);
    this.scene.add(this.playerPointLight);
  }

  private setupSky() {
    this.skyGroup = this.modelBuilder.createMorningDawnSky();
    this.godRaysGroup = this.skyGroup.getObjectByName('CREPUSCULAR_GOD_RAYS') as THREE.Group | null;
    this.farMountainGroup = this.skyGroup.getObjectByName('FAR_MOUNTAIN_SILHOUETTES') as THREE.Group | null;
    this.midTreeLineGroup = this.skyGroup.getObjectByName('MID_TREELINE_RIDGE') as THREE.Group | null;
    this.scene.add(this.skyGroup);

    // Subterranean Cavern Sky / Ceiling (Level 2)
    this.cavernSkyGroup = this.modelBuilder.createUndergroundCavernSky();
    this.cavernSkyGroup.visible = false;
    this.scene.add(this.cavernSkyGroup);
  }

  public resetRoad(playerZ: number = 0) {
    const isLevel2 = this.currentLevel >= 2;
    for (let i = 0; i < this.roadSegments.length; i++) {
      // Offset by 1 segment behind so road extends behind camera
      const z = playerZ + ROAD_SEGMENT_LENGTH - (i * ROAD_SEGMENT_LENGTH);
      this.roadSegments[i].position.set(0, 0, z);

      if (this.roadSegments[i].userData.level1Group) {
        this.roadSegments[i].userData.level1Group.visible = !isLevel2;
      }
      if (this.roadSegments[i].userData.level2Group) {
        this.roadSegments[i].userData.level2Group.visible = isLevel2;
      }
    }
  }

  private setupRoad() {
    for (let i = 0; i < VISIBLE_ROAD_SEGMENTS; i++) {
      const segment = this.modelBuilder.createRoadSegment(ROAD_SEGMENT_LENGTH);
      // Start with 1 segment behind player (z = +50) so there is continuous road behind and beneath at the start
      const z = ROAD_SEGMENT_LENGTH - (i * ROAD_SEGMENT_LENGTH);
      segment.position.set(0, 0, z);
      this.scene.add(segment);
      this.roadSegments.push(segment);

      // Collect diya & torch flame meshes for flickering animation
      segment.traverse((child) => {
        if (child.name === 'DIYA_FLAME' && child instanceof THREE.Mesh) {
          this.diyaFlames.push(child);
        }
      });
    }
  }

  private createSoftShadowTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 2, 32, 32, 31);
    gradient.addColorStop(0, 'rgba(15, 7, 24, 0.7)');
    gradient.addColorStop(0.45, 'rgba(15, 7, 24, 0.35)');
    gradient.addColorStop(1, 'rgba(15, 7, 24, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  private setupPlayer() {
    const char = this.modelBuilder.createPlayerCharacter();
    this.playerRoot = char.root;
    this.characterRotator = char.characterRotator;
    this.playerLegs = char.legs;
    this.playerTail = char.tail;
    this.playerAuraInner = char.auraInner;
    this.playerAuraOuter = char.auraOuter;
    this.playerEars = char.ears;
    this.ganeshaGroup = char.ganeshaGroup;
    this.mooshikaGroup = char.mooshikaGroup;
    this.tassels = char.tassels;
    this.hairGroup = char.hairGroup;
    this.minecartGroup = char.minecartGroup;
    this.minecartWheels = char.minecartWheels;
    this.scene.add(this.playerRoot);

    // Soft grounded contact shadow under Mooshika and Lord Ganesha (0 extra draw passes)
    this.playerShadowTexture = this.createSoftShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(2.0, 2.4);
    shadowGeo.rotateX(-Math.PI / 2);
    this.playerShadowMat = new THREE.MeshBasicMaterial({
      map: this.playerShadowTexture,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    });
    this.playerShadowMesh = new THREE.Mesh(shadowGeo, this.playerShadowMat);
    this.playerShadowMesh.position.set(0, 0.025, 0);
    this.scene.add(this.playerShadowMesh);
  }

  private setupAmbientParticles() {
    // 1. Ambient Stardust Sparkles
    this.particlePositions = new Float32Array(this.particleCount * 3);
    for (let i = 0; i < this.particleCount; i++) {
      this.particlePositions[i * 3] = (Math.random() - 0.5) * 32;     // X
      this.particlePositions[i * 3 + 1] = Math.random() * 12 + 0.5;   // Y
      this.particlePositions[i * 3 + 2] = -Math.random() * 140;       // Z
    }

    this.particleGeo = new THREE.BufferGeometry();
    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    this.particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.32,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    this.particlePoints = new THREE.Points(this.particleGeo, this.particleMat);
    this.scene.add(this.particlePoints);

    // 2. Ambient Falling Leaves (Task 1: Foreground & Forest Ambience)
    this.leafPositions = new Float32Array(this.leafCount * 3);
    for (let i = 0; i < this.leafCount; i++) {
      this.leafPositions[i * 3] = (Math.random() - 0.5) * 24;      // X
      this.leafPositions[i * 3 + 1] = Math.random() * 8 + 1.0;    // Y
      this.leafPositions[i * 3 + 2] = -Math.random() * 90;        // Z
    }

    this.leafGeo = new THREE.BufferGeometry();
    this.leafGeo.setAttribute('position', new THREE.BufferAttribute(this.leafPositions, 3));

    this.leafMat = new THREE.PointsMaterial({
      color: 0xeab308, // Golden-amber autumn forest leaves
      size: 0.45,
      transparent: true,
      opacity: 0.82,
    });

    this.leafPoints = new THREE.Points(this.leafGeo, this.leafMat);
    this.scene.add(this.leafPoints);

    // 3. Running Dust Puff Particles from Mushika's Paws (Task 1)
    const dustGeo = new THREE.SphereGeometry(0.09, 6, 6);
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0x8a725d,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    for (let i = 0; i < 25; i++) {
      const mesh = new THREE.Mesh(dustGeo, dustMat.clone());
      mesh.visible = false;
      this.scene.add(mesh);
      this.dustParticles.push({
        mesh,
        active: false,
        life: 0,
        maxLife: 0.35,
        vx: 0,
        vy: 0,
        vz: 0,
      });
    }
  }

  private spawnDustPuff(x: number, y: number, z: number) {
    for (let i = 0; i < this.dustParticles.length; i++) {
      const d = this.dustParticles[i];
      if (!d.active) {
        d.active = true;
        d.life = 0.35;
        d.maxLife = 0.35;
        d.mesh.position.set(x, y, z);
        d.mesh.scale.set(0.6, 0.6, 0.6);
        d.mesh.visible = true;
        d.vx = (Math.random() - 0.5) * 0.8;
        d.vy = Math.random() * 0.8 + 0.3;
        d.vz = Math.random() * 0.8 + 0.4;
        break;
      }
    }
  }

  private setupBurstParticlePool() {
    this.burstGeo = new THREE.SphereGeometry(0.14, 6, 6);
    this.burstMatGold = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 1.0 });
    this.burstMatSaffron = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 1.0 });

    for (let i = 0; i < 80; i++) {
      const mat = i % 2 === 0 ? this.burstMatGold : this.burstMatSaffron;
      const mesh = new THREE.Mesh(this.burstGeo, mat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.burstParticlePool.push({
        mesh,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        active: false,
      });
    }
  }

  private prepopulatePools() {
    // 1. Regular Modaks
    for (let i = 0; i < 22; i++) {
      const modak = this.modelBuilder.createModakMesh();
      modak.visible = false;
      this.scene.add(modak);
      this.modakPool.push(modak);
    }

    // 2. Mega Laddoos
    for (let i = 0; i < 4; i++) {
      const laddoo = this.modelBuilder.createMegaLaddooMesh();
      laddoo.visible = false;
      this.scene.add(laddoo);
      this.megaLaddooPool.push(laddoo);
    }

    // 3. Obstacles
    for (let i = 0; i < 8; i++) {
      const pil = this.modelBuilder.createStonePillar();
      pil.visible = false;
      this.scene.add(pil);
      this.pillarPool.push(pil);

      const cart = this.modelBuilder.createWoodenCart();
      cart.visible = false;
      this.scene.add(cart);
      this.cartPool.push(cart);

      const bar = this.modelBuilder.createFestiveBarricade();
      bar.visible = false;
      this.scene.add(bar);
      this.barricadePool.push(bar);
    }
  }

  // --- Object Pooling Helpers ---
  private getModakFromPool(): THREE.Group {
    const mesh = this.modakPool.pop() || this.modelBuilder.createModakMesh();
    mesh.visible = true;
    if (!mesh.parent) this.scene.add(mesh);
    return mesh;
  }

  private returnModakToPool(mesh: THREE.Group) {
    mesh.visible = false;
    this.modakPool.push(mesh);
  }

  private getMegaLaddooFromPool(): THREE.Group {
    const mesh = this.megaLaddooPool.pop() || this.modelBuilder.createMegaLaddooMesh();
    mesh.visible = true;
    if (!mesh.parent) this.scene.add(mesh);
    return mesh;
  }

  private returnMegaLaddooToPool(mesh: THREE.Group) {
    mesh.visible = false;
    this.megaLaddooPool.push(mesh);
  }

  private getObstacleFromPool(type: ObstacleType): THREE.Group {
    let pool: THREE.Group[];
    if (type === 'STONE_PILLAR') pool = this.pillarPool;
    else if (type === 'WOODEN_CART') pool = this.cartPool;
    else pool = this.barricadePool;

    let mesh = pool.pop();
    if (!mesh) {
      if (type === 'STONE_PILLAR') mesh = this.modelBuilder.createStonePillar();
      else if (type === 'WOODEN_CART') mesh = this.modelBuilder.createWoodenCart();
      else mesh = this.modelBuilder.createFestiveBarricade();
      this.scene.add(mesh);
    }
    mesh.visible = true;
    return mesh;
  }

  private returnObstacleToPool(mesh: THREE.Group, type: ObstacleType) {
    mesh.visible = false;
    if (type === 'STONE_PILLAR') this.pillarPool.push(mesh);
    else if (type === 'WOODEN_CART') this.cartPool.push(mesh);
    else this.barricadePool.push(mesh);
  }

  public onWindowResize = () => {
    if (this.resizeFrameId !== null) return;
    this.resizeFrameId = requestAnimationFrame(() => {
      this.resizeFrameId = null;
      if (!this.canvas || !this.renderer || !this.camera) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    });
  };

  // Particle Burst on Modak / Mega Laddoo Collection
  public spawnModakBurst(x: number, y: number, z: number, isMega: boolean = false) {
    const count = isMega ? 45 : 18;
    let spawned = 0;

    for (let i = 0; i < this.burstParticlePool.length && spawned < count; i++) {
      const p = this.burstParticlePool[i];
      if (!p.active) {
        p.active = true;
        p.life = isMega ? 0.9 : 0.6;
        p.mesh.position.set(x, y, z);
        const scale = isMega ? 1.6 : 1.0;
        p.mesh.scale.set(scale, scale, scale);
        p.mesh.visible = true;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isMega ? 9 : 6) + 2;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.random() * (isMega ? 8 : 5) + 3;
        p.vz = Math.sin(angle) * speed;

        spawned++;
      }
    }
  }

  // Golden Light Burst on Ganesha Transformation (Task 2)
  public spawnTransformationBurst(x: number, y: number, z: number) {
    const count = 55;
    let spawned = 0;

    for (let i = 0; i < this.burstParticlePool.length && spawned < count; i++) {
      const p = this.burstParticlePool[i];
      if (!p.active) {
        p.active = true;
        p.life = 0.85;
        p.mesh.position.set(x, y, z);
        const scale = 1.75;
        p.mesh.scale.set(scale, scale, scale);
        p.mesh.visible = true;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = Math.random() * 8 + 4;
        p.vx = Math.sin(phi) * Math.cos(theta) * speed;
        p.vy = Math.cos(phi) * speed + 2.5;
        p.vz = Math.sin(phi) * Math.sin(theta) * speed;

        spawned++;
      }
    }
  }

  // =========================================================================
  // MAIN RENDER LOOP (60+ FPS)
  // =========================================================================
  public render(
    _state: GameState,
    player: Player3D,
    collectibles: Collectible3D[],
    obstacles: Obstacle3D[],
    dt: number
  ) {
    const time = performance.now() * 0.001;

    // 0. Auto-detect player position reset (new run or restart) and instantly reposition road
    if (player.z > this.lastPlayerZ + 10 || (player.z === 0 && this.lastPlayerZ < -5)) {
      this.resetRoad(player.z);
    }
    this.lastPlayerZ = player.z;

    // 0b. Level Transition Check (Level 1: Mountain Forest Trail, Level 2: Minecart Railway at 500+ pts)
    const isLevel2 = _state.level >= 2;
    if (this.currentLevel !== _state.level) {
      this.currentLevel = _state.level;
      if (isLevel2) {
        if (this.skyGroup) this.skyGroup.visible = false;
        if (this.cavernSkyGroup) this.cavernSkyGroup.visible = true;
        for (let i = 0; i < this.roadSegments.length; i++) {
          const seg = this.roadSegments[i];
          if (seg.userData.level1Group) seg.userData.level1Group.visible = false;
          if (seg.userData.level2Group) seg.userData.level2Group.visible = true;
        }
        if (this.minecartGroup) this.minecartGroup.visible = true;
        this.spawnTransformationBurst(player.x, player.y + 1.2, player.z - 2);
      } else {
        if (this.skyGroup) this.skyGroup.visible = true;
        if (this.cavernSkyGroup) this.cavernSkyGroup.visible = false;
        for (let i = 0; i < this.roadSegments.length; i++) {
          const seg = this.roadSegments[i];
          if (seg.userData.level1Group) seg.userData.level1Group.visible = true;
          if (seg.userData.level2Group) seg.userData.level2Group.visible = false;
        }
        if (this.minecartGroup) this.minecartGroup.visible = false;
      }
    }

    // 1. Update Player Position & 180° Character Rotator
    if (this.playerRoot) {
      this.playerRoot.position.set(player.x, player.y, player.z);
      this.playerRoot.rotation.z = -player.tiltAngle;

      // Contact shadow follows player ground position with jump modulation
      if (this.playerShadowMesh) {
        const jumpHeight = Math.max(0, player.y);
        this.playerShadowMesh.position.set(player.x, 0.025, player.z);
        const shadowSpread = 1.0 + jumpHeight * 0.25;
        this.playerShadowMesh.scale.set(shadowSpread, 1, shadowSpread);
        this.playerShadowMat.opacity = Math.max(0.08, 0.52 - jumpHeight * 0.15);
      }

      // Special 180° rotation: Lord Ganesha & Mooshika look directly into the camera
      if (this.characterRotator) {
        this.characterRotator.rotation.y = player.facingAngle;
      }

      const runCycle = player.runCycle;

      // Character & Minecart Animations
      if (isLevel2) {
        // --- LEVEL 2: RIDING IN MINECART ON RAILWAY TRACKS ---
        if (this.minecartGroup) {
          this.minecartGroup.visible = true;
        }

        // Spin flanged iron wheels with forward speed
        for (let w = 0; w < this.minecartWheels.length; w++) {
          this.minecartWheels[w].rotation.x = -runCycle * 1.5;
        }

        // Lord Ganesha seated comfortably inside the minecart
        if (this.ganeshaGroup) {
          this.ganeshaGroup.visible = true;
          if (player.state === 'SLIDING') {
            this.ganeshaGroup.position.set(0, 0.28, 0.12);
            this.ganeshaGroup.rotation.x = 0.35;
          } else if (player.state === 'JUMPING' || !player.isGrounded) {
            this.ganeshaGroup.position.set(0, 0.46, 0.12);
            this.ganeshaGroup.rotation.x = 0.1;
          } else {
            const rumble = Math.sin(runCycle * 4) * 0.02;
            this.ganeshaGroup.position.set(0, 0.44 + rumble, 0.12);
            this.ganeshaGroup.rotation.x = Math.sin(runCycle * 2) * 0.02;
          }
        }

        // Mushika seated inside front of minecart with paws on rim
        if (this.mooshikaGroup) {
          this.mooshikaGroup.visible = true;
          if (player.state === 'SLIDING') {
            this.mooshikaGroup.position.set(0, 0.2, -0.38);
            this.mooshikaGroup.scale.set(1.1, 0.65, 1.1);
          } else {
            const rumble = Math.cos(runCycle * 4) * 0.02;
            this.mooshikaGroup.position.set(0, 0.26 + rumble, -0.38);
            this.mooshikaGroup.scale.set(1, 1, 1);
          }
        }

        // Paws tucked safely inside minecart
        for (let l = 0; l < this.playerLegs.length; l++) {
          this.playerLegs[l].visible = false;
        }
      } else {
        // --- LEVEL 1: GALLOPING ON MOUNTAIN DIRT TRAIL ---
        if (this.minecartGroup) {
          this.minecartGroup.visible = false;
        }

        for (let l = 0; l < this.playerLegs.length; l++) {
          this.playerLegs[l].visible = true;
        }

        // Mooshika Gallop Legs
        if (this.playerLegs.length === 4) {
          if (player.state === 'JUMPING' || !player.isGrounded) {
            this.playerLegs[0].rotation.x = -0.4;
            this.playerLegs[1].rotation.x = -0.4;
            this.playerLegs[2].rotation.x = 0.55;
            this.playerLegs[3].rotation.x = 0.55;
          } else {
            this.playerLegs[0].rotation.x = Math.sin(runCycle) * 0.75;
            this.playerLegs[1].rotation.x = -Math.sin(runCycle) * 0.75;
            this.playerLegs[2].rotation.x = -Math.sin(runCycle) * 0.75;
            this.playerLegs[3].rotation.x = Math.sin(runCycle) * 0.75;
          }
        }

        if (this.ganeshaGroup) {
          this.ganeshaGroup.visible = true;
          if (player.state === 'SLIDING') {
            this.ganeshaGroup.position.y = 0.55;
            this.ganeshaGroup.rotation.x = 0.35;
          } else if (player.state === 'JUMPING' || !player.isGrounded) {
            this.ganeshaGroup.position.y = 0.88;
            this.ganeshaGroup.rotation.x = 0.12;
          } else {
            const bounce = Math.abs(Math.sin(runCycle * 2)) * 0.06 * GAME_CONFIG.PLAYER_CONFIG.BOUNCE_INTENSITY;
            this.ganeshaGroup.position.y = 0.88 + bounce * 0.7;
            this.ganeshaGroup.rotation.x = Math.sin(runCycle * 2) * 0.035;
          }
        }

        if (this.mooshikaGroup) {
          this.mooshikaGroup.visible = true;
          if (player.state === 'SLIDING') {
            this.mooshikaGroup.position.y = 0.22;
            this.mooshikaGroup.scale.set(1.15, 0.58, 1.15);
            this.mooshikaGroup.rotation.x = 0.1;
          } else if (player.state === 'JUMPING' || !player.isGrounded) {
            this.mooshikaGroup.position.y = 0.4;
            this.mooshikaGroup.scale.set(1, 1, 1);
            this.mooshikaGroup.rotation.x = -0.22;
          } else {
            const bounce = Math.abs(Math.sin(runCycle * 2)) * 0.06 * GAME_CONFIG.PLAYER_CONFIG.BOUNCE_INTENSITY;
            this.mooshikaGroup.position.y = 0.4 + bounce;
            this.mooshikaGroup.scale.set(1, 1, 1);
            this.mooshikaGroup.rotation.x = Math.sin(runCycle * 2) * 0.025;
          }
        }
      }

      // Swishing Tail Sway
      if (this.playerTail) {
        this.playerTail.rotation.y = Math.sin(runCycle * 0.85) * 0.35;
        this.playerTail.rotation.z = Math.cos(runCycle * 0.85) * 0.2;
      }

      // Lord Ganesha Ears Flapping (gentle, majestic)
      if (this.playerEars.length === 2) {
        const earFlap = Math.sin(runCycle * 0.7) * 0.16;
        this.playerEars[0].rotation.y = -0.25 + earFlap;
        this.playerEars[1].rotation.y = 0.25 - earFlap;
      }

      // Soft Shimmering Golden Aura
      const showAura = GAME_CONFIG.PLAYER_CONFIG.SHOW_AURA;
      if (this.playerAuraInner) {
        this.playerAuraInner.visible = showAura;
        if (showAura) {
          const pulse = 1.0 + Math.sin(time * 5) * 0.06;
          this.playerAuraInner.scale.set(pulse, pulse, 1);
        }
      }
      if (this.playerAuraOuter) {
        this.playerAuraOuter.visible = showAura;
        if (showAura) {
          const pulseOuter = 1.05 + Math.cos(time * 4) * 0.08;
          this.playerAuraOuter.scale.set(pulseOuter, pulseOuter, 1);
        }
      }

      // Saddle Tassels Swaying
      for (let t = 0; t < this.tassels.length; t++) {
        this.tassels[t].rotation.z = Math.sin(runCycle * 2 + t * 0.55) * 0.28 * GAME_CONFIG.PLAYER_CONFIG.SWAY_INTENSITY;
        this.tassels[t].rotation.x = Math.cos(runCycle * 2 + t * 0.4) * 0.15 * GAME_CONFIG.PLAYER_CONFIG.SWAY_INTENSITY;
      }

      // Long Dark Flowing Hair Swaying
      if (this.hairGroup) {
        this.hairGroup.rotation.x = -0.15 + Math.sin(runCycle * 2) * 0.12 * GAME_CONFIG.PLAYER_CONFIG.SWAY_INTENSITY;
        this.hairGroup.rotation.z = Math.cos(runCycle * 1.5) * 0.06 * GAME_CONFIG.PLAYER_CONFIG.SWAY_INTENSITY;
      }

      // Hurt / Stumble / Flash Effect
      if (player.state === 'STUMBLE' || player.invulnerableTimer > 0) {
        this.playerRoot.visible = Math.sin(time * 30) > 0;
        if (this.characterRotator) {
          this.characterRotator.position.x = Math.sin(time * 45) * 0.06;
        }
      } else {
        this.playerRoot.visible = true;
        if (this.characterRotator) {
          this.characterRotator.position.x = 0;
        }
      }

      // Running Dust Puffs Generation (only in Level 1 on dirt trail)
      if (!isLevel2 && GAME_CONFIG.PLAYER_CONFIG.DUST_EFFECTS && player.isGrounded && _state.mode === 'PLAYING') {
        this.dustTimer += dt;
        if (this.dustTimer >= 0.08) {
          this.dustTimer = 0;
          const pawSide = (Math.random() - 0.5) * 0.6;
          this.spawnDustPuff(player.x + pawSide, 0.05, player.z + 0.4);
        }
      }

      // Update Active Dust Particles
      for (let i = 0; i < this.dustParticles.length; i++) {
        const d = this.dustParticles[i];
        if (d.active) {
          d.life -= dt;
          if (d.life <= 0) {
            d.active = false;
            d.mesh.visible = false;
          } else {
            d.mesh.position.x += d.vx * dt;
            d.mesh.position.y += d.vy * dt;
            d.mesh.position.z += d.vz * dt;
            const progress = 1 - (d.life / d.maxLife);
            const s = 0.6 + progress * 0.8;
            d.mesh.scale.set(s, s, s);
            (d.mesh.material as THREE.MeshBasicMaterial).opacity = (d.life / d.maxLife) * 0.55;
          }
        }
      }

      // Warm divine player light follows character
      this.playerPointLight.color.setHex(0xfbbf24);
      this.playerPointLight.intensity = isLevel2 ? 2.5 : 2.2;
      this.playerPointLight.distance = 16;
      this.playerPointLight.position.set(player.x, player.y + 2.2, player.z - 0.5);
    }

    // 2. Straight-Behind Follow Camera looking down 3-lane road
    const targetCamX = player.x * 0.35;
    const targetCamY = player.y + 3.8;
    const targetCamZ = player.z + 7.5;

    this.camera.position.x += (targetCamX - this.camera.position.x) * Math.min(1, dt * 10);
    this.camera.position.y += (targetCamY - this.camera.position.y) * Math.min(1, dt * 8);
    this.camera.position.z = targetCamZ;

    // Look straight down the 3-lane road
    this.camera.lookAt(player.x * 0.15, player.y + 1.6, player.z - 20);

    // Keep morning sun directional light centered with player (beaming from forward horizon)
    this.dirLight.position.set(player.x, player.y + 18, player.z - 45);
    this.dirLight.target.position.set(player.x, player.y, player.z + 10);
    this.dirLight.target.updateMatrixWorld();

    // Sky follows forward progress with Parallax
    if (isLevel2) {
      if (this.cavernSkyGroup) {
        this.cavernSkyGroup.position.set(0, 0, player.z);
      }
    } else if (this.skyGroup) {
      this.skyGroup.position.set(0, 0, player.z);

      // Layer 1 Far Mountain Silhouettes lateral parallax shift
      if (this.farMountainGroup) {
        this.farMountainGroup.position.x = player.x * GAME_CONFIG.PARALLAX.FAR_MOUNTAINS;
      }

      // Layer 2 Mid-Distance Tree Line lateral parallax shift
      if (this.midTreeLineGroup) {
        this.midTreeLineGroup.position.x = player.x * GAME_CONFIG.PARALLAX.MID_TREES;
      }

      // Animate subtle shimmer & breath on crepuscular god rays
      if (this.godRaysGroup) {
        for (let r = 0; r < this.godRaysGroup.children.length; r++) {
          const child = this.godRaysGroup.children[r];
          if (child instanceof THREE.Mesh && child.userData) {
            const { baseOpacity, speed, phase } = child.userData;
            if (child.material instanceof THREE.MeshBasicMaterial) {
              child.material.opacity = Math.max(0.1, Math.min(0.6, baseOpacity + Math.sin(time * speed + phase) * 0.08));
            }
          }
        }
      }
    }

    // Dynamic Fog & Lighting Smooth Interpolation for Level 1 vs Level 2
    const targetFogHex = isLevel2 ? 0x0b0f19 : 0xc7d2fe;
    const targetFogDensity = isLevel2 ? 0.0055 : GAME_CONFIG.FOREST_DENSITY.FOG_DENSITY;
    this.targetFogColor.setHex(targetFogHex);
    this.currentFogColor.lerp(this.targetFogColor, Math.min(1, dt * 3.5));
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.copy(this.currentFogColor);
      this.scene.fog.density += (targetFogDensity - this.scene.fog.density) * Math.min(1, dt * 3.5);
    }

    const targetAmbientHex = isLevel2 ? 0x1e293b : 0xffedd5;
    const targetAmbientInt = isLevel2 ? 1.25 : 1.15;
    this.ambientLight.color.lerp(new THREE.Color(targetAmbientHex), Math.min(1, dt * 3.5));
    this.ambientLight.intensity += (targetAmbientInt - this.ambientLight.intensity) * Math.min(1, dt * 3.5);

    const targetDirHex = isLevel2 ? 0xfacc15 : 0xfef08a;
    const targetDirInt = isLevel2 ? 1.15 : 1.65;
    this.dirLight.color.lerp(new THREE.Color(targetDirHex), Math.min(1, dt * 3.5));
    this.dirLight.intensity += (targetDirInt - this.dirLight.intensity) * Math.min(1, dt * 3.5);

    // 3. Infinite Road Chunk Recycling
    for (let i = 0; i < this.roadSegments.length; i++) {
      const segment = this.roadSegments[i];
      if (segment.position.z > player.z + ROAD_SEGMENT_LENGTH * 1.5) {
        segment.position.z -= VISIBLE_ROAD_SEGMENTS * ROAD_SEGMENT_LENGTH;
      }

      // Foliage Wind Sway Animation (Task 1: gentle sway on foliage)
      for (let c = 0; c < segment.children.length; c++) {
        const child = segment.children[c];
        if (child.name === 'PINE_TREE' || child.name === 'MIXED_TREE') {
          const sway = Math.sin(time * 2.2 + i * 1.4 + child.position.x * 0.4) * 0.035;
          child.rotation.z = sway;
        }
      }
    }

    // 4. Animate Flickering Oil Lamp (Diya) Flames
    for (let i = 0; i < this.diyaFlames.length; i++) {
      const flame = this.diyaFlames[i];
      const flicker = 1.0 + Math.sin(time * 12 + i * 1.7) * 0.15;
      flame.scale.set(flicker, flicker * 1.1, flicker);
    }

    // 5. Update Collectibles (Regular Modaks & Rare Oversized Mega Modak)
    this.reusableCollectibleIds.clear();
    for (let i = 0; i < collectibles.length; i++) {
      const c = collectibles[i];
      if (c.collected) continue;
      this.reusableCollectibleIds.add(c.id);

      const isMega = c.type === 'MEGA_MODAK' || c.type === 'MEGA_LADDOO';

      let entry = this.activeCollectibles.get(c.id);
      if (!entry) {
        const mesh = isMega ? this.getMegaLaddooFromPool() : this.getModakFromPool();
        entry = { mesh, type: c.type };
        this.activeCollectibles.set(c.id, entry);
      }

      if (isMega) {
        // Mega Modak: Grand floating bob, intense golden aura pulse, halo rotation
        c.rotation += dt * 3.6;
        const bobY = 1.1 + Math.sin(time * 3.5 + c.bobOffset) * 0.22;
        entry.mesh.position.set(c.x, bobY, c.z);

        // Pulse intense golden particle aura
        const aura = entry.mesh.getObjectByName('MEGA_MODAK_AURA');
        if (aura) {
          const pulse = 1.0 + Math.sin(time * 6.5) * 0.12;
          aura.scale.set(pulse, pulse, pulse);
        }

        // Spin energy halo ring
        const ring = entry.mesh.getObjectByName('MEGA_MODAK_RING');
        if (ring) {
          ring.rotation.z = c.rotation;
        }

        // Pulse beacon beam
        const beacon = entry.mesh.getObjectByName('MEGA_MODAK_BEACON');
        if (beacon) {
          const beaconPulse = 1.0 + Math.sin(time * 5.0) * 0.16;
          beacon.scale.set(beaconPulse, 1.0, beaconPulse);
        }
      } else {
        // Regular Modak: Smooth floating bob & rotation
        c.rotation += dt * 3.2;
        const bobY = 0.85 + Math.sin(time * 4.0 + c.bobOffset) * 0.22;
        entry.mesh.position.set(c.x, bobY, c.z);
        entry.mesh.rotation.y = c.rotation;
      }
    }

    // Return despawned or collected items to pool
    for (const [id, entry] of this.activeCollectibles.entries()) {
      if (!this.reusableCollectibleIds.has(id)) {
        if (entry.type === 'MEGA_MODAK' || entry.type === 'MEGA_LADDOO') {
          this.returnMegaLaddooToPool(entry.mesh);
        } else {
          this.returnModakToPool(entry.mesh);
        }
        this.activeCollectibles.delete(id);
      }
    }

    // 6. Update Night-Themed Obstacles
    this.reusableObstacleIds.clear();
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      this.reusableObstacleIds.add(o.id);

      let entry = this.activeObstacles.get(o.id);
      if (!entry) {
        const mesh = this.getObstacleFromPool(o.type);
        entry = { mesh, type: o.type };
        this.activeObstacles.set(o.id, entry);
      }

      entry.mesh.position.set(o.x, o.y, o.z);
      entry.mesh.rotation.y = o.rotation;

      // Animate obstacle lantern flames for lively flickering (direct array access, zero traverse overhead)
      const flames: THREE.Mesh[] | undefined = entry.mesh.userData.flames;
      if (flames) {
        for (let f = 0; f < flames.length; f++) {
          const flFlicker = 1.0 + Math.sin(time * 14 + o.lane * 3 + f) * 0.16;
          flames[f].scale.set(flFlicker, flFlicker * 1.12, flFlicker);
        }
      }
    }

    // Return despawned obstacles to pool
    for (const [id, entry] of this.activeObstacles.entries()) {
      if (!this.reusableObstacleIds.has(id)) {
        this.returnObstacleToPool(entry.mesh, entry.type);
        this.activeObstacles.delete(id);
      }
    }

    // 7. Ambient Stardust Sparkles
    const positions = this.particlePositions;
    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3 + 1] -= dt * 0.8;
      positions[i * 3 + 2] += dt * 2.0;

      if (positions[i * 3 + 2] > player.z + 10) {
        positions[i * 3] = player.x + (Math.random() - 0.5) * 32;
        positions[i * 3 + 1] = Math.random() * 12 + 0.5;
        positions[i * 3 + 2] = player.z - 110 - Math.random() * 30;
      }
    }
    this.particleGeo.attributes.position.needsUpdate = true;

    // 7b. Ambient Falling Forest Leaves (Task 1: Foreground / Ambience)
    const leafPos = this.leafPositions;
    for (let i = 0; i < this.leafCount; i++) {
      leafPos[i * 3] += Math.sin(time * 2.0 + i) * dt * 1.2; // Gentle horizontal fluttering
      leafPos[i * 3 + 1] -= dt * (1.8 + (i % 3) * 0.6);      // Drifting downwards
      leafPos[i * 3 + 2] += dt * (player.y > 0 ? 3.0 : 4.5); // Passing towards camera for foreground depth

      if (leafPos[i * 3 + 1] < 0 || leafPos[i * 3 + 2] > player.z + 12) {
        leafPos[i * 3] = player.x + (Math.random() - 0.5) * 26;
        leafPos[i * 3 + 1] = Math.random() * 8 + 2.0;
        leafPos[i * 3 + 2] = player.z - 75 - Math.random() * 25;
      }
    }
    this.leafGeo.attributes.position.needsUpdate = true;

    // 8. Update Pickup Explosion Burst Particles
    for (let i = 0; i < this.burstParticlePool.length; i++) {
      const p = this.burstParticlePool[i];
      if (!p.active) continue;

      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        p.mesh.visible = false;
      } else {
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.vy -= 10.0 * dt;
        const scale = p.life / 0.6;
        p.mesh.scale.set(scale, scale, scale);
      }
    }

    // 9. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    if (this.resizeFrameId !== null) {
      cancelAnimationFrame(this.resizeFrameId);
      this.resizeFrameId = null;
    }
    window.removeEventListener('resize', this.onWindowResize);

    if (this.playerShadowMat) this.playerShadowMat.dispose();
    if (this.playerShadowTexture) this.playerShadowTexture.dispose();
    this.particleGeo.dispose();
    this.particleMat.dispose();
    if (this.leafGeo) this.leafGeo.dispose();
    if (this.leafMat) this.leafMat.dispose();
    this.burstGeo.dispose();
    this.burstMatGold.dispose();
    this.burstMatSaffron.dispose();
    this.renderer.dispose();
  }
}
