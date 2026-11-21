import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useT } from '../i18n';

const PHRASES = [
  { ar: 'سُبْحَانَ اللَّهِ', en: 'Glory be to Allah' },
  { ar: 'الْحَمْدُ لِلَّهِ', en: 'Praise be to Allah' },
  { ar: 'اللَّهُ أَكْبَرُ', en: 'Allah is the Greatest' },
  { ar: 'لَا إِلَهَ إِلَّا اللَّهُ', en: 'None has the right to be worshipped but Allah' },
  { ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', en: 'Glory and praise be to Allah; glory be to Allah the Almighty' },
  { ar: 'أَسْتَغْفِرُ اللَّهَ', en: 'I seek the forgiveness of Allah' },
  { ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', en: 'There is no might nor power except with Allah' },
  { ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', en: 'O Allah, send blessings upon Muhammad' },
];
const TARGETS = [33, 99, 100, 1000, 0];

export default function Tasbeeh() {
  const { t, num, lang } = useT();
  const [state, setState] = useLocalStorage('hifz:tasbeeh', { phrase: 0, target: 33, count: 0, laps: 0, total: 0, day: '' });
  const [pulse, setPulse] = useState(false);

  const today = new Date().toDateString();
  const todayTotal = state.day === today ? state.total : 0;

  const tap = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 120);
    setState((s) => {
      const total = (s.day === today ? s.total : 0) + 1;
      let count = s.count + 1;
      let laps = s.laps;
      if (s.target && count >= s.target) {
        try { navigator.vibrate?.([60, 80, 60]); } catch { /* */ }
        count = 0;
        laps++;
      } else {
        try { navigator.vibrate?.(10); } catch { /* */ }
      }
      return { ...s, count, laps, total, day: today };
    });
  };

  const p = PHRASES[state.phrase] || PHRASES[0];

  return (
    <div className="mx-auto text-center" style={{ maxWidth: 480 }}>
      <h2 className="h4 mb-3">🔢 {t('nav.tasbeeh')}</h2>

      <select className="form-select mb-2" dir="rtl" value={state.phrase} onChange={(e) => setState((s) => ({ ...s, phrase: Number(e.target.value), count: 0, laps: 0 }))}>
        {PHRASES.map((x, i) => <option key={i} value={i}>{x.ar}</option>)}
      </select>
      <div className="btn-group w-100 mb-3" role="group">
        {TARGETS.map((x) => (
          <button key={x} className={'btn btn-sm ' + (state.target === x ? 'btn-success' : 'btn-outline-success')}
            onClick={() => setState((s) => ({ ...s, target: x, count: 0, laps: 0 }))}>
            {x ? num(x) : '∞'}
          </button>
        ))}
      </div>

      <div className="dhikr-text fs-3 mb-1" dir="rtl">{p.ar}</div>
      {lang !== 'ar' && <div className="small text-muted mb-3">{p.en}</div>}

      <button className={'tasbeeh-btn shadow' + (pulse ? ' pulse' : '')} onClick={tap} aria-label="count">
        <span className="tasbeeh-count">{num(state.count)}</span>
        {state.target > 0 && <span className="tasbeeh-target">/ {num(state.target)}</span>}
      </button>

      <div className="d-flex justify-content-center gap-4 mt-3 small">
        <span>{t('laps')}: <strong>{num(state.laps)}</strong></span>
        <span>{t('todayTotal')}: <strong>{num(todayTotal)}</strong></span>
      </div>
      <button className="btn btn-outline-secondary btn-sm mt-3" onClick={() => setState((s) => ({ ...s, count: 0, laps: 0 }))}>{t('reset')}</button>
    </div>
  );
}
