import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSurah } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import SurahSelect from '../components/SurahSelect';
import AyahMarker from '../components/AyahMarker';
import { ErrorBox, Loader } from '../components/Status';
import { compareRecitation, shuffle } from '../utils/arabic';
import { useT } from '../i18n';

export default function Test() {
  const { progress, stats } = useApp();
  const { t, num } = useT();
  const [source, setSource] = useState(stats.due.length ? 'due' : 'memorized');
  const [surahNum, setSurahNum] = useState(1);
  const [ordered, setOrdered] = useState(false);
  const [queue, setQueue] = useState(null);

  const memorizedList = useMemo(
    () =>
      Object.entries(progress).flatMap(([s, ayahs]) =>
        Object.keys(ayahs).map((a) => ({ surah: Number(s), ayah: Number(a) }))
      ),
    [progress]
  );

  const start = () => {
    let items;
    if (source === 'due') items = stats.due;
    else if (source === 'memorized') items = memorizedList;
    else items = Object.keys(progress[surahNum] || {}).map((a) => ({ surah: surahNum, ayah: Number(a) }));

    const sorted = [...items].sort((x, y) => x.surah - y.surah || x.ayah - y.ayah);
    setQueue(ordered ? sorted : shuffle(items));
  };

  if (queue) return <Session queue={queue} onExit={() => setQueue(null)} />;

  const counts = {
    due: stats.due.length,
    memorized: memorizedList.length,
    surah: Object.keys(progress[surahNum] || {}).length,
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 640 }}>
      <h2 className="h4 mb-3">{t('nav.test')}</h2>
      <p className="text-muted">{t('testIntro')}</p>

      {memorizedList.length === 0 ? (
        <div className="alert alert-info">
          {t('noMemorized')} <Link to="/memorize/1">{t('nav.memorize')}</Link>
        </div>
      ) : (
        <div className="card card-body shadow-sm">
          {[
            ['due', t('srcDue')],
            ['memorized', t('srcAll')],
            ['surah', t('srcSurah')],
          ].map(([id, label]) => (
            <div className="form-check mb-2" key={id}>
              <input className="form-check-input" type="radio" id={id} checked={source === id}
                onChange={() => setSource(id)} />
              <label className="form-check-label" htmlFor={id}>
                {label} <span className="badge bg-secondary">{num(counts[id])}</span>
              </label>
            </div>
          ))}
          {source === 'surah' && <SurahSelect value={surahNum} onChange={setSurahNum} className="form-select mb-2" />}
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" id="ordered" checked={ordered}
              onChange={(e) => setOrdered(e.target.checked)} />
            <label className="form-check-label" htmlFor="ordered">{t('ordered')}</label>
          </div>
          <button className="btn btn-success" disabled={!counts[source]} onClick={start}>
            {t('startTest', { n: num(counts[source]) })}
          </button>
        </div>
      )}
    </div>
  );
}

