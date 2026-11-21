import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BOOKS, getBook, getSection, gradeAr } from '../api/hadith';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import { ErrorBox, Loader } from '../components/Status';
import { normalizeArabic } from '../utils/arabic';

const PAGE = 30;

export default function Hadith() {
  const { book: bookKey, section } = useParams();
  if (!bookKey) return <BookList />;
  return <SectionView bookKey={bookKey} section={Number(section) || 1} />;
}

function BookList() {
  const { t, pick } = useT();
  return (
    <>
      <h2 className="h4 mb-2 page-title">📜 {t('nav.hadith')}</h2>
      <p className="text-muted small">{t('hadithIntro')}</p>
      <div className="row g-3">
        {BOOKS.map((b) => (
          <div className="col-sm-6 col-lg-4" key={b.key}>
            <Link to={`/hadith/${b.key}/1`} className="card h-100 shadow-sm text-decoration-none surah-card">
              <div className="card-body">
                <div className="fw-bold fs-5" dir="rtl">{b.name.ar}</div>
                <div className="small text-muted">{b.name.en}</div>
                {(b.key === 'qudsi' || b.key === 'nawawi') && <span className="badge bg-warning text-dark mt-2">{t('recommended')}</span>}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

function SectionView({ bookKey, section }) {
  const { settings } = useApp();
  const { t, num, pick, lang, dir } = useT();
  const navigate = useNavigate();
  const book = getBook(bookKey);
  const [reload, setReload] = useState(0);
  const [limit, setLimit] = useState(PAGE);
  const [q, setQ] = useState('');
  const [jump, setJump] = useState('');
  const { data, loading, error } = useAsync(() => getSection(bookKey, section, lang), [bookKey, section, lang, reload]);

  const list = useMemo(() => {
    if (!data) return [];
    const nq = normalizeArabic(q);
    const lq = q.trim().toLowerCase();
    if (!lq) return data.hadiths;
    return data.hadiths.filter(
      (h) => (nq && normalizeArabic(h.text).includes(nq)) || h.trans.toLowerCase().includes(lq) || String(h.n) === lq
    );
  }, [data, q]);

  if (!book) return <ErrorBox error={new Error('?')} />;
  const go = (s) => {
    setLimit(PAGE);
    setQ('');
    navigate(`/hadith/${bookKey}/${s}`);
    window.scrollTo(0, 0);
  };
  const prevA = dir === 'rtl' ? '→' : '←';
  const nextA = dir === 'rtl' ? '←' : '→';

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
        <Link to="/hadith" className="btn btn-sm btn-outline-secondary">{prevA} {t('nav.hadith')}</Link>
        <h2 className="h5 mb-0 text-center" dir="rtl">{book.name.ar}</h2>
        <span />
      </div>

      {!book.single && (
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
          <button className="btn btn-sm btn-outline-success" disabled={section <= 1} onClick={() => go(section - 1)}>{prevA} {t('prevBook')}</button>
          <form className="d-flex gap-1" onSubmit={(e) => { e.preventDefault(); if (+jump > 0) go(+jump); }}>
            <input type="number" min="1" className="form-control form-control-sm" style={{ width: 80 }} placeholder={num(section)} value={jump} onChange={(e) => setJump(e.target.value)} />
            <button className="btn btn-sm btn-success">{t('go')}</button>
          </form>
          <button className="btn btn-sm btn-outline-success" onClick={() => go(section + 1)}>{t('nextBook')} {nextA}</button>
        </div>
      )}

      {loading && <Loader />}
      {error && (
        error.status === 404
          ? <div className="alert alert-info">{t('bookEnd')} <button className="btn btn-link p-0" onClick={() => go(1)}>{t('backToStart')}</button></div>
          : <ErrorBox error={error} onRetry={() => setReload((r) => r + 1)} />
      )}

      {data && (
        <>
          {!book.single && data.title && <div className="text-center fw-semibold mb-2">{t('bookN', { n: num(section) })}: {data.title}</div>}
          <input className="form-control mb-3" placeholder={t('searchInBook')} value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="small text-muted mb-2">{t('hadithCount', { n: num(list.length) })}</div>

          <div className="vstack gap-3">
            {list.slice(0, limit).map((h) => (
              <div className="card shadow-sm" key={h.n}>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-success">#{num(h.n)}</span>
                    <div className="d-flex flex-wrap gap-1 justify-content-end">
                      {h.grades.slice(0, 2).map((g, i) => (
                        <span key={i} className="badge bg-light text-dark border" title={g.name}>
                          {lang === 'ar' ? gradeAr(g.grade) : g.grade} — {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="dhikr-text mb-2" dir="rtl" style={{ fontSize: settings.fontSize * 0.68 }}>{h.text}</p>
                  {h.trans && <p className="translation-text mb-0">{h.trans}</p>}
                </div>
              </div>
            ))}
          </div>
          {list.length > limit && (
            <div className="text-center mt-3">
              <button className="btn btn-outline-success" onClick={() => setLimit((l) => l + PAGE)}>{t('showMore')}</button>
            </div>
          )}
          <div className="small text-muted mt-3">{t('hadithSource')} · {pick(book.name)}</div>
        </>
      )}
    </>
  );
}
