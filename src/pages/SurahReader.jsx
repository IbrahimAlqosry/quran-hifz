import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSurah, getTafsir, TAFSIRS } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import SettingsBar from '../components/SettingsBar';
import AyahMarker from '../components/AyahMarker';
import { ErrorBox, Loader } from '../components/Status';
import { toArabicDigits } from '../utils/arabic';

export default function SurahReader() {
  const n = Math.min(114, Math.max(1, Number(useParams().n) || 1));
  const { settings, progress, markMemorized, unmark } = useApp();
  const [reload, setReload] = useState(0);
  const surah = useAsync(() => getSurah(n, settings.reciter), [n, settings.reciter, reload]);

  const [showAll, setShowAll] = useState(false);
  const [openTafsir, setOpenTafsir] = useState({});
  const needTafsir = showAll || Object.values(openTafsir).some(Boolean);
  const tafsir = useAsync(
    () => (needTafsir ? getTafsir(n, settings.tafsir) : Promise.resolve(null)),
    [n, settings.tafsir, needTafsir]
  );
  const tafsirInfo = TAFSIRS.find((t) => t.id === settings.tafsir);

  // مشغل الصوت
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(null); // رقم الآية
  const [continuous, setContinuous] = useState(false);

  useEffect(() => {
    setOpenTafsir({});
    setPlaying(null);
    audioRef.current?.pause();
  }, [n]);

  const playAyah = (ayahNum, cont = false) => {
    const a = surah.data?.ayahs[ayahNum - 1];
    const el = audioRef.current;
    if (!a || !el) return;
    setContinuous(cont);
    setPlaying(ayahNum);
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

  return (
    <>
      <audio ref={audioRef} onEnded={onEnded} preload="none" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        {n > 1 ? <Link to={`/surah/${n - 1}`} className="btn btn-sm btn-outline-secondary">→ السابقة</Link> : <span />}
        <Link to={`/memorize/${n}`} className="btn btn-sm btn-success">احفظ هذه السورة</Link>
        {n < 114 ? <Link to={`/surah/${n + 1}`} className="btn btn-sm btn-outline-secondary">التالية ←</Link> : <span />}
      </div>

      <SettingsBar />

      {surah.loading && <Loader />}
      {surah.error && <ErrorBox error={surah.error} onRetry={() => setReload((r) => r + 1)} />}

      {surah.data && (
        <>
          <div className="text-center mb-3">
            <h2 className="quran-font surah-title">{surah.data.name}</h2>
            <div className="text-muted small">
              {surah.data.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · {toArabicDigits(surah.data.numberOfAyahs)} آية ·
              الجزء {toArabicDigits(surah.data.ayahs[0].juz)}
            </div>
            <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
              {playing ? (
                <button className="btn btn-sm btn-danger" onClick={stop}>■ إيقاف</button>
              ) : (
                <button className="btn btn-sm btn-success" onClick={() => playAyah(1, true)}>▶ تشغيل السورة</button>
              )}
              <button
                className={'btn btn-sm ' + (showAll ? 'btn-warning' : 'btn-outline-warning')}
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? 'إخفاء التفسير' : 'عرض التفسير لكل الآيات'}
              </button>
            </div>
          </div>

          {n !== 1 && n !== 9 && <div className="basmala quran-font">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>}

          <div className="vstack gap-3">
            {surah.data.ayahs.map((a) => {
              const isOpen = showAll || openTafsir[a.n];
              const isMem = Boolean(mem[a.n]);
              return (
                <div
                  key={a.n}
                  id={`ayah-${a.n}`}
                  className={'card ayah-card shadow-sm' + (playing === a.n ? ' ayah-current' : '')}
                >
                  <div className="card-body">
                    <p className="quran-text mb-2" style={{ fontSize: settings.fontSize }}>
                      {a.text} <AyahMarker n={a.n} />
                      {a.sajda && <span className="badge bg-secondary ms-2 fs-6">سجدة</span>}
                    </p>

                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <button className="btn btn-sm btn-outline-success" onClick={() => playAyah(a.n)}>▶ استماع</button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => setOpenTafsir((o) => ({ ...o, [a.n]: !o[a.n] }))}
                      >
                        {isOpen ? 'إخفاء التفسير' : 'التفسير'}
                      </button>
                      <button
                        className={'btn btn-sm ' + (isMem ? 'btn-success' : 'btn-outline-secondary')}
                        onClick={() => (isMem ? unmark(n, a.n) : markMemorized(n, [a.n]))}
                      >
                        {isMem ? '✓ محفوظة' : 'تحديد كمحفوظة'}
                      </button>
                      <span className="ms-auto small text-muted">
                        ص {toArabicDigits(a.page)} · ج {toArabicDigits(a.juz)}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="tafsir-box mt-3">
                        {tafsir.loading && <span className="text-muted small">جارٍ تحميل التفسير…</span>}
                        {tafsir.error && <span className="text-danger small">تعذّر تحميل التفسير.</span>}
                        {tafsir.data && (
                          <>
                            <div className="tafsir-text">{tafsir.data[a.n]}</div>
                            <div className="small text-muted mt-2">
                              المصدر: {tafsirInfo?.name} — {tafsirInfo?.note}
                            </div>
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
