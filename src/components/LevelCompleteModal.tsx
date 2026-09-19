import React, { useEffect } from 'react';
import type { GameState } from '../types/game';
import { LEVEL_CONFIGS } from '../game/constants';
import confetti from 'canvas-confetti';
import { Sparkles, Star, ArrowRight, RotateCcw, Home } from 'lucide-react';

interface LevelCompleteModalProps {
  state: GameState;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  state,
  onNextLevel,
  onReplay,
  onHome,
}) => {
  const currentConfig = LEVEL_CONFIGS[Math.min(state.level - 1, LEVEL_CONFIGS.length - 1)];
  const isFinalLevel = state.level >= 4;

  // Star calculation
  let stars = 1;
  if (state.modaks >= 30) stars = 3;
  else if (state.modaks >= 15) stars = 2;

  useEffect(() => {
    // Trigger celebratory festival confetti burst!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ea580c', '#facc15', '#ec4899', '#10b981'],
    });
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(17, 7, 28, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 50,
    }}>
      <div className="glass-panel-gold" style={{
        width: '100%',
        maxWidth: '540px',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(245, 158, 11, 0.3)',
      }}>
        {/* Pandal Top Icon */}
        <div style={{
          fontSize: '48px',
          marginBottom: '8px',
          filter: 'drop-shadow(0 0 12px #facc15)',
        }}>
          🛕
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          color: '#fef08a',
          letterSpacing: '1px',
          marginBottom: '4px',
          textShadow: '0 2px 8px rgba(245, 158, 11, 0.5)',
        }}>
          {isFinalLevel ? 'FESTIVAL GRAND VICTORY!' : 'PANDAL DARSHAN REACHED!'}
        </h2>

        <p style={{ fontSize: '14px', color: '#fed7aa', marginBottom: '16px' }}>
          Level {state.level}: {currentConfig.name} Completed
        </p>

        {/* Stars */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              size={34}
              fill={starIdx <= stars ? '#fde047' : 'rgba(255,255,255,0.1)'}
              color={starIdx <= stars ? '#ca8a04' : 'rgba(255,255,255,0.2)'}
              style={{
                filter: starIdx <= stars ? 'drop-shadow(0 0 8px #facc15)' : 'none',
                transform: starIdx <= stars ? 'scale(1.1)' : 'scale(0.9)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Blessing Box */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1.5px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '20px',
          width: '100%',
        }}>
          <div style={{
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#fde047',
            fontWeight: 800,
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}>
            <Sparkles size={14} /> {currentConfig.blessingName}
          </div>
          <div style={{ fontSize: '13px', color: '#fef3c7', lineHeight: 1.5 }}>
            "{currentConfig.blessingDesc}"
          </div>
        </div>

        {/* Run Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          width: '100%',
          marginBottom: '24px',
        }}>
          <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>MODAKS COLLECTED</div>
            <div style={{ fontSize: '22px', color: '#fde047', fontWeight: 900, marginTop: '2px' }}>
              🥟 {state.modaks}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>TOTAL SCORE</div>
            <div style={{ fontSize: '22px', color: '#ffffff', fontWeight: 900, marginTop: '2px' }}>
              {state.score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button onClick={onNextLevel} className="btn-festive" style={{ width: '100%' }}>
            {isFinalLevel ? 'Play Endless Celebration' : 'Next Pandal Level'} <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button onClick={onReplay} className="btn-secondary" style={{ flex: 1 }}>
              <RotateCcw size={16} /> Replay
            </button>
            <button onClick={onHome} className="btn-secondary" style={{ flex: 1 }}>
              <Home size={16} /> Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
