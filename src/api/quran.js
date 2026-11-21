// طبقة الوصول للبيانات — AlQuran Cloud API (مجاني وبدون مفتاح)
// https://alquran.cloud/api
import { stripBasmala } from '../utils/arabic';

const BASE = 'https://api.alquran.cloud/v1';
const memory = new Map();

/** كتب التفسير المعتمدة (تم استبعاد "تنوير المقباس" لضعف نسبته لابن عباس) */
export const TAFSIRS = [
  { id: 'ar.muyassar', name: { ar: 'التفسير الميسر', en: 'Al-Muyassar' }, note: { ar: 'نخبة من العلماء — مجمع الملك فهد لطباعة المصحف الشريف', en: 'King Fahd Glorious Quran Printing Complex' } },
  { id: 'ar.jalalayn', name: { ar: 'تفسير الجلالين', en: 'Al-Jalalayn' }, note: { ar: 'جلال الدين المحلي وجلال الدين السيوطي', en: 'Al-Mahalli & As-Suyuti' } },
  { id: 'ar.baghawi', name: { ar: 'تفسير البغوي', en: 'Al-Baghawi' }, note: { ar: 'معالم التنزيل — الإمام البغوي', en: "Ma'alim at-Tanzil" } },
  { id: 'ar.waseet', name: { ar: 'التفسير الوسيط', en: 'Al-Waseet' }, note: { ar: 'التفسير الوسيط للقرآن الكريم', en: 'Al-Tafsir Al-Waseet' } },
  { id: 'ar.qurtubi', name: { ar: 'تفسير القرطبي', en: 'Al-Qurtubi' }, note: { ar: 'الجامع لأحكام القرآن — مطوّل', en: "Al-Jami' li-Ahkam al-Quran (detailed)" } },
];

/** القرّاء — الحصري مناسب جدًا للتحفيظ لوضوح أدائه */
export const RECITERS = [
  { id: 'ar.husary', name: { ar: 'محمود خليل الحصري (مرتل)', en: 'Mahmoud Khalil Al-Husary' } },
  { id: 'ar.minshawi', name: { ar: 'محمد صديق المنشاوي (مرتل)', en: 'Mohamed Siddiq Al-Minshawi' } },
  { id: 'ar.alafasy', name: { ar: 'مشاري راشد العفاسي', en: 'Mishary Rashid Alafasy' } },
  { id: 'ar.abdulbasitmurattal', name: { ar: 'عبد الباسط عبد الصمد (مرتل)', en: 'Abdul Basit Abdus Samad' } },
];

export const TOTAL_AYAHS = 6236;

function readCache(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // المساحة ممتلئة — نكتفي بالتخزين في الذاكرة
  }
}

async function get(path, { persist = true } = {}) {
  const key = 'qc:' + path;
  if (memory.has(key)) return memory.get(key);

  const cached = persist ? readCache(key) : null;
  if (cached) {
    memory.set(key, cached);
    return cached;
  }

  const res = await fetch(BASE + path);
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.code !== 200) {
    const err = new Error(typeof json?.data === 'string' ? json.data : `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  memory.set(key, json.data);
  if (persist) writeCache(key, json.data);
  return json.data;
}

/** قائمة السور الـ 114 */
export function getSurahList() {
  return get('/surah');
}

/** نص السورة (رسم عثماني + إملائي مبسط للمقارنة) + روابط الصوت لكل آية */
export async function getSurah(number, reciter = 'ar.husary') {
  const [uthmani, simple, audio] = await get(
    `/surah/${number}/editions/quran-uthmani,quran-simple-clean,${reciter}`
  );

  return {
    number: uthmani.number,
    name: uthmani.name,
    englishName: uthmani.englishName,
    englishNameTranslation: uthmani.englishNameTranslation,
    revelationType: uthmani.revelationType,
    numberOfAyahs: uthmani.numberOfAyahs,
    ayahs: uthmani.ayahs.map((a, i) => ({
      n: a.numberInSurah,
      global: a.number,
      juz: a.juz,
      page: a.page,
      sajda: Boolean(a.sajda),
      text: stripBasmala(number, a.numberInSurah, a.text),
      plain: stripBasmala(number, a.numberInSurah, simple.ayahs[i]?.text || ''),
      audio: audio.ayahs[i]?.audio,
    })),
  };
}

/** نص سورة كاملة لإصدار واحد (تفسير أو ترجمة) — يرجع: رقم الآية → النص */
async function getSurahEdition(number, edition, persist = true) {
  const data = await get(`/surah/${number}/${edition}`, { persist });
  const map = {};
  data.ayahs.forEach((a) => {
    map[a.numberInSurah] = a.text;
  });
  return map;
}

export function getTafsir(number, tafsirId = 'ar.muyassar') {
  // التفاسير المطوّلة (كالقرطبي) كبيرة الحجم، فلا نخزنها في localStorage
  return getSurahEdition(number, tafsirId, tafsirId !== 'ar.qurtubi');
}

export function getTranslation(number, edition) {
  return getSurahEdition(number, edition);
}

/** كل ترجمات معاني القرآن المتاحة بكل اللغات */
export function getTranslationEditions() {
  return get('/edition?type=translation');
}

/** آية واحدة بعدة إصدارات — ref مثل "2:255" أو رقم الآية العام */
export function getAyahEditions(ref, editions = ['quran-uthmani']) {
  return get(`/ayah/${ref}/editions/${editions.join(',')}`);
}

/** البحث في القرآن (بالعربية في النص، وبغيرها في الترجمة) */
export async function searchQuran(query, edition = 'quran-simple-clean') {
  try {
    return await get(`/search/${encodeURIComponent(query.trim())}/all/${edition}`, { persist: false });
  } catch (e) {
    if (e.status === 404) return { count: 0, matches: [] };
    throw e;
  }
}
