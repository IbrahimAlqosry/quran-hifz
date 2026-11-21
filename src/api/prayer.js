// مواقيت الصلاة — AlAdhan API (مجاني وبدون مفتاح) https://aladhan.com/prayer-times-api
const BASE = 'https://api.aladhan.com/v1';

/** طرق الحساب الأشهر */
export const METHODS = [
  { id: 5, name: { ar: 'الهيئة المصرية العامة للمساحة', en: 'Egyptian General Authority of Survey' } },
  { id: 4, name: { ar: 'أم القرى — مكة المكرمة', en: 'Umm Al-Qura, Makkah' } },
  { id: 3, name: { ar: 'رابطة العالم الإسلامي', en: 'Muslim World League' } },
  { id: 2, name: { ar: 'الجمعية الإسلامية لأمريكا الشمالية', en: 'ISNA (North America)' } },
  { id: 1, name: { ar: 'جامعة العلوم الإسلامية بكراتشي', en: 'University of Islamic Sciences, Karachi' } },
  { id: 8, name: { ar: 'منطقة الخليج', en: 'Gulf Region' } },
  { id: 9, name: { ar: 'الكويت', en: 'Kuwait' } },
  { id: 10, name: { ar: 'قطر', en: 'Qatar' } },
  { id: 16, name: { ar: 'دبي', en: 'Dubai' } },
  { id: 13, name: { ar: 'رئاسة الشؤون الدينية التركية', en: 'Diyanet, Turkey' } },
  { id: 12, name: { ar: 'اتحاد المنظمات الإسلامية بفرنسا', en: 'UOIF, France' } },
  { id: 20, name: { ar: 'وزارة الشؤون الدينية الإندونيسية', en: 'KEMENAG, Indonesia' } },
  { id: 17, name: { ar: 'ماليزيا (JAKIM)', en: 'JAKIM, Malaysia' } },
  { id: 21, name: { ar: 'المغرب', en: 'Morocco' } },
  { id: 19, name: { ar: 'الجزائر', en: 'Algeria' } },
  { id: 18, name: { ar: 'تونس', en: 'Tunisia' } },
  { id: 23, name: { ar: 'الأردن', en: 'Jordan' } },
];

export const PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const dateStr = (d = new Date()) =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

/** location: { lat, lng } أو { city, country } */
export async function getPrayerTimes(location, method = 5, date = new Date()) {
  const q =
    location.lat != null
      ? `/timings/${dateStr(date)}?latitude=${location.lat}&longitude=${location.lng}&method=${method}`
      : `/timingsByCity/${dateStr(date)}?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country || '')}&method=${method}`;

  const res = await fetch(BASE + q);
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.code !== 200) throw new Error(json?.data || `HTTP ${res.status}`);

  const { timings, date: d, meta } = json.data;
  const clean = {};
  PRAYERS.forEach((p) => {
    clean[p] = String(timings[p] || '').slice(0, 5);
  });
  return {
    timings: clean,
    hijri: d?.hijri,
    gregorian: d?.gregorian,
    timezone: meta?.timezone,
    lat: Number(meta?.latitude ?? location.lat),
    lng: Number(meta?.longitude ?? location.lng),
  };
}

/** اتجاه القبلة (بالدرجات من الشمال الحقيقي) — حساب محلي بدون إنترنت */
export function qiblaDirection(lat, lng) {
  const K = { lat: 21.4225, lng: 39.8262 };
  const rad = Math.PI / 180;
  const φ1 = lat * rad;
  const φ2 = K.lat * rad;
  const Δλ = (K.lng - lng) * rad;
  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
  return (Math.atan2(y, x) / rad + 360) % 360;
}

/** المسافة إلى مكة بالكيلومتر */
export function distanceToMakkah(lat, lng) {
  const rad = Math.PI / 180;
  const R = 6371;
  const dLat = (21.4225 - lat) * rad;
  const dLng = (39.8262 - lng) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * rad) * Math.cos(21.4225 * rad) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}
