import React, { useRef, useEffect } from 'react';
import { GameEngine } from '../game/GameEngine';
import { ThreeRenderer } from '../game/ThreeRenderer';

interface GameCanvasProps {
  engine: GameEngine;
  onPause: () => void;
  onRestart: () => void;
}

const GameCanvasComponent: React.FC<GameCanvasProps> = ({
  engine,
  onPause,
  onRestart,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<ThreeRenderer | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Stable callback refs so useEffect never triggers renderer disposal on re-render
  const onPauseRef = useRef(onPause);
  const onRestartRef = useRef(onRestart);

  useEffect(() => {
    onPauseRef.current = onPause;
    onRestartRef.current = onRestart;
  }, [onPause, onRestart]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Initialize 3D Three.js Renderer once
    const renderer = new ThreeRenderer(container, canvas);
    rendererRef.current = renderer;

    // Connect modak and mega laddoo particle burst callback
    engine.setOnModakCollected((x, y, z, isMega) => {
      renderer.spawnModakBurst(x, y, z, isMega);
    });

    // Reset road whenever game engine starts or restarts
    const originalStart = engine.start.bind(engine);
    engine.start = () => {
      originalStart();
      renderer.resetRoad(0);
    };

    // Keyboard Controls with repeat guard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      // Ignore held-down key repeats to prevent duplicate triggers
      if (e.repeat) return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          engine.shiftLane(-1); // Switch to Left Lane
          break;
        case 'ArrowRight':
        case 'KeyD':
          engine.shiftLane(1);  // Switch to Right Lane
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          engine.jump();        // Jump
          break;
        case 'ArrowDown':
        case 'KeyS':
          engine.slide();       // Slide / Fast-fall
          break;
        case 'KeyP':
        case 'Escape':
          onPauseRef.current();
          break;
        case 'KeyR':
          onRestartRef.current();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Touch Swipe Gestures for Mobile & Tablets
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length === 0) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Swipe detected (> 25px threshold)
      if (Math.max(absX, absY) > 25) {
        if (absX > absY) {
          if (dx < 0) {
            engine.shiftLane(-1); // Swipe Left
          } else {
            engine.shiftLane(1);  // Swipe Right
          }
        } else {
          if (dy < 0) {
            engine.jump(); // Swipe Up to Jump
          } else {
            engine.slide(); // Swipe Down
          }
        }
      }
      touchStartRef.current = null;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Decoupled Physics Simulation & Rendering Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let accumulator = 0;
    const FIXED_PHYSICS_STEP = 1 / 60; // 60 Hz fixed timestep
    const MAX_ACCUMULATED_TIME = 0.1;  // Prevent spiral of death on frame drops

    const gameLoop = (currentTime: number) => {
      const frameDelta = Math.min((currentTime - lastTime) / 1000, MAX_ACCUMULATED_TIME);
      lastTime = currentTime;

      accumulator += frameDelta;

      // 1. Separate Fixed-Step Physics Simulation Loop
      while (accumulator >= FIXED_PHYSICS_STEP) {
        engine.update(FIXED_PHYSICS_STEP);
        accumulator -= FIXED_PHYSICS_STEP;
      }

      // 2. Rendering Loop via requestAnimationFrame
      if (rendererRef.current) {
        rendererRef.current.render(
          engine.state,
          engine.player,
          engine.collectibles,
          engine.obstacles,
          frameDelta
        );
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
      engine.start = originalStart;
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [engine]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        background: '#08030e',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          background: '#11071c',
        }}
      />
    </div>
  );
};

export const GameCanvas = React.memo(GameCanvasComponent);
