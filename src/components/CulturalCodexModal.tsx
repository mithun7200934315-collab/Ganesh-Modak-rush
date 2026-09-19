import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CulturalCodexModalProps {
  onClose: () => void;
}

interface CodexTopic {
  id: string;
  icon: string;
  title: string;
  sanskrit: string;
  themeColor: string;
  summary: string;
  bullets: string[];
}

const CODEX_TOPICS: CodexTopic[] = [
  {
    id: 'mushak',
    icon: '🐭',
    title: 'Mushak: The Humble Vahana',
    sanskrit: 'मूषकवाहन (Mūṣakavāhana)',
    themeColor: '#f59e0b',
    summary:
      'Lord Ganesha, the grand Lord of the Cosmos and Obstacle Remover, chose the humble mouse (Mushak) as His sacred mount and companion.',
    bullets: [
      'Humility & Equal Grace: Divinity does not measure greatness by size. Ganesha honors even the smallest of creatures.',
      'Mastery Over Restless Mind: A mouse scurries incessantly, symbolizing our wandering desires and ego. Sitting atop Mushak symbolizes mastery over our restless thoughts.',
      'Navigating Every Corner: Just as a mouse can enter the smallest nook and cranny to find light, intellect and wisdom can find solutions to any obstacle.',
    ],
  },
  {
    id: 'modak',
    icon: '🥟',
    title: 'The Sacred Modak',
    sanskrit: 'मोदकप्रिय (Modakapriya)',
    themeColor: '#fbbf24',
    summary:
      'Modak is Lord Ganesha’s favorite sweet, traditionally offered in batches of 21 during Vinayaka Chaturthi puja.',
    bullets: [
      'The Sweetness of Wisdom: The outer pleated dough is made of simple rice flour, representing the external physical world. The sweet inner filling of jaggery and grated coconut represents the inner divine bliss (Ananda).',
      'The Conical Peak: The shape of the modak resembles a mountain peak pointing upward to higher consciousness and focus (Ekagrata).',
      'Symbol of Ultimate Reward: When one completes life’s tests with devotion and patience, one attains the sweet nectar of spiritual fulfillment.',
    ],
  },
  {
    id: 'offerings',
    icon: '🌿',
    title: 'Durva Grass & Marigold',
    sanskrit: 'दूर्वाङ्कुर & झेंडू (Durva & Genda)',
    themeColor: '#22c55e',
    summary:
      'The most beloved natural offerings made to Lord Ganesha during the 10-day celebration.',
    bullets: [
      'Sacred Durva Grass (21 Blades): After Ganesha swallowed the demon Analasura (who embodied burning anger and negative thoughts), the gods offered 21 blades of Durva to cool His body. Durva represents cooling humility and endurance.',
      'Marigold Flowers (Genda): Radiant orange and yellow blossoms representing the vibrant rays of the sun and auspicious new beginnings.',
      'Sacred Kalash & Coconut: A brass pot of holy water crowned with 5 mango leaves and an unbroken coconut symbolizing divine cosmic energy.',
    ],
  },
  {
    id: 'eco_bappa',
    icon: '🌱',
    title: 'Eco-Friendly Ganesha',
    sanskrit: 'मातीचा बाप्पा (Mitti Bappa)',
    themeColor: '#10b981',
    summary:
      'The authentic Vedic festival tradition of using natural river clay (Shadu Mati) and organic plant colors.',
    bullets: [
      'Cycle of Return: Made from mother earth, the clay idol gently dissolves in water during Visarjan, returning harmlessly to nature in complete cyclical balance.',
      'Seed Ganeshas (Vriksha Ganesha): Modern devotees craft clay Murtis containing organic seeds (tulsi, marigold). Upon immersion in a planter, a green plant blooms as Bappa’s living blessing!',
      'Pure Devotion: True celebration cherishes water bodies, clean rivers, and living creatures without synthetic colors or chemicals.',
    ],
  },
];

export const CulturalCodexModal: React.FC<CulturalCodexModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('mushak');
  const activeTopic = CODEX_TOPICS.find((t) => t.id === activeTab) || CODEX_TOPICS[0];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 7, 23, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 50,
    }}>
      <div className="glass-panel-gold" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1.5px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(30, 16, 53, 0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🪔</span>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                color: '#fde047',
                letterSpacing: '0.5px',
              }}>
                Festival Codex & Stories
              </h2>
              <p style={{ fontSize: '12px', color: '#fbcfe8' }}>
                The sacred wisdom & symbolism of Vinayaka Chaturthi
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close Codex">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          overflowX: 'auto',
          background: 'rgba(20, 10, 35, 0.4)',
        }}>
          {CODEX_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                border: activeTab === topic.id ? `2px solid ${topic.themeColor}` : '1.5px solid rgba(255,255,255,0.1)',
                background: activeTab === topic.id ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.04)',
                color: activeTab === topic.id ? '#fef08a' : '#d1d5db',
                fontWeight: activeTab === topic.id ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{topic.icon}</span>
              <span>{topic.title.split(':')[0]}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{
              fontSize: '36px',
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: `2px solid ${activeTopic.themeColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {activeTopic.icon}
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                color: '#ffffff',
              }}>
                {activeTopic.title}
              </h3>
              <div style={{
                fontSize: '14px',
                color: activeTopic.themeColor,
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}>
                {activeTopic.sanskrit}
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderLeft: `4px solid ${activeTopic.themeColor}`,
            padding: '14px 18px',
            borderRadius: '0 12px 12px 0',
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#fef3c7',
            marginBottom: '20px',
          }}>
            {activeTopic.summary}
          </div>

          {/* Detailed Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeTopic.bullets.map((point, idx) => {
              const [heading, ...rest] = point.split(':');
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(30, 16, 53, 0.4)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.15)',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: '#e5e7eb',
                  }}
                >
                  <strong style={{ color: '#fde047' }}>{heading}:</strong>
                  <span>{rest.join(':')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(30, 16, 53, 0.6)',
        }}>
          <button onClick={onClose} className="btn-festive" style={{ padding: '10px 24px' }}>
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
