import { useApp } from '../context/AppContext';
import STR from './strings';
import { toArabicDigits } from '../utils/arabic';

import { LANGS } from './langs';
export { LANGS, DEFAULT_TRANSLATION, detectLang } from './langs';

export function useT() {
  const { settings } = useApp();
  const lang = settings.lang || 'ar';

  const t = (key, vars) => {
    let s = STR[lang]?.[key] ?? STR.en[key] ?? STR.ar[key] ?? key;
    if (vars) Object.entries(vars).forEach(([k, v]) => (s = s.split(`{${k}}`).join(v)));
    return s;
  };

  const num = (n) => {
    if (lang === 'ar') return toArabicDigits(n);
    if (lang === 'ur') return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
    return String(n);
  };

  /** اختيار النص المناسب من كائن {ar, en, ...} */
  const pick = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] ?? obj.en ?? obj.ar ?? '';
  };

  const dir = LANGS.find((l) => l.code === lang)?.dir || 'rtl';
  return { t, num, pick, lang, dir };
}
