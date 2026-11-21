import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSurah } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import SettingsBar from '../components/SettingsBar';
import SurahSelect from '../components/SurahSelect';
import AyahMarker from '../components/AyahMarker';
import { ErrorBox, Loader } from '../components/Status';
import { firstLetterHint } from '../utils/arabic';
import { useT } from '../i18n';

const MODES = ['full', 'hints', 'hidden'];

export default function Memorize() {
  const n = Math.min(114, Math.max(1, Number(useParams().n) || 1));
  const navigate = useNavigate();
  const { settings, progress, markMemorized } = useApp();
  const { t, num, dir } = useT();
  const [reload, setReload] = useState(0);
  const surah = useAsync(() => getSurah(n, settings.reciter), [n, settings.reciter, reload]);
  const total = surah.data?.numberOfAyahs || 1;

  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(5);
  const [reps, setReps] = useState(3);
  const [loopRange, setLoopRange] = useState(false);
  const [mode, setMode] = useState('full');
  const [revealed, setRevealed] = useState({});
  const [cur, setCur] = useState(null); // { idx, rep }
  const [saved, setSaved] = useState(false);
  const audioRef = useRef(null);

  // عند تغيير السورة: نبدأ من أول آية غير محفوظة
  useEffect(() => {
    if (!surah.data) return;
    const mem = progress[n] || {};
    const firstNew = surah.data.ayahs.find((a) => !mem[a.n])?.n || 1;
    setFrom(firstNew);
    setTo(Math.min(firstNew + 4, surah.data.numberOfAyahs));
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, surah.data]);

  useEffect(() => {
    setRevealed({});
    setSaved(false);
  }, [from, to, mode, n]);

  const range = useMemo(() => (surah.data ? surah.data.ayahs.slice(from - 1, to) : []), [surah.data, from, to]);

  const play = (idx = 0, rep = 0) => {
    const a = range[idx];
    const el = audioRef.current;
    if (!a || !el) return;
    setCur({ idx, rep });
    if (el.src !== a.audio) el.src = a.audio;
    el.currentTime = 0;
    el.play().catch(() => setCur(null));
  };

  function stop() {
    audioRef.current?.pause();
    setCur(null);
  }

  const onEnded = () => {
    if (!cur) return;
    if (cur.rep + 1 < reps) return play(cur.idx, cur.rep + 1);
    if (cur.idx + 1 < range.length) return play(cur.idx + 1, 0);
    if (loopRange) return play(0, 0);
    setCur(null);
  };

  const setRange = (f, t) => {
    const nf = Math.min(Math.max(1, f), total);
    const nt = Math.min(Math.max(nf, t), total);
    stop();
    setFrom(nf);
    setTo(nt);
  };

  const renderText = (a) => {
    if (mode === 'full' || revealed[a.n]) return a.text;
    if (mode === 'hints') return a.text.split(/\s+/).map(firstLetterHint).join('  ');
    return a.text; // يُطمس بالـ CSS
  };

  const currentAyah = cur ? range[cur.idx]?.n : null;
  const mem = progress[n] || {};

  return (
    <>
      <audio ref={audioRef} onEnded={onEnded} preload="none" />

      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-6">
          <label className="form-label small mb-1">{t('surah')}</label>
          <SurahSelect value={n} onChange={(v) => navigate(`/memorize/${v}`)} />
        </div>
        <div className="col-md-6 text-md-start">
          <Link to={`/surah/${n}`} className="btn btn-outline-warning">{t('readTafsirFirst')}</Link>
        </div>
      </div>

      <SettingsBar showTafsir={false} showTranslation={false} />

      {surah.loading && <Loader />}
      {surah.error && <ErrorBox error={surah.error} onRetry={() => setReload((r) => r + 1)} />}

      {surah.data && (
        <>
          <div className="card card-body shadow-sm mb-3">
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <label className="form-label small mb-1">{t('fromAyah')}</label>
                <input type="number" className="form-control" min={1} max={total} value={from}
                  onChange={(e) => setRange(Number(e.target.value), to)} />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small mb-1">{t('toAyah')}</label>
                <input type="number" className="form-control" min={from} max={total} value={to}
                  onChange={(e) => setRange(from, Number(e.target.value))} />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small mb-1">{t('repeatEach')}</label>
                <select className="form-select" value={reps} onChange={(e) => setReps(Number(e.target.value))}>
                  {[1, 2, 3, 5, 7, 10, 15, 20].map((r) => (
                    <option key={r} value={r}>{t('times', { n: num(r) })}</option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-3 d-flex align-items-end">
                <div className="form-check">
                  <input id="loop" type="checkbox" className="form-check-input" checked={loopRange}
                    onChange={(e) => setLoopRange(e.target.checked)} />
                  <label htmlFor="loop" className="form-check-label">{t('loopRange')}</label>
                </div>
              </div>
            </div>

            <div className="btn-group w-100 mt-3" role="group">
              {MODES.map((m) => (
                <button key={m} className={'btn ' + (mode === m ? 'btn-success' : 'btn-outline-success')} onClick={() => setMode(m)}>
                  {t('mode.' + m)}
                </button>
              ))}
            </div>
            <div className="small text-muted mt-2">{t('modeHint.' + mode)}</div>

            <div className="d-flex flex-wrap gap-2 mt-3">
              {cur ? (
                <button className="btn btn-danger" onClick={stop}>
                  ■ {t('stop')} ({t('ayah')} {num(currentAyah)} — {num(cur.rep + 1)}/{num(reps)})
                </button>
              ) : (
                <button className="btn btn-success" onClick={() => play(0, 0)}>▶ {t('playRange')}</button>
              )}
              <button className="btn btn-outline-primary ms-auto"
                onClick={() => { markMemorized(n, range.map((a) => a.n)); setSaved(true); }}>
                ✓ {t('doneRange')}
              </button>
            </div>
            {saved && (
              <div className="alert alert-success mt-3 mb-0 py-2">
                {t('savedMsg')} <Link to="/test">{t('nav.test')}</Link>
                {to < total && (
                  <button className="btn btn-sm btn-success ms-2" onClick={() => setRange(to + 1, to + 1 + (to - from))}>
                    {t('nextRange')} {dir === 'rtl' ? '←' : '→'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="memorize-panel card shadow-sm">
            <div className="card-body">
              {range.map((a) => (
                <p
                  key={a.n}
                  dir="rtl"
                  className={
                    'quran-text memo-ayah' +
                    (currentAyah === a.n ? ' ayah-current' : '') +
                    (mode === 'hidden' && !revealed[a.n] ? ' ayah-hidden' : '')
                  }
                  style={{ fontSize: settings.fontSize }}
                  onClick={() => mode !== 'full' && setRevealed((r) => ({ ...r, [a.n]: !r[a.n] }))}
                  role={mode !== 'full' ? 'button' : undefined}
                >
                  {renderText(a)} <AyahMarker n={a.n} />
                  {mem[a.n] && <span className="badge bg-success-subtle text-success ms-2 fs-6">{t('memorized')}</span>}
                </p>
              ))}
            </div>
          </div>

          <div className="alert alert-light border mt-3 small">
            <strong>{t('suggestedMethod')}:</strong> {t('methodText')}
          </div>
        </>
      )}
    </>
  );
}
