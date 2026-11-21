import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const DAY = 24 * 60 * 60 * 1000;

// نظام المراجعة المتباعدة (صناديق لايتنر): عدد الأيام حتى المراجعة التالية لكل مستوى
export const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];
export const LEVEL_NAMES = ['جديد', 'بداية', 'قيد التثبيت', 'جيد', 'جيد جدًا', 'متقن', 'راسخ', 'راسخ جدًا'];

const AppContext = createContext(null);

const DEFAULT_SETTINGS = {
  tafsir: 'ar.muyassar',
  reciter: 'ar.husary',
  fontSize: 30,
};

export function AppProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('hifz:settings', DEFAULT_SETTINGS);
  // progress = { [surah]: { [ayah]: { box, due, at, last } } }
  const [progress, setProgress] = useLocalStorage('hifz:progress', {});

  const updateSettings = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), [setSettings]);

  const markMemorized = useCallback(
    (surah, ayahs) =>
      setProgress((prev) => {
        const s = { ...(prev[surah] || {}) };
        const now = Date.now();
        ayahs.forEach((a) => {
          if (!s[a]) s[a] = { box: 1, due: now + DAY, at: now };
        });
        return { ...prev, [surah]: s };
      }),
    [setProgress]
  );

  const unmark = useCallback(
    (surah, ayah) =>
      setProgress((prev) => {
        const s = { ...(prev[surah] || {}) };
        delete s[ayah];
        const next = { ...prev, [surah]: s };
        if (!Object.keys(s).length) delete next[surah];
        return next;
      }),
    [setProgress]
  );

  /** q: 'good' أتقنت | 'hard' تعثرت | 'again' لم أحفظ */
  const grade = useCallback(
    (surah, ayah, q) =>
      setProgress((prev) => {
        const s = { ...(prev[surah] || {}) };
        const now = Date.now();
        const cur = s[ayah] || { box: 0, at: now };
        let box;
        let days;
        if (q === 'good') {
          box = Math.min(cur.box + 1, INTERVALS.length - 1);
          days = INTERVALS[box];
        } else if (q === 'hard') {
          box = Math.max(1, cur.box);
          days = 1;
        } else {
          box = 1;
          days = 0;
        }
        s[ayah] = { ...cur, box, due: now + days * DAY, last: now };
        return { ...prev, [surah]: s };
      }),
    [setProgress]
  );

  const stats = useMemo(() => {
    const now = Date.now();
    let memorized = 0;
    const due = [];
    Object.entries(progress).forEach(([surah, ayahs]) => {
      Object.entries(ayahs).forEach(([ayah, rec]) => {
        memorized++;
        if (rec.due <= now) due.push({ surah: Number(surah), ayah: Number(ayah) });
      });
    });
    return { memorized, due, surahsStarted: Object.keys(progress).length };
  }, [progress]);

  const value = {
    settings,
    updateSettings,
    progress,
    setProgress,
    markMemorized,
    unmark,
    grade,
    stats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
