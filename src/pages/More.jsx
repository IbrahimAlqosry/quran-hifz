import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DEFAULT_TRANSLATION, LANGS, useT } from '../i18n';

const GROUPS = [
  ['grp.quran', [['/', '📖', 'nav.quran'], ['/memorize/1', '🧠', 'nav.memorize'], ['/test', '✅', 'nav.test'], ['/khatma', '📅', 'nav.khatma'], ['/search', '🔍', 'nav.search'], ['/progress', '📊', 'nav.progress']]],
  ['grp.worship', [['/prayer', '🕌', 'nav.prayer'], ['/adhkar', '📿', 'nav.adhkar'], ['/duas', '🤲', 'nav.duas'], ['/tasbeeh', '🔢', 'nav.tasbeeh'], ['/names', '✨', 'nav.names']]],
  ['grp.knowledge', [['/hadith', '📜', 'nav.hadith'], ['/prophets', '🌿', 'nav.prophets']]],
  ['grp.fiqh', [['/hajj', '🕋', 'nav.hajj'], ['/zakat', '💰', 'nav.zakat'], ['/sadaqah', '🐑', 'nav.sadaqah']]],
];

export default function More() {
  const { settings, updateSettings, stats } = useApp();
  const { t, num, lang } = useT();
  const [canInstall, setCanInstall] = useState(Boolean(window.__installPrompt));
  useEffect(() => {
    const on = () => setCanInstall(true);
    window.addEventListener('installable', on);
    return () => window.removeEventListener('installable', on);
  }, []);

  return (
    <>
      {GROUPS.map(([g, items]) => (
        <section key={g} className="mb-4">
          <h2 className="section-label">{t(g)}</h2>
          <div className="app-grid">
            {items.map(([to, icon, key]) => (
              <Link key={key} to={to} className="app-grid-item">
                <span className="app-grid-icon">
                  {icon}
                  {to === '/test' && stats.due.length > 0 && <span className="app-badge">{num(stats.due.length)}</span>}
                </span>
                <span className="app-grid-label">{t(key)}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mb-4">
        <h2 className="section-label">{t('settings')}</h2>
        <div className="list-group list-group-flush rounded-4 shadow-sm overflow-hidden">
          <div className="list-group-item d-flex justify-content-between align-items-center">
            <span>🌐 {t('language')}</span>
            <select className="form-select form-select-sm w-auto" value={lang}
              onChange={(e) => updateSettings({ lang: e.target.value, translation: DEFAULT_TRANSLATION[e.target.value], showTranslation: e.target.value !== 'ar' })}>
              {LANGS.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>
          <div className="list-group-item d-flex justify-content-between align-items-center">
            <span>🌙 {t('toggleTheme')}</span>
            <div className="form-check form-switch m-0">
              <input className="form-check-input" type="checkbox" checked={settings.theme === 'dark'}
                onChange={(e) => updateSettings({ theme: e.target.checked ? 'dark' : 'light' })} />
            </div>
          </div>
          <Link to="/prayer" className="list-group-item list-group-item-action">📢 {t('adhanTitle')}</Link>
          {canInstall && (
            <button className="list-group-item list-group-item-action text-success fw-bold"
              onClick={async () => { const p = window.__installPrompt; if (p) { p.prompt(); await p.userChoice.catch(() => {}); window.__installPrompt = null; setCanInstall(false); } }}>
              ⬇ {t('installApp')}
            </button>
          )}
          <a href="./privacy.html" className="list-group-item list-group-item-action">🔒 {t('privacy')}</a>
        </div>
      </section>
      <div className="text-center small text-muted pb-2">
        <img src="./icon-192.png" alt="" width="56" height="56" className="rounded-4 mb-2 shadow-sm" />
        <div className="fw-bold text-body">{t('appName')}</div>
        <div>{t('devBy')}</div>
        <div className="mb-2">{t('devPrayer')} 🤍</div>
        <div>{t('footer')}</div>
      </div>
    </>
  );
}