function Session({ queue, onExit }) {
  const { settings, grade } = useApp();
  const { t, num } = useT();
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ good: 0, hard: 0, again: 0 });
  const audioRef = useRef(null);

  const item = queue[pos];
  const surah = useAsync(() => (item ? getSurah(item.surah, settings.reciter) : Promise.resolve(null)), [
    item?.surah,
    settings.reciter,
  ]);

  if (!item) {
    const total = score.good + score.hard + score.again;
    return (
      <div className="text-center mx-auto" style={{ maxWidth: 520 }}>
        <h2 className="h4 mb-3">{t('sessionDone')} 🎉</h2>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <span className="badge bg-success fs-6 p-2">{t('good')}: {num(score.good)}</span>
          <span className="badge bg-warning text-dark fs-6 p-2">{t('hard')}: {num(score.hard)}</span>
          <span className="badge bg-danger fs-6 p-2">{t('again')}: {num(score.again)}</span>
        </div>
        <p className="text-muted">
          {t('mastery')}: {num(total ? Math.round((score.good / total) * 100) : 0)}%
        </p>
        <button className="btn btn-success" onClick={onExit}>{t('back')}</button>
      </div>
    );
  }

  const ayahs = surah.data?.ayahs;
  const target = ayahs?.[item.ayah - 1];
  const prev = ayahs?.[item.ayah - 2];

  const check = () => {
    if (!target) return;
    setResult(compareRecitation(target.plain, input));
    setRevealed(true);
  };

  const rate = (q) => {
    grade(item.surah, item.ayah, q);
    setScore((s) => ({ ...s, [q]: s[q] + 1 }));
    setPos((p) => p + 1);
    setRevealed(false);
    setInput('');
    setResult(null);
    audioRef.current?.pause();
  };

  const playTarget = () => {
    if (!target || !audioRef.current) return;
    audioRef.current.src = target.audio;
    audioRef.current.play().catch(() => {});
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 820 }}>
      <audio ref={audioRef} preload="none" />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={onExit}>{t('finish')}</button>
        <span className="text-muted small">
          {num(pos + 1)} / {num(queue.length)}
        </span>
      </div>
      <div className="progress mb-3" style={{ height: 5 }}>
        <div className="progress-bar bg-success" style={{ width: `${(pos / queue.length) * 100}%` }} />
      </div>

      {surah.loading && <Loader />}
      {surah.error && <ErrorBox error={surah.error} />}

      {target && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="text-center mb-3">
              <div className="quran-font fs-3" dir="rtl">{surah.data.name}</div>
              <div className="text-muted">{t('reciteAyah', { n: num(item.ayah) })}</div>
            </div>

            <div className="cue-box mb-3">
              <div className="small text-muted mb-1">{prev ? t('prevAyah') : t('surahStart')}</div>
              {prev ? (
                <p className="quran-text mb-0" dir="rtl" style={{ fontSize: settings.fontSize * 0.85 }}>
                  {prev.text} <AyahMarker n={prev.n} />
                </p>
              ) : (
                item.surah !== 9 && <p className="quran-font fs-4 mb-0 text-center" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
              )}
            </div>

            {!revealed && (
              <>
                <textarea
                  className="form-control mb-2 fs-5"
                  rows={3}
                  dir="rtl"
                  placeholder={t('typePlaceholder')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" disabled={!input.trim()} onClick={check}>{t('check')}</button>
                  <button className="btn btn-outline-success" onClick={() => setRevealed(true)}>{t('reveal')}</button>
                </div>
              </>
            )}

            {revealed && (
              <>
                <p className="quran-text target-ayah" dir="rtl" style={{ fontSize: settings.fontSize }}>
                  {target.text} <AyahMarker n={target.n} />
                </p>

                {result && (
                  <div className="alert alert-light border">
                    <div className="mb-2">
                      {t('compareResult', { c: num(result.correct), n: num(result.total) })} —{' '}
                      <strong>{num(Math.round(result.score * 100))}%</strong>
                    </div>
                    <div className="fs-5 lh-lg" dir="rtl">
                      {result.words.map((w, i) => (
                        <span key={i} className={'me-2 ' + (w.ok ? 'text-success' : 'text-danger text-decoration-underline')}>
                          {w.w}
                        </span>
                      ))}
                    </div>
                    <div className="small text-muted mt-1">{t('redWords')}</div>
                  </div>
                )}

                <button className="btn btn-sm btn-outline-success mb-3" onClick={playTarget}>▶ {t('listen')}</button>

                <div className="small text-muted mb-2">{t('rateHonestly')}</div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success flex-fill" onClick={() => rate('good')}>{t('good')}</button>
                  <button className="btn btn-warning flex-fill" onClick={() => rate('hard')}>{t('hard')}</button>
                  <button className="btn btn-danger flex-fill" onClick={() => rate('again')}>{t('again')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
