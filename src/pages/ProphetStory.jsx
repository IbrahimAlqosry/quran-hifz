import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ayahReciter, getSurahEditions } from '../api/quran';
import { PROPHETS } from '../data/prophets';
import { STORIES } from '../data/stories';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import AyahMarker from '../components/AyahMarker';
import { ErrorBox, Loader } from '../components/Status';
import { getVoice, speak, ttsSupported } from '../lib/tts';
import { stripBasmala } from '../utils/arabic';

const MODES = ['narrate', 'both', 'recite'];

/** تحميل نصوص القصة: الآيات + التفسير الميسر (أو الترجمة) + صوت التلاوة */
async function loadStory(idx, narrEd, reciter) {
  const chapters = STORIES[idx];
  const surahs = [...new Set(chapters.flatMap((c) => c.passages.map((p) => p.s)))];
  const eds = ['quran-uthmani', narrEd, ayahReciter(reciter)];
  const data = {};
  await Promise.all(
    surahs.map(async (s) => {
      const [q, n, a] = await getSurahEditions(s, eds);
      data[s] = { name: q.name, en: q.englishName, q: q.ayahs, n: n.ayahs, a: a.ayahs };
    })
  );
  return chapters.map((c) => ({
    title: c.title,
    ayahs: c.passages.flatMap(({ s, from, to }) => {
      const out = [];
      for (let k = from; k <= to; k++) {
        out.push({
          key: `${s}:${k}`, s, n: k, surahName: data[s].name, surahEn: data[s].en,
          text: stripBasmala(s, k, data[s].q[k - 1]?.text || ''),
          narr: data[s].n[k - 1]?.text || '',
          audio: data[s].a[k - 1]?.audio,
        });
      }
      return out;
    }),
  }));
}

