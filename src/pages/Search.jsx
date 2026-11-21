import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchQuran } from '../api/quran';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import { ErrorBox, Loader } from '../components/Status';

const isArabic = (s) => /[؀-ۿ]/.test(s);

export default function Search() {
  const { settings } = useApp();
  const { t, num, lang } = useT();
  const [q, setQ] = useState('');
  const [state, setState] = useState({ loading: false, error: null, data: null, arabic: true });

  const run = async (e) => {
    e.preventDefault();
    const query = q.trim();
    if (query.length < 2) return;
    const arabic = isArabic(query);
    const edition = arabic ? 'quran-simple-clean' : settings.translation || 'en.sahih';
    setState({ loading: true, error: null, data: null, arabic });
    try {
      const data = await searchQuran(query, edition);
      setState({ loading: false, error: null, data, arabic });
    } catch (err) {
      setState({ loading: false, error: err, data: null, arabic });
    }
  };

  const matches = state.data?.matches || [];

  return (
    <div className="mx-auto" style={{ maxWidth: 820 }}>
      <h2 className="h4 mb-3 page-title">🔍 {t('nav.search')}</h2>
      <form className="input-group mb-2" onSubmit={run}>
        <input className="form-control" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('searchPlaceholder')} />
        <button className="btn btn-success">{t('nav.search')}</button>
      </form>
      <p className="small text-muted">{t('searchHint')}</p>

      {state.loading && <Loader />}
      {state.error && <ErrorBox error={state.error} />}
      {state.data && <div className="mb-2 small">{t('resultsCount', { n: num(state.data.count || 0) })}</div>}

      <div className="vstack gap-2">
        {matches.slice(0, 200).map((m) => (
          <Link key={m.number} to={`/surah/${m.surah.number}?a=${m.numberInSurah}`} className="card text-decoration-none shadow-sm search-hit">
            <div className="card-body py-2">
              <div className="small text-success fw-semibold">
                {lang === 'ar' ? m.surah.name : m.surah.englishName} : {num(m.numberInSurah)}
              </div>
              <div className={state.arabic ? 'dhikr-text' : 'translation-text'} dir={state.arabic ? 'rtl' : 'auto'}>{m.text}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
