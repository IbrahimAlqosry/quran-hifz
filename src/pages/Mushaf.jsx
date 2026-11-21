import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPage, TOTAL_PAGES } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import AyahMarker from '../components/AyahMarker';
import { ErrorBox, Loader } from '../components/Status';

const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export default function Mushaf() {
  const p = Math.min(TOTAL_PAGES, Math.max(1, Number(useParams().p) || 1));
  const navigate = useNavigate();
  const { settings, updateSettings } = useApp();
  const { t, num } = useT();
  const { data, loading, error } = useAsync(() => getPage(p), [p]);
  const touch = useRef(null);

  const go = (x) => {
    if (x >= 1 && x <= TOTAL_PAGES) navigate(`/mushaf/${x}`);
  };

  useEffect(() => {
    updateSettings({ lastPage: p });
    // تحميل الصفحة التالية مسبقًا
    if (p < TOTAL_PAGES) getPage(p + 1).catch(() => {});
  }, [p]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // المصحف يُقرأ من اليمين: السهم الأيسر = الصفحة التالية
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(p + 1);
      if (e.key === 'ArrowRight') go(p - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onTouchStart = (e) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 60) go(dx > 0 ? p + 1 : p - 1); // سحب لليمين = الصفحة التالية (كالمصحف الورقي)
    touch.current = null;
  };

  const first = data?.[0];

  return (
    <div className="mx-auto" style={{ maxWidth: 760 }}>
      <div className="d-flex justify-content-between align-items-center mb-2 gap-2" dir="rtl">
        <button className="btn btn-sm btn-outline-success" disabled={p <= 1} onClick={() => go(p - 1)}>→ {t('prevPage')}</button>
        <select className="form-select form-select-sm" style={{ width: 130 }} value={p} onChange={(e) => go(Number(e.target.value))}>
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((x) => <option key={x} value={x}>{t('page')} {num(x)}</option>)}
        </select>
        <button className="btn btn-sm btn-outline-success" disabled={p >= TOTAL_PAGES} onClick={() => go(p + 1)}>{t('nextPage')} ←</button>
      </div>

      {loading && !data && <Loader />}
      {error && <ErrorBox error={error} />}

      {data && (
        <div className="mushaf-page shadow-sm" dir="rtl" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="d-flex justify-content-between small text-muted mb-2">
            <span>{first.surahName}</span>
            <span>{t('juz')} {num(first.juz)}</span>
          </div>
          <div className="quran-text mushaf-text" style={{ fontSize: settings.fontSize * 0.9 }}>
            {data.map((a) => (
              <span key={`${a.surah}:${a.n}`}>
                {a.n === 1 && (
                  <>
                    <span className="mushaf-surah-head">{a.surahName}</span>
                    {a.surah !== 1 && a.surah !== 9 && <span className="mushaf-basmala">{BASMALA}</span>}
                  </>
                )}
                {a.text} <AyahMarker n={a.n} />{' '}
              </span>
            ))}
          </div>
          <div className="text-center small text-muted mt-2">{num(p)}</div>
        </div>
      )}
      <div className="text-center small text-muted mt-2">{t('swipeHint')}</div>
    </div>
  );
}
