// مشغّل الأذان — تسجيلات مشاهير المؤذنين (مستودع Athan-MP3 العام عبر jsDelivr)
const CDN = 'https://cdn.jsdelivr.net/gh/abodehq/Athan-MP3@master/Sounds/';
export const ADHAN_VOICES = [
  { id: 'makkah', group: 'sa', file: 'Athan Makkah.mp3', name: { ar: 'أذان الحرم المكي', en: 'Masjid al-Haram, Makkah' } },
  { id: 'zahrani', group: 'sa', file: 'Athan Mansoor Az-Zahrani.mp3', name: { ar: 'منصور الزهراني', en: 'Mansour Az-Zahrani' } },
  { id: 'qatami', group: 'sa', file: 'Athan Nasser Alqatami.mp3', name: { ar: 'ناصر القطامي', en: 'Nasser Al-Qatami' } },
  { id: 'malki', group: 'sa', file: 'Athan Hamdan Almalki.mp3', name: { ar: 'حمدان المالكي', en: 'Hamdan Al-Malki' } },
  { id: 'deghreri', group: 'sa', file: 'Athan Hamad Deghreri.mp3', name: { ar: 'حمد الدغريري', en: 'Hamad Ad-Deghreri' } },
  { id: 'abdulbasit', group: 'eg', file: 'Athan Abed Albase6.mp3', name: { ar: 'عبد الباسط عبد الصمد', en: 'Abdul Basit Abdus-Samad' } },
  { id: 'refaat', group: 'eg', file: 'Athan Mohammad Ref3at.mp3', name: { ar: 'الشيخ محمد رفعت', en: 'Sheikh Mohamed Refaat' } },
  { id: 'minshawi', group: 'eg', file: 'Athan Mohammad Almenshawy.mp3', name: { ar: 'محمد صديق المنشاوي', en: 'Mohamed Siddiq Al-Minshawi' } },
  { id: 'nuaina', group: 'eg', file: 'Athan Ahmad Nuyne3.mp3', name: { ar: 'أحمد نعينع', en: 'Ahmed Nuaina' } },
  { id: 'alafasy', group: 'other', file: 'Athan Mishary Alafasi.mp3', name: { ar: 'مشاري العفاسي (الكويت)', en: 'Mishary Alafasy (Kuwait)' } },
];
const voice = (v) => ADHAN_VOICES.find((x) => x.id === v) || ADHAN_VOICES[0];
export const adhanUrl = (v) => CDN + encodeURIComponent(voice(v).file);

export const ADHAN_DUA =
  'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ';
export const ADHAN_DUA_EN =
  'O Allah, Lord of this perfect call and the prayer about to be established, grant Muhammad the intercession and the virtue, and raise him to the praised station You have promised him.';

let audio = null;
export function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'none';
  }
  return audio;
}

/** المتصفحات تمنع التشغيل التلقائي — نفتح الصوت بضغطة من المستخدم مرة واحدة */
export async function unlockAudio(voice) {
  const a = getAudio();
  try {
    a.muted = true;
    a.src = adhanUrl(voice);
    await a.play();
    a.pause();
    a.currentTime = 0;
  } catch {
    /* سيُعاد المحاولة عند موعد الأذان */
  } finally {
    a.muted = false;
  }
}

export async function requestNotify() {
  try {
    if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
  } catch {
    /* غير مدعوم */
  }
}

export async function notify(title, body) {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const reg = await navigator.serviceWorker?.getRegistration?.();
    if (reg) await reg.showNotification(title, { body, tag: 'adhan', icon: './icon-192.png', vibrate: [200, 100, 200] });
    else new Notification(title, { body, tag: 'adhan' });
  } catch {
    /* غير مدعوم */
  }
}
