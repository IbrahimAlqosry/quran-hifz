import { Link } from 'react-router-dom';
import { getAyahEditions } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import AyahMarker from './AyahMarker';
import { stripBasmala } from '../utils/arabic';

/** آية اليوم — تتغير يوميًا وتظهر مع التفسير الميسر أو ترجمة المعاني */
export default function DailyAyah() {
  const { t, lang, num } = useT();
  const { settings } = useApp();
  const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  const n = ((day * 7919) % 6236) + 1;
  const second = lang === 'ar' ? 'ar.muyassar' : settings.translation || 'en.sahih';
  const { data } = useAsync(() => getAyahEditions(n, ['quran-uthmani', second]), [n, second]);
  if (!data) return null;

  const [a, b] = data;
  return (
    <div className="card daily-ayah shadow-sm mb-4">
      <div className="daily-ornament" aria-hidden="true">۞</div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="h6 mb-0 text-success fw-bold">✨ {t('dailyAyah')}</h2>
          <Link to={`/surah/${a.surah.number}?a=${a.numberInSurah}`} className="small">
            {lang === 'ar' ? a.surah.name : a.surah.englishName} : {num(a.numberInSurah)}
          </Link>
        </div>
        <p className="quran-text mb-2" dir="rtl" style={{ fontSize: settings.fontSize * 0.9 }}>
          {stripBasmala(a.surah.number, a.numberInSurah, a.text)} <AyahMarker n={a.numberInSurah} />
        </p>
        <div className="small text-muted mb-1">{lang === 'ar' ? t('tafsirMuyassar') : t('meaning')}</div>
        <p className="translation-text mb-2">{b.text}</p>
        <div className="d-flex gap-2">
          <Link to={`/surah/${a.surah.number}?a=${a.numberInSurah}`} className="btn btn-sm btn-outline-success">📖 {t('readTafsir')}</Link>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => {
            const txt = `${stripBasmala(a.surah.number, a.numberInSurah, a.text)} ﴿${a.surah.name}: ${a.numberInSurah}﴾\n\n${b.text}`;
            if (navigator.share) navigator.share({ text: txt }).catch(() => {});
            else navigator.clipboard?.writeText(txt).catch(() => {});
          }}>📤 {t('share')}</button>
        </div>
      </div>
    </div>
  );
}
