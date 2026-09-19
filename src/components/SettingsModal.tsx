import React, { useState } from 'react';
import { X, Volume2, Music, Keyboard, Smartphone, Trash2 } from 'lucide-react';
import type { UserSettings } from '../types/game';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(17, 7, 28, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 50,
    }}>
      <div className="glass-panel-gold" style={{
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            color: '#fef08a',
          }}>
            Settings & Controls
          </h2>
          <button onClick={onClose} className="btn-icon" aria-label="Close Settings">
            <X size={20} />
          </button>
        </div>

        {/* Audio Volume Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Music Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 700, color: '#fde047' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Music size={16} /> Festival Music Volume
              </span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => onUpdateSettings({ musicVolume: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 700, color: '#fde047' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Volume2 size={16} /> Sound Effects (SFX) Volume
              </span>
              <span>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Controls Guide Section */}
        <div style={{
          background: 'rgba(30, 16, 53, 0.5)',
          borderRadius: '16px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '14px',
            color: '#facc15',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Keyboard size={16} /> Desktop Controls
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <div><strong style={{ color: '#fde047' }}>Jump:</strong> Space / Up / W</div>
            <div><strong style={{ color: '#fde047' }}>Slide:</strong> Down / S</div>
            <div><strong style={{ color: '#fde047' }}>Lanes:</strong> Left / Right / A / D</div>
            <div><strong style={{ color: '#fde047' }}>Pause:</strong> P / Escape</div>
            <div><strong style={{ color: '#fde047' }}>Restart:</strong> R</div>
          </div>

          <h3 style={{
            fontSize: '14px',
            color: '#facc15',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginTop: '16px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Smartphone size={16} /> Mobile & Tablet Controls
          </h3>

          <div style={{ fontSize: '13px', color: '#e5e7eb', lineHeight: 1.5 }}>
            • <strong>Touch Buttons:</strong> Big Jump (right) and Slide (left) buttons.<br />
            • <strong>Swipe Gestures:</strong> Swipe Up to jump, Swipe Down to slide, Swipe Left/Right to change lanes!
          </div>
        </div>

        {/* Reset Data Section */}
        <div style={{
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#f87171',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Trash2 size={14} /> Reset Scores & Unlocks
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#fca5a5' }}>Reset all progress?</span>
              <button
                onClick={() => {
                  onResetData();
                  setShowConfirmReset(false);
                }}
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <button onClick={onClose} className="btn-festive" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