export default function ProphetStory() {
  const idx = Math.min(PROPHETS.length - 1, Math.max(0, Number(useParams().i) || 0));
  const p = PROPHETS[idx];
  const { settings } = useApp();
  const { t, num, pick, lang, dir } = useT();
  const narrEd = lang === 'ar' ? 'ar.muyassar' : settings.translation || 'en.sahih';
  const voiceLang = lang === 'ar' ? 'ar' : narrEd.split('.')[0];
  const introLang = lang === 'ar' ? 'ar' : 'en';
  const [reload, setReload] = useState(0);
  const { data, loading, error } = useAsync(() => loadStory(idx, narrEd, settings.reciter), [idx, narrEd, settings.reciter, reload]);

  const [mode, setMode] = useState('narrate');
  const [rate, setRate] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [hasVoice, setHasVoice] = useState(true);
  const audioRef = useRef(null);

  // التحقق من وجود صوت بلغة الرواية
  useEffect(() => {
    if (!ttsSupported()) return setHasVoice(false);
    const check = () => setHasVoice(Boolean(getVoice(voiceLang)));
    check();
    window.speechSynthesis.addEventListener?.('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', check);
  }, [voiceLang]);

  // قائمة التشغيل: مقدمة → (عنوان الفصل → [تلاوة؟ + رواية؟] لكل آية)
  const queue = useMemo(() => {
    if (!data) return [];
    const q = [];
    if (mode !== 'recite') q.push({ type: 'tts', text: `${t('storyOf')} ${lang === 'ar' ? p.ar : p.en}. ${pick(p.bio)}`, lang: introLang, ref: 'intro' });
    data.forEach((ch, ci) => {
      if (mode !== 'recite') q.push({ type: 'tts', text: pick(ch.title), lang: introLang, ref: `c${ci}` });
      ch.ayahs.forEach((a) => {
        if (mode !== 'narrate' && a.audio) q.push({ type: 'audio', url: a.audio, ref: a.key, ci });
        if (mode !== 'recite' && a.narr) q.push({ type: 'tts', text: a.narr, lang: voiceLang, ref: a.key, ci });
      });
    });
    return q;
  }, [data, mode, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // تشغيل العنصر الحالي ثم الانتقال للتالي
  useEffect(() => {
    if (!playing) return undefined;
    const item = queue[pos];
    if (!item) {
      setPlaying(false);
      setPos(0);
      return undefined;
    }
    let cancelled = false;
    const next = () => !cancelled && setPos((x) => x + 1);
    document.getElementById('story-' + item.ref)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (item.type === 'tts') {
      const stop = speak(item.text, item.lang, rate, next);
      return () => {
        cancelled = true;
        stop();
      };
    }
    const a = audioRef.current;
    a.src = item.url;
    a.onended = next;
    a.onerror = next;
    a.play().catch(next);
    return () => {
      cancelled = true;
      a.onended = null;
      a.onerror = null;
      a.pause();
    };
  }, [playing, pos, queue, rate]);

  // إيقاف الصوت عند مغادرة الصفحة
  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch { /* */ } }, []);
  useEffect(() => { setPlaying(false); setPos(0); }, [idx, mode]);

  const current = queue[pos]?.ref;
  const startAt = (ref) => {
    const i = queue.findIndex((x) => x.ref === ref);
    if (i >= 0) {
      setPos(i);
      setPlaying(true);
    }
  };
  const chapterNow = queue[pos]?.ci ?? (String(current || '').startsWith('c') ? Number(current.slice(1)) : 0);

  const prevA = dir === 'rtl' ? '→' : '←';
  const nextA = dir === 'rtl' ? '←' : '→';

  return (
    <div className="mx-auto story-page" style={{ maxWidth: 820 }}>
      <audio ref={audioRef} preload="none" />

      <div className="story-hero mb-3">
        <div className="small opacity-75">{t('storyOf')}</div>
        <h2 className="h3 fw-bold mb-1">{lang === 'ar' ? `نبي الله ${p.ar}` : `${p.en} — ${p.ar}`}</h2>
        <p className={'mb-0 opacity-90' + (current === 'intro' ? ' story-now' : '')} id="story-intro">{pick(p.bio)}</p>
      </div>

      {!hasVoice && mode !== 'recite' && <div className="alert alert-warning small">{t('noVoice')}</div>}

      {loading && <Loader />}
      {error && <ErrorBox error={error} onRetry={() => setReload((r) => r + 1)} />}

      {data && data.map((ch, ci) => (
        <section key={ci} className="mb-4">
          <h3 id={`story-c${ci}`} className={'story-chapter' + (current === `c${ci}` ? ' story-now' : '')}>
            <span className="step-num me-2">{num(ci + 1)}</span>{pick(ch.title)}
          </h3>
          <div className="vstack gap-2">
            {ch.ayahs.map((a) => (
              <div key={a.key} id={'story-' + a.key} className={'card story-ayah' + (current === a.key ? ' story-now' : '')} onClick={() => startAt(a.key)} role="button">
                <div className="card-body py-2">
                  <p className="quran-text mb-1" dir="rtl" style={{ fontSize: settings.fontSize * 0.8 }}>
                    {a.text} <AyahMarker n={a.n} />
                  </p>
                  <p className="translation-text mb-1" dir={lang === 'ar' ? 'rtl' : 'auto'}>{a.narr}</p>
                  <div className="small text-muted">{lang === 'ar' ? a.surahName : a.surahEn} : {num(a.n)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {data && (
        <div className="d-flex justify-content-between mb-4">
          {idx > 0 ? <Link to={`/prophets/${idx - 1}`} className="btn btn-outline-success btn-sm">{prevA} {lang === 'ar' ? PROPHETS[idx - 1].ar : PROPHETS[idx - 1].en}</Link> : <span />}
          {idx < PROPHETS.length - 1 && <Link to={`/prophets/${idx + 1}`} className="btn btn-outline-success btn-sm">{lang === 'ar' ? PROPHETS[idx + 1].ar : PROPHETS[idx + 1].en} {nextA}</Link>}
        </div>
      )}
      <p className="small text-muted text-center">{t('storySource')}</p>

      {/* مشغّل الراوي */}
      {data && (
        <div className="story-player shadow-lg">
          <button className="story-play" onClick={() => setPlaying((x) => !x)} aria-label="play">{playing ? '⏸' : '▶'}</button>
          <div className="flex-grow-1 min-w-0">
            <div className="small fw-bold text-truncate">
              {playing ? `${t('chapterN', { n: num((chapterNow || 0) + 1) })} · ${pick(data[chapterNow || 0]?.title)}` : t('listenStory')}
            </div>
            <div className="progress mt-1" style={{ height: 4 }}>
              <div className="progress-bar bg-warning" style={{ width: `${queue.length ? (pos / queue.length) * 100 : 0}%` }} />
            </div>
          </div>
          <select className="form-select form-select-sm story-select" value={mode} onChange={(e) => setMode(e.target.value)}>
            {MODES.map((m) => <option key={m} value={m}>{t('storyMode.' + m)}</option>)}
          </select>
          <select className="form-select form-select-sm story-select" style={{ maxWidth: 74 }} value={rate} onChange={(e) => setRate(Number(e.target.value))}>
            {[0.75, 0.9, 1, 1.15, 1.3].map((r) => <option key={r} value={r}>{r}×</option>)}
          </select>
          {pos > 0 && <button className="btn btn-sm btn-light" onClick={() => { setPlaying(false); setPos(0); }} aria-label="restart">⟲</button>}
        </div>
      )}
    </div>
  );
}
