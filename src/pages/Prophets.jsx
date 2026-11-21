import { Link } from 'react-router-dom';
import { PROPHETS } from '../data/prophets';
import { STORIES } from '../data/stories';
import { useT } from '../i18n';

export default function Prophets() {
  const { t, num, pick, lang } = useT();

  return (
    <>
      <h2 className="h4 mb-2 page-title">📖 {t('nav.prophets')}</h2>
      <div className="story-intro-card mb-3">
        <div className="fs-4">🎧</div>
        <div>
          <div className="fw-bold">{t('storiesHeadline')}</div>
          <div className="small opacity-75">{t('prophetsIntro')}</div>
        </div>
      </div>
      <div className="row g-2">
        {PROPHETS.map((p, i) => (
          <div className="col-12 col-md-6" key={i}>
            <Link to={`/prophets/${i}`} className="card prophet-card shadow-sm text-decoration-none h-100">
              <div className="card-body d-flex gap-3 align-items-center">
                <span className="prophet-num">{num(i + 1)}</span>
                <div className="flex-grow-1 min-w-0">
                  <div className="fw-bold fs-5">{lang === 'ar' ? p.ar : `${p.en}`} {lang !== 'ar' && <span className="text-muted fs-6">— {p.ar}</span>}</div>
                  <div className="small text-muted text-truncate">{pick(p.bio)}</div>
                  <div className="small text-success">{t('chaptersCount', { n: num(STORIES[i].length) })} · 🎧</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
