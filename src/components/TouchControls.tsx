import React from 'react';
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TouchControlsProps {
  onJump: () => void;
  onSlide: () => void;
  onShiftLaneLeft: () => void;
  onShiftLaneRight: () => void;
}

export const TouchControls = React.memo<TouchControlsProps>(({
  onJump,
  onSlide,
  onShiftLaneLeft,
  onShiftLaneRight,
}) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: 12,
      left: 0,
      width: '100%',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      pointerEvents: 'none',
      zIndex: 25,
    }}>
      {/* Left Thumb: Slide & Lane Left */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
      }}>
        {/* Slide Button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onSlide(); }}
          onMouseDown={(e) => { e.preventDefault(); onSlide(); }}
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(76, 29, 149, 0.85) 0%, rgba(30, 14, 53, 0.95) 100%)',
            border: '2px solid rgba(251, 191, 36, 0.6)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2)',
            color: '#fde047',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
          aria-label="Slide Button"
        >
          <ArrowDown size={28} strokeWidth={3} />
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px' }}>SLIDE</span>
        </button>

        {/* Lane Left */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onShiftLaneLeft(); }}
          onMouseDown={(e) => { e.preventDefault(); onShiftLaneLeft(); }}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(30, 16, 53, 0.8)',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            color: '#facc15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
          aria-label="Shift Lane Left"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Right Thumb: Lane Right & Jump */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
      }}>
        {/* Lane Right */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onShiftLaneRight(); }}
          onMouseDown={(e) => { e.preventDefault(); onShiftLaneRight(); }}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(30, 16, 53, 0.8)',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            color: '#facc15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
          aria-label="Shift Lane Right"
        >
          <ChevronRight size={24} />
        </button>

        {/* Jump Button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onJump(); }}
          onMouseDown={(e) => { e.preventDefault(); onJump(); }}
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #b45309 100%)',
            border: '2.5px solid #fef08a',
            boxShadow: '0 8px 24px rgba(234, 88, 12, 0.6), inset 0 2px 6px rgba(255,255,255,0.4)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
          aria-label="Jump Button"
        >
          <ArrowUp size={34} strokeWidth={3.5} />
          <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.8px' }}>JUMP</span>
        </button>
      </div>
    </div>
  );
});
