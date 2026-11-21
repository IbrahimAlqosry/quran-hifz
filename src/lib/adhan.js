// مشغّل الأذان — ملفات صوتية من islamcan.com
export const ADHAN_VOICES = [1, 2, 3, 4, 5, 6, 7, 8];
export const adhanUrl = (v) => `https://www.islamcan.com/audio/adhan/azan${v}.mp3`;

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

export function notify(title, body) {
  try {
    if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body, tag: 'adhan' });
  } catch {
    /* بعض الموبايلات لا تدعم الإشعار من الصفحة مباشرة */
  }
}
