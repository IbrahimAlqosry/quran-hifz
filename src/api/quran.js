// طبقة الوصول للبيانات — AlQuran Cloud API (مجاني وبدون مفتاح)
// https://alquran.cloud/api
import { stripBasmala } from '../utils/arabic';

const BASE = 'https://api.alquran.cloud/v1';
const memory = new Map();

/** كتب التفسير المعتمدة المتاحة (تم استبعاد "تنوير المقباس" لضعف نسبته لابن عباس) */
export const TAFSIRS = [
  { id: 'ar.muyassar', name: 'التفسير الميسر', note: 'نخبة من العلماء — مجمع الملك فهد لطباعة المصحف الشريف' },
  { id: 'ar.jalalayn', name: 'تفسير الجلالين', note: 'جلال الدين المحلي وجلال الدين السيوطي' },
  { id: 'ar.baghawi', name: 'تفسير البغوي', note: 'معالم التنزيل — الإمام البغوي' },
  { id: 'ar.waseet', name: 'التفسير الوسيط', note: 'التفسير الوسيط للقرآن الكريم' },
  { id: 'ar.qurtubi', name: 'تفسير القرطبي', note: 'الجامع لأحكام القرآن — مطوّل' },
];

/** القرّاء — الحصري مناسب جدًا للتحفيظ لوضوح أدائه */
export const RECITERS = [
  { id: 'ar.husary', name: 'محمود خليل الحصري (مرتل)' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي (مرتل)' },
  { id: 'ar.alafasy', name: 'مشاري راشد العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد (مرتل)' },
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
  if (!res.ok) throw new Error(`تعذّر الاتصال بالخادم (${res.status})`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(typeof json.data === 'string' ? json.data : 'استجابة غير متوقعة');

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

/** تفسير سورة كاملة — يرجع كائن: رقم الآية → نص التفسير */
export async function getTafsir(number, tafsirId = 'ar.muyassar') {
  // التفاسير المطوّلة (كالقرطبي) كبيرة الحجم، فلا نخزنها في localStorage
  const persist = tafsirId !== 'ar.qurtubi';
  const data = await get(`/surah/${number}/${tafsirId}`, { persist });
  const map = {};
  data.ayahs.forEach((a) => {
    map[a.numberInSurah] = a.text;
  });
  return map;
}
