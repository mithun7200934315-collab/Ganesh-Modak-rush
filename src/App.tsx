import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, UserSettings } from './types/game';
import { GameEngine } from './game/GameEngine';
import { storage } from './game/storage';
import { soundManager } from './audio/soundSystem';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { MainMenu } from './components/MainMenu';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { CulturalCodexModal } from './components/CulturalCodexModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [engine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState>(() => engine.state);

  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync settings with soundManager
  useEffect(() => {
    soundManager.setSoundEnabled(settings.soundEnabled);
    soundManager.setMusicEnabled(settings.musicEnabled);
    soundManager.setSfxVolume(settings.sfxVolume);
    soundManager.setMusicVolume(settings.musicVolume);
  }, [settings]);

  // Hook engine state listener
  useEffect(() => {
    engine.setOnStateChange((newState) => {
      setGameState({ ...newState });
    });
  }, [engine]);

  // Stable Game Action Handlers
  const handleStartLevel = useCallback(() => {
    engine.start();
    setGameState({ ...engine.state, mode: 'PLAYING' });
  }, [engine]);

  const handleStartEndless = useCallback(() => {
    engine.start();
    setGameState({ ...engine.state, mode: 'PLAYING' });
  }, [engine]);

  const handlePause = useCallback(() => {
    engine.pause();
    setGameState((prev) => ({ ...prev, mode: 'PAUSED' }));
  }, [engine]);

  const handleResume = useCallback(() => {
    engine.resume();
    setGameState((prev) => ({ ...prev, mode: 'PLAYING' }));
  }, [engine]);

  const handleRestart = useCallback(() => {
    engine.start();
    setGameState({ ...engine.state, mode: 'PLAYING' });
  }, [engine]);

  const handleHome = useCallback(() => {
    soundManager.stopFestiveBGM();
    engine.pause();
    engine.state.mode = 'MENU';
    setGameState((prev) => ({
      ...prev,
      mode: 'MENU',
      highScore: storage.getHighScore(),
      totalModaks: storage.getTotalModaks(),
      unlockedLevel: storage.getUnlockedLevel(),
    }));
  }, [engine]);

  const handleNextLevel = useCallback(() => {
    handleStartEndless();
  }, [handleStartEndless]);

  // Touch Controls Callbacks (memoized)
  const handleJump = useCallback(() => {
    engine.jump();
  }, [engine]);

  const handleSlide = useCallback(() => {
    engine.slide();
  }, [engine]);

  const handleShiftLaneLeft = useCallback(() => {
    engine.shiftLane(-1);
  }, [engine]);

  const handleShiftLaneRight = useCallback(() => {
    engine.shiftLane(1);
  }, [engine]);

  // Sound Toggles
  const handleToggleSound = useCallback(() => {
    setSettings((prev) => {
      const updated = !prev.soundEnabled;
      return storage.saveSettings({ soundEnabled: updated });
    });
  }, []);

  const handleToggleMusic = useCallback(() => {
    setSettings((prev) => {
      const updated = !prev.musicEnabled;
      return storage.saveSettings({ musicEnabled: updated });
    });
  }, []);

  const handleUpdateSettings = useCallback((partial: Partial<UserSettings>) => {
    const updated = storage.saveSettings(partial);
    setSettings(updated);
  }, []);

  const handleResetData = useCallback(() => {
    storage.resetAll();
    setGameState((prev) => ({
      ...prev,
      highScore: 0,
      totalModaks: 0,
      unlockedLevel: 1,
    }));
  }, []);

  const handleOpenCodex = useCallback(() => setIsCodexOpen(true), []);
  const handleCloseCodex = useCallback(() => setIsCodexOpen(false), []);
  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#08030e',
    }}>
      {/* 1. Main Canvas (Always mounted for seamless rendering) */}
      <GameCanvas
        engine={engine}
        onPause={handlePause}
        onRestart={handleRestart}
      />

      {/* 2. HUD Overlay (Visible during gameplay & pause) */}
      {gameState.mode !== 'MENU' && (
        <HUD
          state={gameState}
          onPause={handlePause}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          soundEnabled={settings.soundEnabled}
          musicEnabled={settings.musicEnabled}
        />
      )}

      {/* 3. Mobile Touch Controls (Visible during active play) */}
      {gameState.mode === 'PLAYING' && (
        <TouchControls
          onJump={handleJump}
          onSlide={handleSlide}
          onShiftLaneLeft={handleShiftLaneLeft}
          onShiftLaneRight={handleShiftLaneRight}
        />
      )}

      {/* 4. Main Menu View */}
      {gameState.mode === 'MENU' && (
        <MainMenu
          highScore={gameState.highScore}
          totalModaks={gameState.totalModaks}
          unlockedLevel={gameState.unlockedLevel}
          onStartLevel={handleStartLevel}
          onStartEndless={handleStartEndless}
          onOpenCodex={handleOpenCodex}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {/* 5. Pause Modal */}
      {gameState.mode === 'PAUSED' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onHome={handleHome}
          soundEnabled={settings.soundEnabled}
          musicEnabled={settings.musicEnabled}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {/* 6. Level Complete Modal */}
      {gameState.mode === 'LEVEL_COMPLETE' && (
        <LevelCompleteModal
          state={gameState}
          onNextLevel={handleNextLevel}
          onReplay={handleRestart}
          onHome={handleHome}
        />
      )}

      {/* 7. Game Over Modal */}
      {gameState.mode === 'GAME_OVER' && (
        <GameOverModal
          state={gameState}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}

      {/* 8. Cultural Codex Modal */}
      {isCodexOpen && (
        <CulturalCodexModal onClose={handleCloseCodex} />
      )}

      {/* 9. Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetData={handleResetData}
          onClose={handleCloseSettings}
        />
      )}
    </div>
  );
};

export default App;
