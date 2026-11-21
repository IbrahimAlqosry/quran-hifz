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

/** القرّاء — بعضهم بتلاوة لكل آية (AlQuran Cloud)، وبعضهم بملف لكل سورة فقط (mp3quran.net) */
const MP3 = 'https://cdn.mp3quran.net/audio/';
export const RECITERS = [
  { id: 'ar.husary', name: { ar: 'محمود خليل الحصري (مرتل)', en: 'Al-Husary (Murattal)' } },
  { id: 'ar.husarymujawwad', name: { ar: 'محمود خليل الحصري (مجوّد)', en: 'Al-Husary (Mujawwad)' } },
  { id: 'ar.minshawi', name: { ar: 'محمد صديق المنشاوي (مرتل)', en: 'Al-Minshawi (Murattal)' } },
  { id: 'ar.minshawimujawwad', name: { ar: 'محمد صديق المنشاوي (مجوّد)', en: 'Al-Minshawi (Mujawwad)' } },
  { id: 'ar.abdulbasitmurattal', name: { ar: 'عبد الباسط عبد الصمد (مرتل)', en: 'Abdul Basit (Murattal)' } },
  { id: 'ar.alafasy', name: { ar: 'مشاري راشد العفاسي', en: 'Mishary Alafasy' } },
  { id: 'mp3:banna-r1', surahOnly: true, server: MP3 + 'mahmoud-banna/r1/', name: { ar: 'محمود علي البنا (مرتل)', en: 'Mahmoud Ali Al-Banna (Murattal)' } },
  { id: 'mp3:banna-r2', surahOnly: true, server: MP3 + 'mahmoud-banna/r2/', name: { ar: 'محمود علي البنا (مجوّد)', en: 'Mahmoud Ali Al-Banna (Mujawwad)' } },
  {
    id: 'mp3:refaat', surahOnly: true, server: MP3 + 'muhammad-refaat/r1/',
    surahs: [1, 10, 11, 12, 17, 18, 19, 20, 48, 54, 55, 56, 69, 72, 73, 75, 76, 77, 78, 79, 81, 82, 83, 85, 86, 87, 88, 89, 96, 98, 100],
    name: { ar: 'الشيخ محمد رفعت', en: 'Sheikh Mohamed Refaat' },
  },
];

export const getReciter = (id) => RECITERS.find((r) => r.id === id) || RECITERS[0];

/** القارئ المستخدم للتلاوة آية بآية (القرّاء بملف للسورة فقط → الحصري) */
export const ayahReciter = (id) => (getReciter(id).surahOnly ? 'ar.husary' : getReciter(id).id);

/** رابط تلاوة السورة كاملة للقرّاء بملف للسورة، أو null */
export function surahAudioUrl(id, n) {
  const r = getReciter(id);
  if (!r.surahOnly || (r.surahs && !r.surahs.includes(n))) return null;
  return r.server + String(n).padStart(3, '0') + '.mp3';
}

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
    `/surah/${number}/editions/quran-uthmani,quran-simple-clean,${ayahReciter(reciter)}`
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

/** صفحة من المصحف (ترقيم مصحف المدينة ١–٦٠٤) */
export async function getPage(page) {
  const data = await get(`/page/${page}/quran-uthmani`);
  return data.ayahs.map((a) => ({
    n: a.numberInSurah,
    surah: a.surah.number,
    surahName: a.surah.name,
    surahEn: a.surah.englishName,
    juz: a.juz,
    hizbQuarter: a.hizbQuarter,
    text: stripBasmala(a.surah.number, a.numberInSurah, a.text),
  }));
}

export const TOTAL_PAGES = 604;
