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
  ['/mushaf/1', '📗', 'nav.mushaf'],
  ['/memorize/1', '🧠', 'nav.memorize'],
  ['/prayer', '🕌', 'nav.prayer'],
  ['/adhkar', '📿', 'nav.adhkar'],
  ['/prophets', '🎧', 'nav.prophets'],
  ['/hadith', '📜', 'nav.hadith'],
  ['/duas', '🤲', 'nav.duas'],
  ['/zakat', '💰', 'nav.zakat'],
  ['/hajj', '🕋', 'nav.hajj'],
  ['/tasbeeh', '🔢', 'nav.tasbeeh'],
  ['/names', '✨', 'nav.names'],
  ['/more', '☰', 'nav.more'],
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

      <h2 className="section-label">{t('sections')}</h2>
      <div className="app-grid home-grid mb-4">
        {TILES.map(([to0, icon, key]) => {
          const to = key === 'nav.mushaf' ? `/mushaf/${settings.lastPage || 1}` : to0;
          return (
            <Link key={key} to={to} className={'app-grid-item' + (key === 'nav.more' ? ' d-lg-none' : '')}>
              <span className="app-grid-icon">{icon}</span>
              <span className="app-grid-label">{t(key)}</span>
            </Link>
          );
        })}
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

      <div className="surah-list">
        {list.map((s) => {
          const done = Object.keys(progress[s.number] || {}).length;
          const pct = Math.round((done / s.numberOfAyahs) * 100);
          return (
            <div className="surah-row" key={s.number}>
              <Link to={`/surah/${s.number}`} className="surah-row-main">
                <span className="surah-star"><span>{num(s.number)}</span></span>
                <span className="flex-grow-1 min-w-0">
                  <span className="d-block fw-bold">{lang === 'ar' ? s.name.replace(/^سُورَةُ\s*/, '') : s.englishName}</span>
                  <span className="d-block small text-muted text-truncate">
                    {lang !== 'ar' && <>{s.englishNameTranslation} · </>}
                    {s.revelationType === 'Meccan' ? t('meccanOne') : t('medinanOne')} · {t('ayahsCount', { n: num(s.numberOfAyahs) })}
                  </span>
                  {pct > 0 && <span className="surah-progress"><span style={{ width: `${pct}%` }} /></span>}
                </span>
                {lang !== 'ar' && <span className="quran-font fs-4 text-success" dir="rtl">{s.name.replace(/^سُورَةُ\s*/, '')}</span>}
              </Link>
              <Link to={`/memorize/${s.number}`} className="surah-row-btn" title={t('memorize')}>🧠</Link>
            </div>
          );
        })}
      </div>
      <div className="father-dua text-center my-4">🤲 {t('fatherDua')}</div>
    </>
  );
}
