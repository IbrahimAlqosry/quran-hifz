import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TOTAL_PAGES } from '../api/quran';
import useLocalStorage from '../hooks/useLocalStorage';
import { useT } from '../i18n';

const DAY = 86400000;
const PRESETS = [7, 10, 15, 30, 60, 90, 120, 365];
const startOfDay = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };

export default function Khatma() {
  const { t, num } = useT();
  const [plan, setPlan] = useLocalStorage('hifz:khatma', null);
  const [days, setDays] = useState(30);
  const [custom, setCustom] = useState('');
  const [completed, setCompleted] = useLocalStorage('hifz:khatmaCount', 0);

  const start = () => {
    const d = Number(custom) > 0 ? Math.min(1000, Number(custom)) : days;
    setPlan({ days: d, start: startOfDay(), done: [] });
  };

  if (!plan) {
    return (
      <div className="mx-auto" style={{ maxWidth: 560 }}>
        <h2 className="h4 mb-2 page-title">📅 {t('nav.khatma')}</h2>
        <p className="text-muted">{t('khatmaIntro')}</p>
        {completed > 0 && <div className="alert alert-success">{t('khatmaCompleted', { n: num(completed) })}</div>}
        <div className="card card-body shadow-sm">
          <label className="form-label">{t('khatmaDays')}</label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {PRESETS.map((d) => (
              <button key={d} className={'btn btn-sm ' + (days === d && !custom ? 'btn-success' : 'btn-outline-success')} onClick={() => { setDays(d); setCustom(''); }}>
                {t('daysN', { n: num(d) })}
              </button>
            ))}
          </div>
          <input type="number" min="1" className="form-control mb-2" placeholder={t('customDays')} value={custom} onChange={(e) => setCustom(e.target.value)} />
          <div className="small text-muted mb-3">
            {t('pagesPerDay', { n: num(Math.ceil(TOTAL_PAGES / (Number(custom) > 0 ? Number(custom) : days))) })}
          </div>
          <button className="btn btn-success" onClick={start}>{t('startKhatma')}</button>
        </div>
      </div>
    );
  }

  const per = TOTAL_PAGES / plan.days;
  const range = (d) => [Math.floor(d * per) + 1, Math.min(TOTAL_PAGES, Math.floor((d + 1) * per))];
  const today = Math.min(plan.days - 1, Math.max(0, Math.floor((startOfDay() - plan.start) / DAY)));
  const doneSet = new Set(plan.done);
  const pagesDone = plan.done.reduce((s, d) => { const [a, b] = range(d); return s + (b - a + 1); }, 0);
  const pct = Math.round((pagesDone / TOTAL_PAGES) * 100);
  const behind = Array.from({ length: today }, (_, i) => i).filter((d) => !doneSet.has(d)).length;
  const toggle = (d) => setPlan((p) => ({ ...p, done: doneSet.has(d) ? p.done.filter((x) => x !== d) : [...p.done, d] }));
  const finished = plan.done.length >= plan.days;

  return (
    <div className="mx-auto" style={{ maxWidth: 760 }}>
      <h2 className="h4 mb-3 page-title">📅 {t('nav.khatma')}</h2>
      <div className="card card-body shadow-sm mb-3">
        <div className="d-flex justify-content-between small mb-1">
          <span>{t('khatmaProgress', { d: num(plan.done.length), n: num(plan.days) })}</span>
          <strong>{num(pct)}%</strong>
        </div>
        <div className="progress mb-3" style={{ height: 10 }}><div className="progress-bar bg-success" style={{ width: `${pct}%` }} /></div>
        {finished ? (
          <div className="alert alert-success text-center mb-0">
            {t('khatmaDone')} 🤍
            <div className="mt-2">
              <button className="btn btn-success btn-sm" onClick={() => { setCompleted((c) => c + 1); setPlan(null); }}>{t('newKhatma')}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="today-wird p-3 rounded-3 mb-2">
              <div className="small text-muted">{t('todayWird')} — {t('dayN', { n: num(today + 1) })}</div>
              <div className="fs-5 fw-bold">{t('pagesRange', { a: num(range(today)[0]), b: num(range(today)[1]) })}</div>
              <div className="d-flex gap-2 mt-2">
                <Link to={`/mushaf/${range(today)[0]}`} className="btn btn-success btn-sm">📖 {t('readNow')}</Link>
                <button className={'btn btn-sm ' + (doneSet.has(today) ? 'btn-secondary' : 'btn-outline-success')} onClick={() => toggle(today)}>
                  {doneSet.has(today) ? `✓ ${t('done')}` : t('markDone')}
                </button>
              </div>
            </div>
            {behind > 0 && <div className="alert alert-warning py-2 small mb-0">{t('behind', { n: num(behind) })}</div>}
          </>
        )}
      </div>

      <div className="row g-2">
        {Array.from({ length: plan.days }, (_, d) => {
          const [a, b] = range(d);
          return (
            <div className="col-4 col-md-3 col-lg-2" key={d}>
              <button className={'btn w-100 btn-sm khatma-day ' + (doneSet.has(d) ? 'btn-success' : d === today ? 'btn-warning' : d < today ? 'btn-outline-danger' : 'btn-outline-secondary')} onClick={() => toggle(d)}>
                <div className="fw-bold">{num(d + 1)}</div>
                <div className="small">{num(a)}–{num(b)}</div>
              </button>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-3">
        <button className="btn btn-link text-danger btn-sm" onClick={() => setPlan(null)}>{t('cancelKhatma')}</button>
      </div>
    </div>
  );
}
