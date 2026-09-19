import React from 'react';
import { Play, RotateCcw, Home, Volume2, Music } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(17, 7, 28, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 50,
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '30px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>🕉️</div>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '26px',
          color: '#fef08a',
          marginBottom: '6px',
        }}>
          Festival Pause
        </h2>
        <p style={{ fontSize: '13px', color: '#fed7aa', marginBottom: '22px' }}>
          Catch your breath, devotee! Press P or Resume to continue.
        </p>

        {/* Audio Quick Toggles */}
        <div style={{
          display: 'flex',
          gap: '12px',
          width: '100%',
          marginBottom: '22px',
        }}>
          <button
            onClick={onToggleMusic}
            className="btn-secondary"
            style={{
              flex: 1,
              borderColor: musicEnabled ? '#facc15' : 'rgba(255,255,255,0.2)',
              color: musicEnabled ? '#fde047' : '#9ca3af',
            }}
          >
            <Music size={16} /> Music: {musicEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={onToggleSound}
            className="btn-secondary"
            style={{
              flex: 1,
              borderColor: soundEnabled ? '#facc15' : 'rgba(255,255,255,0.2)',
              color: soundEnabled ? '#fde047' : '#9ca3af',
            }}
          >
            <Volume2 size={16} /> SFX: {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button onClick={onResume} className="btn-festive" style={{ width: '100%' }}>
            <Play size={18} /> Resume Mission
          </button>
          <button onClick={onRestart} className="btn-secondary" style={{ width: '100%' }}>
            <RotateCcw size={16} /> Restart Level (R)
          </button>
          <button onClick={onHome} className="btn-secondary" style={{ width: '100%' }}>
            <Home size={16} /> Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
