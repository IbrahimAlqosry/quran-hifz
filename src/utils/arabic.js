// أدوات معالجة النص العربي/القرآني

// التشكيل وعلامات الضبط العثماني والتطويل وعلامة BOM
const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ﻿]/g;
const MARKS = '[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED]*';

/** توحيد النص للمقارنة: حذف التشكيل وتوحيد الألفات والياء والتاء المربوطة */
export function normalizeArabic(s = '') {
  return s
    .replace(DIACRITICS, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^ء-ي\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** حذف البسملة من أول آية في السور (عدا الفاتحة والتوبة) لأن الـ API يدمجها مع الآية الأولى */
export function stripBasmala(surah, ayah, text = '') {
  const clean = text.replace(/﻿/g, '').trim();
  if (surah === 1 || surah === 9 || ayah !== 1) return clean;
  const words = clean.split(/\s+/);
  if (words.length > 4 && normalizeArabic(words.slice(0, 4).join(' ')) === 'بسم الله الرحمن الرحيم') {
    return words.slice(4).join(' ');
  }
  return clean;
}

/** أول حرف من الكلمة بتشكيله — لأسلوب "أوائل الكلمات" في الحفظ */
export function firstLetterHint(word) {
  // نُبقي "ال" التعريف ظاهرة ونُظهر الحرف الذي بعدها
  const m = word.match(new RegExp('^((?:[ٱا]' + MARKS + 'ل' + MARKS + ')?)(\\S' + MARKS + ')', 'u'));
  return m && word.length > m[0].length ? m[0] + 'ـ' : word;
}

/** تحويل الأرقام إلى أرقام عربية مشرقية */
export const toArabicDigits = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

/**
 * مقارنة ما كتبه المستخدم بالآية (على مستوى الكلمات باستخدام LCS)
 * يرجع الكلمات مع حالة كل كلمة + نسبة الصحة
 */
export function compareRecitation(targetPlain, input) {
  const words = targetPlain.trim().split(/\s+/).filter((w) => normalizeArabic(w));
  const t = words.map(normalizeArabic);
  const u = normalizeArabic(input).split(' ').filter(Boolean);

  const dp = Array.from({ length: t.length + 1 }, () => new Array(u.length + 1).fill(0));
  for (let i = t.length - 1; i >= 0; i--) {
    for (let j = u.length - 1; j >= 0; j--) {
      dp[i][j] = t[i] === u[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const matched = new Array(t.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < t.length && j < u.length) {
    if (t[i] === u[j]) {
      matched[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }

  const correct = matched.filter(Boolean).length;
  const extra = Math.max(0, u.length - correct);
  const score = t.length ? Math.min(1, correct / (t.length + extra * 0.5)) : 0;

  return {
    words: words.map((w, k) => ({ w, ok: matched[k] })),
    correct,
    total: t.length,
    score,
  };
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
