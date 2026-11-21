import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';

// عناوين الشاشات حسب المسار
const TITLES = [
  ['/surah', 'nav.quran'], ['/memorize', 'nav.memorize'], ['/test', 'nav.test'], ['/progress', 'nav.progress'],
  ['/prayer', 'nav.prayer'], ['/adhkar', 'nav.adhkar'], ['/duas', 'nav.duas'], ['/hajj', 'nav.hajj'],
  ['/tasbeeh', 'nav.tasbeeh'], ['/search', 'nav.search'], ['/zakat', 'nav.zakat'], ['/sadaqah', 'nav.sadaqah'],
  ['/hadith', 'nav.hadith'], ['/names', 'nav.names'], ['/prophets', 'nav.prophets'], ['/mushaf', 'nav.mushaf'],
  ['/khatma', 'nav.khatma'], ['/more', 'nav.more'],
];
const ROOTS = ['/', '/prayer', '/adhkar', '/more'];

/** الشريط العلوي على الموبايل */
export function AppBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { settings, updateSettings } = useApp();
  const { t, dir } = useT();
  const isRoot = ROOTS.includes(pathname) || pathname.startsWith('/mushaf');
  const title = TITLES.find(([p]) => pathname.startsWith(p))?.[1];

  return (
    <header className="app-bar d-lg-none">
      {!isRoot ? (
        <button className="app-bar-btn" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} aria-label="back">
          {dir === 'rtl' ? '→' : '←'}
        </button>
      ) : (
        <span className="app-bar-logo">📖</span>
      )}
      <div className="app-bar-title">{title ? t(title) : t('appName')}</div>
      <button className="app-bar-btn" onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} aria-label={t('toggleTheme')}>
        {settings.theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}

/** شريط التنقل السفلي على الموبايل */
export function BottomNav() {
  const { t } = useT();
  const { settings, stats } = useApp();
  const tabs = [
    ['/', '🏠', 'tab.home', true],
    [`/mushaf/${settings.lastPage || 1}`, '📗', 'tab.mushaf', false, '/mushaf'],
    ['/prayer', '🕌', 'tab.prayer'],
    ['/adhkar', '📿', 'tab.adhkar'],
    ['/more', '☰', 'nav.more'],
  ];
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav d-lg-none">
      {tabs.map(([to, icon, key, end, prefix]) => (
        <NavLink key={key} to={to} end={end}
          className={({ isActive }) => 'bottom-nav-item' + (isActive || (prefix && pathname.startsWith(prefix)) ? ' active' : '')}>
          <span className="bottom-nav-icon">
            {icon}
            {key === 'nav.more' && stats.due.length > 0 && <span className="bottom-nav-dot" />}
          </span>
          <span className="bottom-nav-label">{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
