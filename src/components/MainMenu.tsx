import React, { useState, useEffect, useCallback } from 'react';
import { LEVEL_CONFIGS } from '../game/constants';
import { Play, BookOpen, Settings, Lock, Trophy, Sparkles, Maximize, Minimize } from 'lucide-react';

interface MainMenuProps {
  highScore: number;
  totalModaks: number;
  unlockedLevel: number;
  onStartLevel: (level: number) => void;
  onStartEndless: () => void;
  onOpenCodex: () => void;
  onOpenSettings: () => void;
}

export const MainMenu = React.memo<MainMenuProps>(({
  highScore,
  totalModaks,
  unlockedLevel,
  onStartLevel,
  onStartEndless,
  onOpenCodex,
  onOpenSettings,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => !!document.fullscreenElement);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      zIndex: 30,
      background: 'radial-gradient(circle at 50% 40%, rgba(76, 29, 149, 0.45) 0%, rgba(17, 7, 28, 0.88) 75%)',
    }}>
      {/* Top Right Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="btn-icon"
        title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          background: 'rgba(23, 15, 38, 0.85)',
          border: '1px solid rgba(251, 191, 36, 0.45)',
          borderRadius: '12px',
          padding: '8px 14px',
          color: '#fde047',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 700,
          zIndex: 40,
          transition: 'all 0.2s ease',
        }}
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        <span>{isFullscreen ? 'Windowed' : 'Full Screen'}</span>
      </button>
      {/* Decorative Traditional Toran Swag at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 12px',
        pointerEvents: 'none',
      }}>
        {['🪔', '🥟', '🌸', '🛕', '🌸', '🥟', '🪔'].map((item, idx) => (
          <span key={idx} style={{ fontSize: '20px', filter: 'drop-shadow(0 0 6px #f59e0b)' }}>
            {item}
          </span>
        ))}
      </div>

      {/* Main Title Card */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(245, 158, 11, 0.18)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '30px',
          padding: '6px 18px',
          marginBottom: '12px',
          fontSize: '12px',
          fontWeight: 800,
          color: '#fef08a',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>
          <Sparkles size={14} color="#facc15" /> Ganesh Chaturthi Game 2026 <Sparkles size={14} color="#facc15" />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(36px, 6vw, 64px)',
          lineHeight: 1.1,
          background: 'linear-gradient(135deg, #ffffff 0%, #fde047 40%, #f59e0b 80%, #ea580c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 16px rgba(245, 158, 11, 0.5))',
          letterSpacing: '1.5px',
          marginBottom: '6px',
        }}>
          MUSHAK DASH
        </h1>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(14px, 2.5vw, 22px)',
          fontWeight: 900,
          color: '#fb923c',
          letterSpacing: '3px',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          THE MODAK MISSION
        </div>

        <p style={{
          fontSize: '14px',
          color: '#fef3c7',
          marginTop: '8px',
          maxWidth: '460px',
          lineHeight: 1.5,
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
        }}>
          Ride with Lord Ganesha on Mooshika the grey rat along the sacred grey stone highway, toward the golden morning sun and crepuscular god rays!
        </p>
      </div>

      {/* Main Buttons / Level Selection */}
      {!showLevelSelect ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '360px',
          marginBottom: '24px',
        }}>
          <button
            onClick={onStartEndless}
            className="btn-festive"
            style={{
              width: '100%',
              fontSize: '16px',
              padding: '16px 28px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #7e22ce 100%)',
              borderColor: '#fde047',
            }}
          >
            <Play size={22} /> Start Endless Runner
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onOpenCodex}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px' }}
            >
              <BookOpen size={16} /> Festival Stories
            </button>
            <button
              onClick={onOpenSettings}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px' }}
            >
              <Settings size={16} /> Settings
            </button>
          </div>
        </div>
      ) : (
        /* Level Selector View */
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '520px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              color: '#fef08a',
            }}>
              Select Festival Level
            </h3>
            <button
              onClick={() => setShowLevelSelect(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '16px',
          }}>
            {LEVEL_CONFIGS.map((lvl) => {
              const isUnlocked = lvl.id <= unlockedLevel;
              const isSelected = selectedLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  disabled={!isUnlocked}
                  onClick={() => setSelectedLevel(lvl.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '12px',
                    borderRadius: '14px',
                    border: isSelected
                      ? '2px solid #facc15'
                      : isUnlocked
                      ? '1.5px solid rgba(251, 191, 36, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(234, 88, 12, 0.3) 100%)'
                      : isUnlocked
                      ? 'rgba(30, 16, 53, 0.6)'
                      : 'rgba(20, 10, 30, 0.4)',
                    color: isUnlocked ? '#ffffff' : '#6b7280',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: isUnlocked ? '#fde047' : '#6b7280' }}>
                      LEVEL {lvl.id}
                    </span>
                    {!isUnlocked && <Lock size={12} color="#6b7280" />}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>
                    {lvl.name}
                  </div>
                  <div style={{ fontSize: '11px', color: isUnlocked ? '#fed7aa' : '#4b5563', marginTop: '2px' }}>
                    Target: {lvl.targetDistance}m
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onStartLevel(selectedLevel)}
            className="btn-festive"
            style={{ width: '100%' }}
          >
            Start Level {selectedLevel} <Play size={16} />
          </button>
        </div>
      )}

      {/* Persistent Stats Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        background: 'rgba(30, 16, 53, 0.75)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '20px',
        padding: '8px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <Trophy size={16} color="#facc15" />
          <span style={{ color: '#9ca3af' }}>High Score:</span>
          <strong style={{ color: '#fef08a' }}>{highScore.toLocaleString()}</strong>
        </div>

        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <span style={{ fontSize: '16px' }}>🥟</span>
          <span style={{ color: '#9ca3af' }}>Total Modaks:</span>
          <strong style={{ color: '#fde047' }}>{totalModaks.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
});
