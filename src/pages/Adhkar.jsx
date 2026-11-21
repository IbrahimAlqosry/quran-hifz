import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ADHKAR_CATS, getAdhkar } from '../data/adhkar';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import QuranPassage from '../components/QuranPassage';

export default function Adhkar() {
  const { settings } = useApp();
  const { t, num, pick, lang } = useT();
  const [params, setParams] = useSearchParams();
  const def = new Date().getHours() < 14 ? 'morning' : 'evening';
  const cat = ADHKAR_CATS.includes(params.get('c')) ? params.get('c') : def;
  const items = getAdhkar(cat);
  const [done, setDone] = useState({});

  useEffect(() => setDone({}), [cat]);

  const tap = (it) =>
    setDone((d) => {
      const c = d[it.id] || 0;
      if (c >= it.count) return d;
      try {
        navigator.vibrate?.(c + 1 === it.count ? [40, 60, 40] : 12);
      } catch {
        /* غير مدعوم */
      }
      return { ...d, [it.id]: c + 1 };
    });

  const completed = items.filter((it) => (done[it.id] || 0) >= it.count).length;
  const pct = Math.round((completed / items.length) * 100);

  return (
    <>
      <h2 className="h4 mb-3">📿 {t('nav.adhkar')}</h2>

      <ul className="nav nav-pills mb-3 flex-nowrap overflow-auto">
        {ADHKAR_CATS.map((c) => (
          <li className="nav-item" key={c}>
            <button className={'nav-link text-nowrap' + (c === cat ? ' active' : '')} onClick={() => setParams({ c })}>
              {t('adhkar.' + c)}
            </button>
          </li>
        ))}
      </ul>

      <div className="sticky-progress mb-3">
        <div className="d-flex justify-content-between small mb-1">
          <span>{t('adhkarProgress', { c: num(completed), n: num(items.length) })}</span>
          <button className="btn btn-link btn-sm p-0" onClick={() => setDone({})}>{t('reset')}</button>
        </div>
        <div className="progress" style={{ height: 6 }}>
          <div className="progress-bar bg-success" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="small text-muted">{t('tapToCount')}</p>

      <div className="vstack gap-3">
        {items.map((it) => {
          const c = done[it.id] || 0;
          const finished = c >= it.count;
          const text = cat === 'evening' && it.textE ? it.textE : it.text;
          return (
            <div key={it.id} className={'card dhikr-card shadow-sm' + (finished ? ' dhikr-done' : '')} role="button" onClick={() => tap(it)}>
              <div className="card-body">
                {it.q ? (
                  it.q.map((p) => <QuranPassage key={`${p.s}:${p.from}`} {...p} basmala={it.basmala} />)
                ) : (
                  <p className="dhikr-text mb-2" dir="rtl" style={{ fontSize: settings.fontSize * 0.75 }}>{text}</p>
                )}
                {lang !== 'ar' && it.en && <p className="translation-text">{it.en}</p>}
                {it.fadl && <div className="fadl small mb-2">💡 {pick(it.fadl)}</div>}
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small text-muted">📚 {pick(it.src)}</span>
                  <span className={'counter-pill ' + (finished ? 'bg-success' : 'bg-quran')}>
                    {finished ? '✓' : `${num(it.count - c)}`}
                    {!finished && it.count > 1 && <small className="opacity-75"> / {num(it.count)}</small>}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {completed === items.length && (
        <div className="alert alert-success text-center mt-4">{t('adhkarDone')} 🤍</div>
      )}
    </>
  );
}
