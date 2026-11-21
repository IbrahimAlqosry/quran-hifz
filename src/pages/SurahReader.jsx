import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getSurah, getTafsir, getTranslation, TAFSIRS } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import SettingsBar from '../components/SettingsBar';
import AyahMarker from '../components/AyahMarker';
import { ErrorBox, Loader } from '../components/Status';

export default function SurahReader() {
  const n = Math.min(114, Math.max(1, Number(useParams().n) || 1));
  const [params] = useSearchParams();
  const target = Number(params.get('a')) || null;
  const { settings, updateSettings, progress, markMemorized, unmark } = useApp();
  const { t, num, pick, lang, dir } = useT();
  const [reload, setReload] = useState(0);
  const surah = useAsync(() => getSurah(n, settings.reciter), [n, settings.reciter, reload]);

  const [showAll, setShowAll] = useState(false);
  const [openTafsir, setOpenTafsir] = useState({});
  const needTafsir = showAll || Object.values(openTafsir).some(Boolean);
  const tafsir = useAsync(
    () => (needTafsir ? getTafsir(n, settings.tafsir) : Promise.resolve(null)),
    [n, settings.tafsir, needTafsir]
  );
  const tafsirInfo = TAFSIRS.find((x) => x.id === settings.tafsir);

  const showTrans = Boolean(settings.translation && settings.showTranslation);
  const translation = useAsync(
    () => (showTrans ? getTranslation(n, settings.translation) : Promise.resolve(null)),
    [n, settings.translation, showTrans]
  );

  // مشغل الصوت
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(null);
  const [continuous, setContinuous] = useState(false);

  useEffect(() => {
    setOpenTafsir({});
    setPlaying(null);
    audioRef.current?.pause();
    updateSettings({ lastRead: { surah: n, ayah: target || 1 } });
  }, [n]); // eslint-disable-line react-hooks/exhaustive-deps

  // الانتقال لآية محددة (?a=)
  useEffect(() => {
    if (!surah.data || !target) return;
    const el = document.getElementById(`ayah-${target}`);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  }, [surah.data, target]);

  const remember = (ayah) => updateSettings({ lastRead: { surah: n, ayah } });

  const playAyah = (ayahNum, cont = false) => {
    const a = surah.data?.ayahs[ayahNum - 1];
    const el = audioRef.current;
    if (!a || !el) return;
    setContinuous(cont);
    setPlaying(ayahNum);
    remember(ayahNum);
    el.src = a.audio;
    el.play().catch(() => setPlaying(null));
    document.getElementById(`ayah-${ayahNum}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const stop = () => {
    audioRef.current?.pause();
    setPlaying(null);
  };

  const onEnded = () => {
    if (continuous && playing && playing < surah.data.numberOfAyahs) playAyah(playing + 1, true);
    else setPlaying(null);
  };

  const mem = progress[n] || {};
  const prevArrow = dir === 'rtl' ? '→' : '←';
  const nextArrow = dir === 'rtl' ? '←' : '→';

  return (
    <>
      <audio ref={audioRef} onEnded={onEnded} preload="none" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        {n > 1 ? <Link to={`/surah/${n - 1}`} className="btn btn-sm btn-outline-secondary">{prevArrow} {t('prev')}</Link> : <span />}
        <Link to={`/memorize/${n}`} className="btn btn-sm btn-success">{t('memorizeThis')}</Link>
        {n < 114 ? <Link to={`/surah/${n + 1}`} className="btn btn-sm btn-outline-secondary">{t('next')} {nextArrow}</Link> : <span />}
      </div>

      <SettingsBar />

      {surah.loading && <Loader />}
      {surah.error && <ErrorBox error={surah.error} onRetry={() => setReload((r) => r + 1)} />}

      {surah.data && (
        <>
          <div className="text-center mb-3">
            <h2 className="quran-font surah-title" dir="rtl">{surah.data.name}</h2>
            {lang !== 'ar' && <div className="fw-semibold">{surah.data.englishName} — {surah.data.englishNameTranslation}</div>}
            <div className="text-muted small">
              {surah.data.revelationType === 'Meccan' ? t('meccanOne') : t('medinanOne')} · {t('ayahsCount', { n: num(surah.data.numberOfAyahs) })} · {t('juz')} {num(surah.data.ayahs[0].juz)}
            </div>
            <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
              {playing ? (
                <button className="btn btn-sm btn-danger" onClick={stop}>■ {t('stop')}</button>
              ) : (
                <button className="btn btn-sm btn-success" onClick={() => playAyah(1, true)}>▶ {t('playSurah')}</button>
              )}
              <button className={'btn btn-sm ' + (showAll ? 'btn-warning' : 'btn-outline-warning')} onClick={() => setShowAll((v) => !v)}>
                {showAll ? t('hideTafsir') : t('showAllTafsir')}
              </button>
              {settings.translation && (
                <button
                  className={'btn btn-sm ' + (showTrans ? 'btn-info' : 'btn-outline-info')}
                  onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}
                >
                  {showTrans ? t('hideTranslation') : t('showTranslation')}
                </button>
              )}
            </div>
          </div>

          {n !== 1 && n !== 9 && <div className="basmala quran-font" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>}

          <div className="vstack gap-3">
            {surah.data.ayahs.map((a) => {
              const isOpen = showAll || openTafsir[a.n];
              const isMem = Boolean(mem[a.n]);
              return (
                <div key={a.n} id={`ayah-${a.n}`}
                  className={'card ayah-card shadow-sm' + (playing === a.n || (!playing && target === a.n) ? ' ayah-current' : '')}>
                  <div className="card-body">
                    <p className="quran-text mb-2" dir="rtl" style={{ fontSize: settings.fontSize }}>
                      {a.text} <AyahMarker n={a.n} />
                      {a.sajda && <span className="badge bg-secondary ms-2 fs-6">{t('sajda')}</span>}
                    </p>

                    {showTrans && translation.data?.[a.n] && <p className="translation-text">{translation.data[a.n]}</p>}

                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <button className="btn btn-sm btn-outline-success" onClick={() => playAyah(a.n)}>▶ {t('listen')}</button>
                      <button className="btn btn-sm btn-outline-warning"
                        onClick={() => { remember(a.n); setOpenTafsir((o) => ({ ...o, [a.n]: !o[a.n] })); }}>
                        {isOpen ? t('hideTafsir') : t('tafsir')}
                      </button>
                      <button className={'btn btn-sm ' + (isMem ? 'btn-success' : 'btn-outline-secondary')}
                        onClick={() => (isMem ? unmark(n, a.n) : markMemorized(n, [a.n]))}>
                        {isMem ? `✓ ${t('memorized')}` : t('markMemorized')}
                      </button>
                      <span className="ms-auto small text-muted">{t('page')} {num(a.page)} · {t('juz')} {num(a.juz)}</span>
                    </div>

                    {isOpen && (
                      <div className="tafsir-box mt-3" dir="rtl">
                        {tafsir.loading && <span className="text-muted small">{t('loading')}</span>}
                        {tafsir.error && <span className="text-danger small">{t('errorMsg')}</span>}
                        {tafsir.data && (
                          <>
                            <div className="tafsir-text">{tafsir.data[a.n]}</div>
                            <div className="small text-muted mt-2">{t('source')}: {pick(tafsirInfo?.name)} — {pick(tafsirInfo?.note)}</div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
