import type { UserSettings } from '../types/game';

const STORAGE_KEYS = {
  HIGH_SCORE: 'mushak_dash_high_score',
  TOTAL_MODAKS: 'mushak_dash_total_modaks',
  UNLOCKED_LEVEL: 'mushak_dash_unlocked_level',
  SETTINGS: 'mushak_dash_settings',
  ACHIEVEMENTS: 'mushak_dash_achievements',
};

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  musicEnabled: true,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  hapticFeedback: true,
};

// In-memory cache to prevent blocking disk I/O on 60 FPS gameplay loops
let cachedHighScore: number | null = null;
let cachedTotalModaks: number | null = null;
let cachedUnlockedLevel: number | null = null;
let cachedSettings: UserSettings | null = null;

let pendingSaveTimer: number | null = null;

function scheduleFlush() {
  if (pendingSaveTimer !== null) return;
  // Debounce writes using requestIdleCallback or setTimeout
  if (typeof window !== 'undefined') {
    pendingSaveTimer = window.setTimeout(() => {
      storage.flush();
      pendingSaveTimer = null;
    }, 1000);
  }
}

export const storage = {
  getHighScore(): number {
    if (cachedHighScore !== null) return cachedHighScore;
    try {
      const val = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      cachedHighScore = val ? parseInt(val, 10) : 0;
    } catch {
      cachedHighScore = 0;
    }
    return cachedHighScore;
  },

  saveHighScore(score: number): boolean {
    const current = this.getHighScore();
    if (score > current) {
      cachedHighScore = score;
      try {
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
      } catch {
        // ignore
      }
      return true; // new high score!
    }
    return false;
  },

  getTotalModaks(): number {
    if (cachedTotalModaks !== null) return cachedTotalModaks;
    try {
      const val = localStorage.getItem(STORAGE_KEYS.TOTAL_MODAKS);
      cachedTotalModaks = val ? parseInt(val, 10) : 0;
    } catch {
      cachedTotalModaks = 0;
    }
    return cachedTotalModaks;
  },

  addTotalModaks(amount: number): number {
    const current = this.getTotalModaks();
    const updated = current + amount;
    cachedTotalModaks = updated;
    scheduleFlush();
    return updated;
  },

  getUnlockedLevel(): number {
    if (cachedUnlockedLevel !== null) return cachedUnlockedLevel;
    try {
      const val = localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL);
      cachedUnlockedLevel = val ? parseInt(val, 10) : 1;
    } catch {
      cachedUnlockedLevel = 1;
    }
    return cachedUnlockedLevel;
  },

  unlockNextLevel(completedLevel: number): number {
    const current = this.getUnlockedLevel();
    const next = Math.max(current, Math.min(4, completedLevel + 1));
    cachedUnlockedLevel = next;
    try {
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVEL, next.toString());
    } catch {
      // ignore
    }
    return next;
  },

  getSettings(): UserSettings {
    if (cachedSettings !== null) return cachedSettings;
    let settings = DEFAULT_SETTINGS;
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (val) {
        settings = { ...DEFAULT_SETTINGS, ...JSON.parse(val) };
      }
    } catch {
      settings = DEFAULT_SETTINGS;
    }
    cachedSettings = settings;
    return settings;
  },

  saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    cachedSettings = updated;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  },

  flush() {
    try {
      if (cachedTotalModaks !== null) {
        localStorage.setItem(STORAGE_KEYS.TOTAL_MODAKS, cachedTotalModaks.toString());
      }
      if (cachedHighScore !== null) {
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, cachedHighScore.toString());
      }
    } catch {
      // ignore
    }
  },

  resetAll() {
    cachedHighScore = 0;
    cachedTotalModaks = 0;
    cachedUnlockedLevel = 1;
    cachedSettings = DEFAULT_SETTINGS;
    try {
      localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
      localStorage.removeItem(STORAGE_KEYS.TOTAL_MODAKS);
      localStorage.removeItem(STORAGE_KEYS.UNLOCKED_LEVEL);
    } catch {
      // ignore
    }
  },
};
