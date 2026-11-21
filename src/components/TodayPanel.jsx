import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_LOCATION, getPrayerTimes, PRAYERS, toDate } from '../api/prayer';
import { TOTAL_PAGES } from '../api/quran';
import useAsync from '../hooks/useAsync';
import useLocalStorage from '../hooks/useLocalStorage';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';

/** لوحة «يومك»: الصلاة القادمة + ما يناسب وقتك الآن (أذكار، وِرد، مراجعة، متابعة قراءة) */
export default function TodayPanel() {
  const { settings, stats } = useApp();
  const memPct = ((stats.memorized / 6236) * 100).toFixed(1);
  const { t, num, lang } = useT();
  const loc = settings.location || DEFAULT_LOCATION;
  const { data } = useAsync(() => getPrayerTimes(loc, settings.prayerMethod), [JSON.stringify(loc), settings.prayerMethod]);
  const [plan] = useLocalStorage('hifz:khatma', null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => {
    if (!data) return null;
    const list = PRAYERS.filter((p) => p !== 'Sunrise').map((p) => ({ p, at: toDate(data.timings[p]) }));
    let n = list.find((x) => x.at.getTime() > now);
    if (!n) { const f = toDate(data.timings.Fajr); f.setDate(f.getDate() + 1); n = { p: 'Fajr', at: f }; }
    const mins = Math.max(0, Math.round((n.at.getTime() - now) / 60000));
    return { ...n, h: Math.floor(mins / 60), m: mins % 60 };
  }, [data, now]);

  // أي أذكار تناسب الوقت الآن؟
  const adhkarCat = useMemo(() => {
    if (!data) return new Date().getHours() < 14 ? 'morning' : 'evening';
    const fajr = toDate(data.timings.Fajr).getTime();
    const asr = toDate(data.timings.Asr).getTime();
    const isha = toDate(data.timings.Isha).getTime() + 90 * 60000;
    if (now >= fajr && now < asr) return 'morning';
    if (now >= asr && now < isha) return 'evening';
    return 'sleep';
  }, [data, now]);

  const hour = new Date(now).getHours();
  const greet = hour < 12 ? t('greetMorning') : hour < 18 ? t('greetDay') : t('greetEvening');
  const hijri = data?.hijri;

  // وِرد الختمة لليوم
  let wird = null;
  if (plan) {
    const per = TOTAL_PAGES / plan.days;
    const d0 = new Date(); d0.setHours(0, 0, 0, 0);
    const day = Math.min(plan.days - 1, Math.max(0, Math.floor((d0.getTime() - plan.start) / 86400000)));
    const a = Math.floor(day * per) + 1;
    const b = Math.min(TOTAL_PAGES, Math.floor((day + 1) * per));
    wird = { a, b, done: plan.done.includes(day) };
  }

  const cards = [
    { to: `/adhkar?c=${adhkarCat}`, icon: adhkarCat === 'sleep' ? '🌙' : adhkarCat === 'morning' ? '🌅' : '🌇', title: t('adhkar.' + adhkarCat), sub: t('nowTime'), tone: 'gold' },
    wird
      ? { to: `/mushaf/${wird.a}`, icon: wird.done ? '✅' : '📖', title: t('todayWird'), sub: t('pagesRange', { a: num(wird.a), b: num(wird.b) }), tone: 'green' }
      : { to: '/khatma', icon: '📅', title: t('nav.khatma'), sub: t('startKhatma'), tone: 'green' },
    stats.due.length > 0
      ? { to: '/test', icon: '🧠', title: t('nav.test'), sub: t('dueBadge', { n: num(stats.due.length) }), tone: 'blue' }
      : { to: `/memorize/${settings.lastRead?.surah || 1}`, icon: '🧠', title: t('nav.memorize'), sub: t('newPortion'), tone: 'blue' },
    settings.lastRead
      ? { to: `/surah/${settings.lastRead.surah}?a=${settings.lastRead.ayah}`, icon: '📌', title: t('continueReading'), sub: `${t('surah')} ${num(settings.lastRead.surah)} · ${num(settings.lastRead.ayah)}`, tone: 'plain' }
      : { to: '/tasbeeh', icon: '🔢', title: t('nav.tasbeeh'), sub: t('tasbeehSub'), tone: 'plain' },
  ];

  return (
    <div className="today mb-4">
      <div className="today-hero">
        <div className="d-flex justify-content-between align-items-start gap-2 position-relative" style={{ zIndex: 1 }}>
          <div>
            <div className="today-greet">{t('salam')}</div>
            <div className="today-date">{greet}</div>
            {hijri && (
              <div className="today-date">
                {lang === 'ar' ? hijri.weekday?.ar : hijri.weekday?.en} · {num(hijri.day)} {lang === 'ar' ? hijri.month?.ar : hijri.month?.en} {num(hijri.year)} {t('hijriSuffix')}
              </div>
            )}
          </div>
          {next && (
            <Link to="/prayer" className="today-next text-decoration-none">
              <div className="small opacity-75">{t('nextPrayer')}</div>
              <div className="today-next-name">{t('p.' + next.p)}</div>
              <div className="today-countdown">{t('inTime', { h: num(next.h), m: num(next.m) })}</div>
            </Link>
          )}
        </div>
        {data && (
          <div className="prayer-chips">
            {PRAYERS.filter((x) => x !== 'Sunrise').map((x) => (
              <Link to="/prayer" key={x} className={'prayer-chip' + (next?.p === x ? ' active' : '')}>
                <span>{t('p.' + x)}</span>
                <b>{data.timings[x]}</b>
              </Link>
            ))}
          </div>
        )}
        <div className="hero-stats">
          <Link to="/progress"><b>{num(stats.memorized)}</b><span>{t('statMemorized')} · {num(memPct)}%</span></Link>
          <Link to="/test"><b>{num(stats.due.length)}</b><span>{t('statDue')}</span></Link>
          <Link to="/khatma"><b>{wird ? `${num(Math.round((plan.done.length / plan.days) * 100))}%` : '—'}</b><span>{t('nav.khatma')}</span></Link>
        </div>
      </div>

      <h2 className="section-label">{t('forYouNow')}</h2>
      <div className="today-cards">
        {cards.map((c) => (
          <Link key={c.title} to={c.to} className={`today-card tone-${c.tone}`}>
            <span className="today-card-icon">{c.icon}</span>
            <span className="today-card-title">{c.title}</span>
            <span className="today-card-sub">{c.sub}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
