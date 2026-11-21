import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSurahList, TOTAL_AYAHS } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { LEVEL_NAMES, useApp } from '../context/AppContext';
import { toArabicDigits } from '../utils/arabic';

export default function Progress() {
  const { progress, setProgress, stats } = useApp();
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
        name: info?.name || `سورة ${s}`,
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
      setMsg({ type: 'success', text: 'تمت استعادة النسخة الاحتياطية بنجاح.' });
    } catch {
      setMsg({ type: 'danger', text: 'الملف غير صالح.' });
    }
    e.target.value = '';
  };

  const reset = () => {
    if (window.confirm('هل تريد حذف كل سجل الحفظ؟ لا يمكن التراجع.')) setProgress({});
  };

  return (
    <>
      <h2 className="h4 mb-3">تقدّمي في الحفظ</h2>

      <div className="row g-3 mb-4">
        {[
          ['آيات محفوظة', stats.memorized, 'success'],
          ['سور مكتملة', completeSurahs, 'primary'],
          ['سور بدأتها', stats.surahsStarted, 'info'],
          ['مستحق للمراجعة', stats.due.length, 'warning'],
        ].map(([label, val, color]) => (
          <div className="col-6 col-md-3" key={label}>
            <div className={`card text-center border-${color} shadow-sm h-100`}>
              <div className="card-body">
                <div className={`fs-2 fw-bold text-${color}`}>{toArabicDigits(val)}</div>
                <div className="small text-muted">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-body shadow-sm mb-4">
        <div className="d-flex justify-content-between mb-1">
          <span>نسبة حفظ القرآن الكريم</span>
          <strong>{toArabicDigits(pct.toFixed(2))}٪</strong>
        </div>
        <div className="progress" style={{ height: 14 }}>
          <div className="progress-bar bg-success" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="alert alert-info">
          لا يوجد سجل بعد. <Link to="/memorize/1">ابدأ الحفظ</Link>
        </div>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-hover align-middle bg-white shadow-sm">
            <thead className="table-light">
              <tr>
                <th>السورة</th>
                <th style={{ minWidth: 160 }}>المحفوظ</th>
                <th>مستوى التثبيت</th>
                <th>مستحق</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.n}>
                  <td className="quran-font fs-5">{r.name}</td>
                  <td>
                    <div className="small">{toArabicDigits(r.count)} / {toArabicDigits(r.total)}</div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className="progress-bar bg-success" style={{ width: `${(r.count / r.total) * 100}%` }} />
                    </div>
                  </td>
                  <td><span className="badge bg-secondary">{LEVEL_NAMES[r.avgLevel]}</span></td>
                  <td>{r.due ? <span className="badge bg-warning text-dark">{toArabicDigits(r.due)}</span> : '—'}</td>
                  <td className="text-nowrap">
                    <Link to={`/memorize/${r.n}`} className="btn btn-sm btn-outline-success">متابعة الحفظ</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card card-body shadow-sm">
        <h3 className="h6">النسخ الاحتياطي</h3>
        <p className="small text-muted">
          يُحفظ سجلّك في هذا المتصفح فقط. صدّر نسخة احتياطية لتنقلها إلى جهاز آخر.
        </p>
        {msg && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary" onClick={exportData}>تصدير</button>
          <button className="btn btn-outline-secondary" onClick={() => fileRef.current?.click()}>استيراد</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importData} />
          <button className="btn btn-outline-danger ms-auto" onClick={reset}>مسح السجل</button>
        </div>
      </div>
    </>
  );
}
