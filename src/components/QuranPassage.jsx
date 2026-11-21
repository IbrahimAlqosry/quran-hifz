import { getAyahEditions } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import AyahMarker from './AyahMarker';
import { stripBasmala } from '../utils/arabic';

const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

/** عرض مقطع قرآني مجلوب من المصحف مباشرة + ترجمة المعاني لغير العربية */
export default function QuranPassage({ s, from, to, basmala = false, showRef = false, fontSize }) {
  const { lang, num } = useT();
  const { settings } = useApp();
  const trans = lang !== 'ar' ? settings.translation || 'en.sahih' : null;
  const refs = [];
  for (let a = from; a <= to; a++) refs.push(`${s}:${a}`);

  const { data, error } = useAsync(
    () => Promise.all(refs.map((r) => getAyahEditions(r, trans ? ['quran-uthmani', trans] : ['quran-uthmani']))),
    [s, from, to, trans]
  );

  if (error) return <div className="text-danger small">⚠ {error.message}</div>;
  if (!data) return <div className="placeholder-glow"><span className="placeholder col-10" /><span className="placeholder col-7" /></div>;

  const surah = data[0][0].surah;
  return (
    <div>
      {basmala && from === 1 && s !== 1 && s !== 9 && (
        <div className="quran-font text-center text-success mb-1" dir="rtl">{BASMALA}</div>
      )}
      <p className="quran-text mb-1" dir="rtl" style={{ fontSize: fontSize || settings.fontSize * 0.85 }}>
        {data.map(([a]) => (
          <span key={a.number}>
            {stripBasmala(s, a.numberInSurah, a.text)} <AyahMarker n={a.numberInSurah} />{' '}
          </span>
        ))}
      </p>
      {trans && <p className="translation-text mb-1">{data.map((d) => d[1]?.text).join(' ')}</p>}
      {showRef && (
        <div className="small text-muted">
          {lang === 'ar' ? surah.name : surah.englishName} — {num(from)}
          {to !== from && `–${num(to)}`}
        </div>
      )}
    </div>
  );
}
