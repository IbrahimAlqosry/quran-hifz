import { getSurahList } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { toArabicDigits } from '../utils/arabic';

export default function SurahSelect({ value, onChange, className = 'form-select' }) {
  const { data } = useAsync(getSurahList, []);
  return (
    <select className={className} value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {(data || [{ number: value, name: '…' }]).map((s) => (
        <option key={s.number} value={s.number}>
          {toArabicDigits(s.number)} — {s.name}
        </option>
      ))}
    </select>
  );
}
