import React from 'react';
import type { GameState } from '../types/game';
import { RotateCcw, Home, Trophy } from 'lucide-react';

interface GameOverModalProps {
  state: GameState;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  state,
  onRestart,
  onHome,
}) => {
  const isNewHighScore = state.score >= state.highScore && state.score > 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 7, 24, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 50,
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: '20px',
          border: '2px solid rgba(251, 191, 36, 0.5)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.25)',
        }}
      >
        {/* Divine Diya Icon */}
        <div
          style={{
            fontSize: '48px',
            marginBottom: '8px',
            filter: 'drop-shadow(0 0 12px #f59e0b)',
          }}
        >
          🪔
        </div>

        {/* Game Over Title */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '30px',
            color: '#fef08a',
            letterSpacing: '1px',
            marginBottom: '4px',
            textTransform: 'uppercase',
            textShadow: '0 0 16px rgba(250, 204, 21, 0.6)',
          }}
        >
          Game Over
        </h2>

        <p
          style={{
            fontSize: '13px',
            color: '#fed7aa',
            marginBottom: '20px',
            maxWidth: '340px',
            lineHeight: 1.5,
          }}
        >
          An obstacle paused the run. Lord Ganesha blesses your journey!
        </p>

        {/* High Score Celebration Badge */}
        {isNewHighScore && (
          <div
            className="glass-panel-gold float-slow"
            style={{
              padding: '6px 16px',
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: 800,
              color: '#fef08a',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '30px',
            }}
          >
            <Trophy size={16} color="#facc15" /> NEW HIGH SCORE!
          </div>
        )}

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            width: '100%',
            marginBottom: '24px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(30, 15, 48, 0.7)',
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>FINAL SCORE</div>
            <div
              style={{
                fontSize: '24px',
                color: '#ffffff',
                fontWeight: 900,
                marginTop: '3px',
                textShadow: '0 0 8px rgba(250, 204, 21, 0.5)',
              }}
            >
              {state.score}
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(30, 15, 48, 0.7)',
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>BEST SCORE</div>
            <div
              style={{
                fontSize: '24px',
                color: '#fde047',
                fontWeight: 900,
                marginTop: '3px',
              }}
            >
              {state.highScore}
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(30, 15, 48, 0.7)',
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>MODAKS GATHERED</div>
            <div style={{ fontSize: '18px', color: '#fef08a', fontWeight: 800, marginTop: '2px' }}>
              🥟 {state.modaks}
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(30, 15, 48, 0.7)',
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>SPEED REACHED</div>
            <div style={{ fontSize: '18px', color: '#fde047', fontWeight: 800, marginTop: '2px' }}>
              ⚡ {(state.speedMultiplier || 1.0).toFixed(2)}x
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button
            onClick={onRestart}
            className="btn-festive"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={18} /> Play Again (R)
          </button>
          <button
            onClick={onHome}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Home size={15} /> Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
