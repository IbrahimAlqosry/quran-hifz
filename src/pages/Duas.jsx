import { useState } from 'react';
import { QURAN_DUAS, SUNNAH_DUAS } from '../data/duas';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import QuranPassage from '../components/QuranPassage';

export default function Duas() {
  const { settings } = useApp();
  const { t, pick, lang } = useT();
  const [tab, setTab] = useState('quran');
  const [copied, setCopied] = useState(null);

  const copy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* غير مدعوم */
    }
  };

  return (
    <>
      <h2 className="h4 mb-3 page-title">🤲 {t('nav.duas')}</h2>
      <ul className="nav nav-pills mb-3">
        {['quran', 'sunnah'].map((k) => (
          <li className="nav-item" key={k}>
            <button className={'nav-link' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{t('duas.' + k)}</button>
          </li>
        ))}
      </ul>

      <div className="vstack gap-3">
        {tab === 'quran' &&
          QURAN_DUAS.map((d) => (
            <div key={`${d.s}:${d.from}`} className="card shadow-sm">
              <div className="card-body">
                <QuranPassage {...d} showRef />
              </div>
            </div>
          ))}

        {tab === 'sunnah' &&
          SUNNAH_DUAS.map((d) => (
            <div key={d.id} className="card shadow-sm">
              <div className="card-body">
                <h3 className="h6 fw-bold text-success">{pick(d.title)}</h3>
                <p className="dhikr-text mb-2" dir="rtl" style={{ fontSize: settings.fontSize * 0.75 }}>{d.text}</p>
                {lang !== 'ar' && <p className="translation-text">{d.en}</p>}
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small text-muted">📚 {pick(d.src)}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => copy(d.id, d.text)}>
                    {copied === d.id ? '✓' : t('copy')}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
