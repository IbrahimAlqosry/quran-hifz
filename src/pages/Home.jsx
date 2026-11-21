import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSurahList, TOTAL_AYAHS } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import { ErrorBox, Loader } from '../components/Status';
import DailyAyah from '../components/DailyAyah';
import TodayPanel from '../components/TodayPanel';
import { normalizeArabic } from '../utils/arabic';

const TILES = [
  ['/prayer', '🕌', 'nav.prayer'],
  ['/mushaf/1', '📗', 'nav.mushaf'],
  ['/khatma', '📅', 'nav.khatma'],
  ['/hadith', '📜', 'nav.hadith'],
  ['/names', '✨', 'nav.names'],
  ['/prophets', '📖', 'nav.prophets'],
  ['/adhkar', '📿', 'nav.adhkar'],
  ['/duas', '🤲', 'nav.duas'],
  ['/hajj', '🕋', 'nav.hajj'],
  ['/tasbeeh', '🔢', 'nav.tasbeeh'],
  ['/search', '🔍', 'nav.search'],
  ['/zakat', '💰', 'nav.zakat'],
  ['/sadaqah', '🐑', 'nav.sadaqah'],
];

export default function Home() {
  const [reload, setReload] = useState(0);
  const { loading, error, data } = useAsync(getSurahList, [reload]);
  const { progress, stats, settings } = useApp();
  const { t, num, lang } = useT();
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');

  const list = useMemo(() => {
    if (!data) return [];
    const nq = normalizeArabic(q);
    const lq = q.trim().toLowerCase();
    return data.filter((s) => {
      if (type !== 'all' && s.revelationType !== type) return false;
      if (!lq) return true;
      return (
        (nq && normalizeArabic(s.name).includes(nq)) ||
        s.englishName.toLowerCase().includes(lq) ||
        s.englishNameTranslation.toLowerCase().includes(lq) ||
        String(s.number) === lq
      );
    });
  }, [data, q, type]);

  const percent = ((stats.memorized / TOTAL_AYAHS) * 100).toFixed(1);
  const last = settings.lastRead;
  const lastSurah = last && data?.find((s) => s.number === last.surah);

  return (
    <>
      <TodayPanel />

      <div className="hero rounded-4 p-4 mb-4 text-white shadow-sm d-none d-lg-block">
        <h1 className="h3 fw-bold mb-2">{t('heroTitle')}</h1>
        <p className="mb-3 opacity-75">{t('heroText')}</p>
        <div className="d-flex flex-wrap gap-2 small align-items-center">
          <span className="badge bg-light text-dark p-2">{t('memorizedBadge', { n: num(stats.memorized), p: num(percent) })}</span>
          <span className="badge bg-warning text-dark p-2">{t('dueBadge', { n: num(stats.due.length) })}</span>
          {stats.due.length > 0 && <Link to="/test" className="btn btn-sm btn-light">{t('startReview')}</Link>}
          {lastSurah && (
            <Link to={`/surah/${last.surah}?a=${last.ayah}`} className="btn btn-sm btn-outline-light">
              📌 {t('continueReading')}: {lang === 'ar' ? lastSurah.name : lastSurah.englishName} ({num(last.ayah)})
            </Link>
          )}
        </div>
      </div>

      <h2 className="section-label">{t('sections')}</h2>
      <div className="row g-2 mb-4">
        {TILES.map(([to0, icon, key]) => { const to = key === 'nav.mushaf' ? `/mushaf/${settings.lastPage || 1}` : to0; return (
          <div className="col-3 col-md-2 col-xl-1-5" key={to}>
            <Link to={to} className="card tile text-center text-decoration-none h-100 shadow-sm">
              <div className="card-body p-2">
                <div className="fs-3">{icon}</div>
                <div className="small fw-semibold">{t(key)}</div>
              </div>
            </Link>
          </div>
        ); })}
      </div>

      <DailyAyah />

      <h2 className="section-label mt-2">{t('surahIndex')}</h2>
      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input className="form-control" placeholder={t('searchSurah')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">{t('allSurahs')}</option>
            <option value="Meccan">{t('meccan')}</option>
            <option value="Medinan">{t('medinan')}</option>
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
                    <span className="surah-num">{num(s.number)}</span>
                    <div className="flex-grow-1">
                      <div className="quran-font fs-4 lh-sm" dir="rtl">{s.name}</div>
                      <div className="small text-muted">
                        {lang !== 'ar' && <>{s.englishName} ({s.englishNameTranslation}) · </>}
                        {s.revelationType === 'Meccan' ? t('meccanOne') : t('medinanOne')} · {t('ayahsCount', { n: num(s.numberOfAyahs) })}
                      </div>
                    </div>
                  </div>
                  <div className="progress mb-3" style={{ height: 6 }} title={`${pct}%`}>
                    <div className="progress-bar bg-success" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/surah/${s.number}`} className="btn btn-sm btn-outline-success flex-fill">{t('readTafsir')}</Link>
                    <Link to={`/memorize/${s.number}`} className="btn btn-sm btn-success flex-fill">{t('memorize')}</Link>
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
