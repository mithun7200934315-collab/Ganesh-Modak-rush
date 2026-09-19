import React, { useState, useEffect, useCallback } from 'react';
import type { GameState } from '../types/game';
import {
  Volume2,
  VolumeX,
  Music,
  Pause,
  Trophy,
  Zap,
  Sparkles,
  ShieldCheck,
  Maximize,
  Minimize,
} from 'lucide-react';

interface HUDProps {
  state: GameState;
  onPause: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export const HUD = React.memo<HUDProps>(({
  state,
  onPause,
  onToggleSound,
  onToggleMusic,
  soundEnabled,
  musicEnabled,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => !!document.fullscreenElement);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: '16px 24px',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 20,
      }}
    >
      {/* Top Left: Controls & Speed Multiplier Indicator */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onPause}
            className="btn-icon"
            title="Pause Game (P or Esc)"
            style={{
              background: 'rgba(23, 15, 38, 0.8)',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '10px',
              padding: '8px',
              color: '#fde047',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            <Pause size={18} />
          </button>

          <button
            onClick={onToggleSound}
            className="btn-icon"
            title="Toggle SFX"
            style={{
              background: 'rgba(23, 15, 38, 0.8)',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '10px',
              padding: '8px',
              color: soundEnabled ? '#fde047' : '#9ca3af',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={onToggleMusic}
            className="btn-icon"
            title="Toggle Festive Music"
            style={{
              background: 'rgba(23, 15, 38, 0.8)',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '10px',
              padding: '8px',
              color: musicEnabled ? '#fde047' : '#9ca3af',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            <Music size={18} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="btn-icon"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            style={{
              background: 'rgba(23, 15, 38, 0.8)',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '10px',
              padding: '8px',
              color: '#fde047',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>

        {/* Speed Progression Badge (+5% every 15s) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(20, 10, 32, 0.75)',
            border: '1px solid rgba(250, 204, 21, 0.35)',
            borderRadius: '20px',
            padding: '4px 12px',
            backdropFilter: 'blur(8px)',
            fontSize: '12px',
            fontWeight: 800,
            color: '#fde047',
            letterSpacing: '0.5px',
          }}
        >
          <Zap size={14} color="#facc15" />
          <span>SPEED: {(state.speedMultiplier || 1.0).toFixed(2)}x (+6%/8s)</span>
        </div>

        {/* Speed Increase Paused Indicator */}
        {state.speedIncreasePauseTimer > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.85) 0%, rgba(126, 34, 206, 0.85) 100%)',
              border: '1.5px solid #fde047',
              borderRadius: '20px',
              padding: '4px 12px',
              backdropFilter: 'blur(8px)',
              fontSize: '12px',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 0 16px rgba(250, 204, 21, 0.5)',
              animation: 'pulse 1s infinite alternate',
            }}
          >
            <ShieldCheck size={14} color="#fef08a" />
            <span>SPEED INCREASE PAUSED: {Math.ceil(state.speedIncreasePauseTimer)}s</span>
          </div>
        )}
      </div>

      {/* Center Mega Modak Celebration Banner */}
      {state.bonusMessage && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.95) 0%, rgba(107, 33, 168, 0.95) 100%)',
            border: '2px solid #fde047',
            borderRadius: '20px',
            padding: '12px 28px',
            boxShadow: '0 10px 40px rgba(245, 158, 11, 0.7), 0 0 30px rgba(251, 191, 36, 0.8)',
            backdropFilter: 'blur(12px)',
            animation: 'bounce 0.5s ease',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '1px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8), 0 0 16px #facc15',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={22} color="#fde047" />
            {state.bonusMessage}
            <Sparkles size={22} color="#fde047" />
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#fef08a',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            ✨ Speed Increase Paused for 5s • 100 Bonus Points! ✨
          </div>
        </div>
      )}

      {/* Top Right: Score & Modak Counter */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
        }}
      >
        {/* Main Score Panel */}
        <div
          className="glass-panel-gold"
          style={{
            padding: '8px 18px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(24, 12, 38, 0.85)',
            border: '1.5px solid rgba(250, 204, 21, 0.6)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(250, 204, 21, 0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Modak Icon & Count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderRight: '1px solid rgba(250, 204, 21, 0.35)',
              paddingRight: '10px',
            }}
          >
            <span style={{ fontSize: '20px', filter: 'drop-shadow(0 0 6px #facc15)' }}>🥟</span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '16px',
                color: '#fef08a',
              }}
            >
              {state.modaks}
            </span>
          </div>

          {/* Clean Score Value */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#fed7aa',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Score
            </span>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '0.5px',
                textShadow: '0 0 10px rgba(250, 204, 21, 0.7)',
              }}
            >
              {state.score}
            </span>
          </div>
        </div>

        {/* High Score Badge */}
        {state.highScore > 0 && (
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#fde047',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(23, 15, 38, 0.7)',
              padding: '3px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(251, 191, 36, 0.35)',
            }}
          >
            <Trophy size={13} color="#facc15" /> BEST: {state.highScore}
          </div>
        )}
      </div>
    </div>
  );
});
