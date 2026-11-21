export const LANGS = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'ur', name: 'اردو', dir: 'rtl' },
  { code: 'id', name: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', dir: 'ltr' },
];

/** ترجمة المعاني الافتراضية لكل لغة (من AlQuran Cloud) */
export const DEFAULT_TRANSLATION = {
  ar: '',
  en: 'en.sahih',
  fr: 'fr.hamidullah',
  ur: 'ur.jalandhry',
  id: 'id.indonesian',
  tr: 'tr.diyanet',
};

export function detectLang() {
  try {
    const code = (navigator.language || 'ar').slice(0, 2).toLowerCase();
    return LANGS.some((l) => l.code === code) ? code : 'ar';
  } catch {
    return 'ar';
  }
}
