import { useState } from 'react';
import { PROPHETS } from '../data/prophets';
import { useT } from '../i18n';
import QuranPassage from '../components/QuranPassage';

export default function Prophets() {
  const { t, num, pick, lang } = useT();
  const [open, setOpen] = useState(null);

  return (
    <>
      <h2 className="h4 mb-2">📖 {t('nav.prophets')}</h2>
      <p className="small text-muted">{t('prophetsIntro')}</p>
      <div className="vstack gap-2">
        {PROPHETS.map((p, i) => (
          <div className="card shadow-sm" key={i}>
            <button className="card-header step-head d-flex align-items-center gap-2 text-start" onClick={() => setOpen(open === i ? null : i)}>
              <span className="step-num">{num(i + 1)}</span>
              <span className="fw-bold flex-grow-1">{lang === 'ar' ? p.ar : `${p.en} — ${p.ar}`}</span>
              <span>{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="card-body">
                <p className="mb-3" style={{ lineHeight: 1.9 }}>{pick(p.bio)}</p>
                <div className="small text-muted mb-1">{t('fromQuran')}</div>
                {p.refs.map((r) => (
                  <div className="dhikr-box mb-2" key={`${r.s}:${r.from}`}><QuranPassage {...r} showRef /></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
