import * as THREE from 'three';
import { ThreeModelBuilder } from './ThreeModelBuilder';
import type { Player3D, Collectible3D, Obstacle3D, GameState, ObstacleType, CollectibleType } from '../types/game';
import { ROAD_SEGMENT_LENGTH, VISIBLE_ROAD_SEGMENTS } from './constants';

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

  // Environment & Road
  private skyGroup: THREE.Group | null = null;
  private roadSegments: THREE.Group[] = [];
  private diyaFlames: THREE.Mesh[] = [];

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

    // 1. Scene & Early Morning Dawn Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xfbcfe8, 0.0028);

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
    this.renderer.toneMappingExposure = 1.28;

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
    this.ambientLight = new THREE.AmbientLight(0xffedd5, 1.1);
    this.scene.add(this.ambientLight);

    // Early Morning Sun Directional Light (beaming from forward horizon toward camera)
    this.dirLight = new THREE.DirectionalLight(0xfef08a, 1.6);
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
    this.scene.add(this.skyGroup);
  }

  public resetRoad(playerZ: number = 0) {
    for (let i = 0; i < this.roadSegments.length; i++) {
      // Offset by 1 segment behind so road extends behind camera
      const z = playerZ + ROAD_SEGMENT_LENGTH - (i * ROAD_SEGMENT_LENGTH);
      this.roadSegments[i].position.set(0, 0, z);
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

      // Collect diya flame meshes for flicking animation
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

      // Mooshika Gallop Legs
      const runCycle = player.runCycle;
      if (this.playerLegs.length === 4) {
        this.playerLegs[0].rotation.x = Math.sin(runCycle) * 0.6;
        this.playerLegs[1].rotation.x = -Math.sin(runCycle) * 0.6;
        this.playerLegs[2].rotation.x = -Math.sin(runCycle) * 0.6;
        this.playerLegs[3].rotation.x = Math.sin(runCycle) * 0.6;
      }

      // Mooshika Tail Sway
      if (this.playerTail) {
        this.playerTail.rotation.y = Math.sin(runCycle * 0.8) * 0.35;
        this.playerTail.rotation.z = Math.cos(runCycle * 0.8) * 0.2;
      }

      // Lord Ganesha Ears Flapping
      if (this.playerEars.length === 2) {
        const earFlap = Math.sin(runCycle * 0.5) * 0.12;
        this.playerEars[0].rotation.y = -0.25 + earFlap;
        this.playerEars[1].rotation.y = 0.25 - earFlap;
      }

      // Shimmering Pulsing Aura
      if (this.playerAuraInner) {
        const pulse = 1.0 + Math.sin(time * 6) * 0.08;
        this.playerAuraInner.scale.set(pulse, pulse, 1);
      }
      if (this.playerAuraOuter) {
        const pulseOuter = 1.0 + Math.cos(time * 5) * 0.12;
        this.playerAuraOuter.scale.set(pulseOuter, pulseOuter, 1);
      }

      // Warm player light
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

    // Sky follows forward progress
    if (this.skyGroup) {
      this.skyGroup.position.set(0, 0, player.z);

      // Animate subtle shimmer & breath on crepuscular god rays (O(1) cached group lookup)
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

    // 3. Infinite Road Chunk Recycling
    for (let i = 0; i < this.roadSegments.length; i++) {
      const segment = this.roadSegments[i];
      if (segment.position.z > player.z + ROAD_SEGMENT_LENGTH * 1.5) {
        segment.position.z -= VISIBLE_ROAD_SEGMENTS * ROAD_SEGMENT_LENGTH;
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
    this.burstGeo.dispose();
    this.burstMatGold.dispose();
    this.burstMatSaffron.dispose();
    this.renderer.dispose();
  }
}
