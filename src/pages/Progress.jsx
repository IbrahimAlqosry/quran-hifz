import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSurahList, TOTAL_AYAHS } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';

export default function Progress() {
  const { progress, setProgress, stats } = useApp();
  const { t, num, lang } = useT();
  const [confirmReset, setConfirmReset] = useState(false);
  const { data: surahs } = useAsync(getSurahList, []);
  const fileRef = useRef(null);
  const [msg, setMsg] = useState(null);

  const now = Date.now();
  const rows = Object.entries(progress)
    .map(([s, ayahs]) => {
      const recs = Object.values(ayahs);
      const info = surahs?.find((x) => x.number === Number(s));
      return {
        n: Number(s),
        name: info ? (lang === 'ar' ? info.name : `${info.englishName} (${info.name})`) : `#${s}`,
        total: info?.numberOfAyahs || recs.length,
        count: recs.length,
        due: recs.filter((r) => r.due <= now).length,
        avgLevel: Math.round(recs.reduce((sum, r) => sum + r.box, 0) / recs.length),
      };
    })
    .sort((a, b) => a.n - b.n);

  const pct = (stats.memorized / TOTAL_AYAHS) * 100;
  const completeSurahs = rows.filter((r) => r.count >= r.total).length;

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ version: 1, progress }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hifz-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      if (!json.progress || typeof json.progress !== 'object') throw new Error();
      setProgress(json.progress);
      setMsg({ type: 'success', text: t('importOk') });
    } catch {
      setMsg({ type: 'danger', text: t('importBad') });
    }
    e.target.value = '';
  };

  const reset = () => {
    setProgress({});
    setConfirmReset(false);
  };

  return (
    <>
      <h2 className="h4 mb-3 page-title">{t('nav.progress')}</h2>

      <div className="row g-3 mb-4">
        {[
          [t('statMemorized'), stats.memorized, 'success'],
          [t('statComplete'), completeSurahs, 'primary'],
          [t('statStarted'), stats.surahsStarted, 'info'],
          [t('statDue'), stats.due.length, 'warning'],
        ].map(([label, val, color]) => (
          <div className="col-6 col-md-3" key={label}>
            <div className={`card text-center border-${color} shadow-sm h-100`}>
              <div className="card-body">
                <div className={`fs-2 fw-bold text-${color}`}>{num(val)}</div>
                <div className="small text-muted">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-body shadow-sm mb-4">
        <div className="d-flex justify-content-between mb-1">
          <span>{t('quranPercent')}</span>
          <strong>{num(pct.toFixed(2))}%</strong>
        </div>
        <div className="progress" style={{ height: 14 }}>
          <div className="progress-bar bg-success" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="alert alert-info">
          {t('noRecord')} <Link to="/memorize/1">{t('nav.memorize')}</Link>
        </div>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-hover align-middle bg-white shadow-sm">
            <thead className="table-light">
              <tr>
                <th>{t('surah')}</th>
                <th style={{ minWidth: 160 }}>{t('memorized')}</th>
                <th>{t('level')}</th>
                <th>{t('statDue')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.n}>
                  <td className="fw-semibold">{r.name}</td>
                  <td>
                    <div className="small">{num(r.count)} / {num(r.total)}</div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className="progress-bar bg-success" style={{ width: `${(r.count / r.total) * 100}%` }} />
                    </div>
                  </td>
                  <td><span className="badge bg-secondary">{t('lvl.' + r.avgLevel)}</span></td>
                  <td>{r.due ? <span className="badge bg-warning text-dark">{num(r.due)}</span> : '—'}</td>
                  <td className="text-nowrap">
                    <Link to={`/memorize/${r.n}`} className="btn btn-sm btn-outline-success">{t('continueMemorize')}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card card-body shadow-sm">
        <h3 className="h6">{t('backup')}</h3>
        <p className="small text-muted">{t('backupText')}</p>
        {msg && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary" onClick={exportData}>{t('export')}</button>
          <button className="btn btn-outline-secondary" onClick={() => fileRef.current?.click()}>{t('import')}</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importData} />
          {confirmReset ? (
            <span className="ms-auto d-flex gap-2 align-items-center">
              <span className="small text-danger">{t('confirmReset')}</span>
              <button className="btn btn-danger btn-sm" onClick={reset}>{t('yes')}</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmReset(false)}>{t('no')}</button>
            </span>
          ) : (
            <button className="btn btn-outline-danger ms-auto" onClick={() => setConfirmReset(true)}>{t('resetRecord')}</button>
          )}
        </div>
      </div>
    </>
  );
}
