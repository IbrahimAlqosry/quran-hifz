import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSurahList, TOTAL_AYAHS } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { ErrorBox, Loader } from '../components/Status';
import { normalizeArabic, toArabicDigits } from '../utils/arabic';

export default function Home() {
  const [reload, setReload] = useState(0);
  const { loading, error, data } = useAsync(getSurahList, [reload]);
  const { progress, stats } = useApp();
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');

  const list = useMemo(() => {
    if (!data) return [];
    const nq = normalizeArabic(q);
    return data.filter((s) => {
      if (type !== 'all' && s.revelationType !== type) return false;
      if (!q.trim()) return true;
      return (
        normalizeArabic(s.name).includes(nq) ||
        s.englishName.toLowerCase().includes(q.toLowerCase()) ||
        String(s.number) === q.trim()
      );
    });
  }, [data, q, type]);

  const percent = ((stats.memorized / TOTAL_AYAHS) * 100).toFixed(1);

  return (
    <>
      <div className="hero rounded-4 p-4 mb-4 text-white shadow-sm">
        <h1 className="h3 fw-bold mb-2">تحفيظ القرآن الكريم مع التفسير</h1>
        <p className="mb-3 opacity-75">
          اقرأ وتدبّر بتفاسير معتمدة، احفظ بالتكرار وإخفاء الآيات، ثم ثبّت حفظك بالمراجعة المتباعدة.
        </p>
        <div className="d-flex flex-wrap gap-3 small">
          <span className="badge bg-light text-dark p-2">المحفوظ: {toArabicDigits(stats.memorized)} آية ({toArabicDigits(percent)}٪)</span>
          <span className="badge bg-warning text-dark p-2">مستحق للمراجعة: {toArabicDigits(stats.due.length)}</span>
          {stats.due.length > 0 && (
            <Link to="/test" className="btn btn-sm btn-light">ابدأ المراجعة الآن</Link>
          )}
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="ابحث باسم السورة أو رقمها…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">كل السور</option>
            <option value="Meccan">المكية</option>
            <option value="Medinan">المدنية</option>
          </select>
        </div>
      </div>

      {loading && <Loader />}
      {error && <ErrorBox error={error} onRetry={() => setReload((r) => r + 1)} />}

      <div className="row g-3">
        {list.map((s) => {
          const done = Object.keys(progress[s.number] || {}).length;
          const pct = Math.round((done / s.numberOfAyahs) * 100);
          return (
            <div className="col-sm-6 col-lg-4" key={s.number}>
              <div className="card h-100 surah-card shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="surah-num">{toArabicDigits(s.number)}</span>
                    <div className="flex-grow-1">
                      <div className="quran-font fs-4 lh-sm">{s.name}</div>
                      <div className="small text-muted">
                        {s.englishName} · {s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} ·{' '}
                        {toArabicDigits(s.numberOfAyahs)} آية
                      </div>
                    </div>
                  </div>
                  <div className="progress mb-3" style={{ height: 6 }} title={`${pct}%`}>
                    <div className="progress-bar bg-success" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/surah/${s.number}`} className="btn btn-sm btn-outline-success flex-fill">
                      قراءة وتفسير
                    </Link>
                    <Link to={`/memorize/${s.number}`} className="btn btn-sm btn-success flex-fill">
                      حفظ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
