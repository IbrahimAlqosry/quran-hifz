import { useEffect, useRef, useState } from 'react';
import { DEFAULT_LOCATION, getPrayerTimes, toDate } from '../api/prayer';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import { adhanUrl, getAudio, notify } from '../lib/adhan';

const PLAYED_KEY = 'hifz:adhanPlayed';
const WINDOW_MS = 2 * 60 * 1000; // يؤذّن لو فات الموعد بأقل من دقيقتين

/** يراقب مواقيت الصلاة ويشغّل الأذان طالما التطبيق مفتوح */
export default function useAdhan() {
  const { settings } = useApp();
  const { t } = useT();
  const cfg = settings.adhan || {};
  const loc = settings.location || DEFAULT_LOCATION;
  const [now, setNow] = useState(Date.now());
  const [timings, setTimings] = useState(null);
  const [current, setCurrent] = useState(null); // { prayer, playing }
  const played = useRef(null);

  const day = new Date(now).toDateString();

  useEffect(() => {
    if (!cfg.enabled) return undefined;
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, [cfg.enabled]);

  useEffect(() => {
    if (!cfg.enabled) return;
    let alive = true;
    getPrayerTimes(loc, settings.prayerMethod)
      .then((d) => alive && setTimings(d.timings))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [cfg.enabled, JSON.stringify(loc), settings.prayerMethod, day]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!cfg.enabled || !timings) return;
    if (played.current == null) {
      try {
        played.current = localStorage.getItem(PLAYED_KEY) || '';
      } catch {
        played.current = '';
      }
    }
    for (const p of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      if (!cfg.prayers?.[p] || !timings[p]) continue;
      const diff = now - toDate(timings[p]).getTime();
      const key = `${day}|${p}`;
      if (diff >= 0 && diff < WINDOW_MS && played.current !== key) {
        played.current = key;
        try {
          localStorage.setItem(PLAYED_KEY, key);
        } catch {
          /* */
        }
        const name = t('p.' + p);
        notify(t('adhanNow', { p: name }), timings[p]);
        const a = getAudio();
        a.src = adhanUrl(cfg.voice || 1);
        a.currentTime = 0;
        a.onended = () => setCurrent((c) => (c ? { ...c, playing: false } : c));
        a.play().catch(() => {});
        setCurrent({ prayer: p, playing: true });
        break;
      }
    }
  }, [now, timings, cfg.enabled, cfg.voice, JSON.stringify(cfg.prayers)]); // eslint-disable-line react-hooks/exhaustive-deps

  const stop = () => {
    getAudio().pause();
    setCurrent((c) => (c ? { ...c, playing: false } : c));
  };
  const dismiss = () => {
    getAudio().pause();
    setCurrent(null);
  };

  return { current, stop, dismiss };
}
