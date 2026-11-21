import { useMemo, useState } from 'react';
import { NAMES } from '../data/names';
import { useT } from '../i18n';
import { normalizeArabic } from '../utils/arabic';

export default function Names() {
  const { t, num, lang } = useT();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);

  const list = useMemo(() => {
    const nq = normalizeArabic(q);
    const lq = q.trim().toLowerCase();
    return NAMES.map((x, i) => ({ x, i })).filter(({ x }) =>
      !lq || (nq && normalizeArabic(x[0] + ' ' + x[1]).includes(nq)) || x[2].toLowerCase().includes(lq) || x[3].toLowerCase().includes(lq)
    );
  }, [q]);

  return (
    <>
      <h2 className="h4 mb-2">✨ {t('nav.names')}</h2>
      <div className="alert alert-light border small">{t('namesIntro')}</div>
      <input className="form-control mb-3" placeholder={t('searchName')} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="row g-2">
        {list.map(({ x, i }) => (
          <div className="col-6 col-md-4 col-lg-3" key={i}>
            <button className={'card name-card w-100 h-100 shadow-sm' + (open === i ? ' open' : '')} onClick={() => setOpen(open === i ? null : i)}>
              <div className="card-body p-2 text-center">
                <span className="name-num">{num(i + 1)}</span>
                <div className="quran-font fs-3 text-success" dir="rtl">{x[0]}</div>
                {lang !== 'ar' && <div className="small fw-semibold">{x[2]}</div>}
                {open === i && (
                  <div className="small mt-1">
                    <div dir="rtl">{x[1]}</div>
                    {lang !== 'ar' && <div className="text-muted">{x[3]}</div>}
                  </div>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
