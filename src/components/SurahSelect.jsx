import { getSurahList } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useT } from '../i18n';

export default function SurahSelect({ value, onChange, className = 'form-select' }) {
  const { data } = useAsync(getSurahList, []);
  const { lang, num } = useT();
  return (
    <select className={className} value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {(data || [{ number: value, name: '…', englishName: '…' }]).map((s) => (
        <option key={s.number} value={s.number}>
          {num(s.number)} — {lang === 'ar' ? s.name : `${s.englishName} (${s.name})`}
        </option>
      ))}
    </select>
  );
}
