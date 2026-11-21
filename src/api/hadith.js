// الأحاديث — Hadith API (fawazahmed0) عبر jsDelivr — نصوص الكتب الأصلية مع ترجماتها
const BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';
const memory = new Map();

export const BOOKS = [
  { key: 'qudsi', name: { ar: 'الأحاديث القدسية (الأربعون القدسية)', en: 'Forty Hadith Qudsi' }, single: true, langs: ['en', 'fr'] },
  { key: 'nawawi', name: { ar: 'الأربعون النووية', en: "An-Nawawi's Forty Hadith" }, single: true, langs: ['en', 'fr', 'tr'] },
  { key: 'bukhari', name: { ar: 'صحيح البخاري', en: 'Sahih al-Bukhari' }, langs: ['en', 'fr', 'tr', 'ur', 'id'] },
  { key: 'muslim', name: { ar: 'صحيح مسلم', en: 'Sahih Muslim' }, langs: ['en', 'fr', 'tr', 'ur', 'id'] },
  { key: 'abudawud', name: { ar: 'سنن أبي داود', en: 'Sunan Abu Dawud' }, langs: ['en', 'fr', 'tr', 'ur', 'id'] },
  { key: 'tirmidhi', name: { ar: 'جامع الترمذي', en: "Jami' at-Tirmidhi" }, langs: ['en', 'tr', 'ur', 'id'] },
  { key: 'nasai', name: { ar: 'سنن النسائي', en: "Sunan an-Nasa'i" }, langs: ['en', 'fr', 'tr', 'ur', 'id'] },
  { key: 'ibnmajah', name: { ar: 'سنن ابن ماجه', en: 'Sunan Ibn Majah' }, langs: ['en', 'fr', 'tr', 'ur', 'id'] },
  { key: 'malik', name: { ar: 'موطأ الإمام مالك', en: 'Muwatta Malik' }, langs: ['en', 'fr', 'tr', 'ur', 'id'] },
  { key: 'dehlawi', name: { ar: 'الأربعون للدهلوي', en: 'Forty Hadith of Shah Waliullah Dehlawi' }, single: true, langs: ['en', 'fr'] },
];

const LANG_PREFIX = { ar: 'ara', en: 'eng', fr: 'fra', tr: 'tur', ur: 'urd', id: 'ind' };

export const getBook = (key) => BOOKS.find((b) => b.key === key);

async function getJson(url) {
  if (memory.has(url)) return memory.get(url);
  const p = fetch(url).then(async (res) => {
    if (!res.ok) {
      const e = new Error(`HTTP ${res.status}`);
      e.status = res.status;
      throw e;
    }
    return res.json();
  });
  memory.set(url, p);
  try {
    return await p;
  } catch (e) {
    memory.delete(url);
    throw e;
  }
}

/** باب (كتاب) من مصنَّف: النص العربي + الترجمة بلغة الواجهة إن وُجدت */
export async function getSection(bookKey, section, lang) {
  const book = getBook(bookKey);
  const ar = await getJson(`${BASE}/ara-${bookKey}/sections/${section}.min.json`);
  let trans = null;
  const tl = lang !== 'ar' ? (book.langs.includes(lang) ? lang : 'en') : null;
  if (tl) {
    try {
      trans = await getJson(`${BASE}/${LANG_PREFIX[tl]}-${bookKey}/sections/${section}.min.json`);
    } catch {
      trans = null;
    }
  }
  const tmap = {};
  (trans?.hadiths || []).forEach((h) => {
    tmap[h.hadithnumber] = h.text;
  });
  const title = trans?.metadata?.section?.[section] || ar.metadata?.section?.[section] || '';
  return {
    name: ar.metadata?.name,
    title,
    hadiths: ar.hadiths
      .filter((h) => h.text && h.text.trim())
      .map((h) => ({ n: h.hadithnumber, text: h.text, trans: tmap[h.hadithnumber] || '', grades: h.grades || [] })),
  };
}

const GRADE_AR = [
  [/sahih/i, 'صحيح'],
  [/hasan/i, 'حسن'],
  [/da.?if|weak/i, 'ضعيف'],
  [/maudu|fabricat/i, 'موضوع'],
];
export function gradeAr(g) {
  for (const [re, ar] of GRADE_AR) if (re.test(g)) return ar;
  return g;
}
