import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import bsRtl from 'bootstrap/dist/css/bootstrap.rtl.min.css?url';
import bsLtr from 'bootstrap/dist/css/bootstrap.min.css?url';
import Home from './pages/Home';
import SurahReader from './pages/SurahReader';
import Memorize from './pages/Memorize';
import Test from './pages/Test';
import Progress from './pages/Progress';
import PrayerTimes from './pages/PrayerTimes';
import Adhkar from './pages/Adhkar';
import Duas from './pages/Duas';
import HajjUmrah from './pages/HajjUmrah';
import Tasbeeh from './pages/Tasbeeh';
import Search from './pages/Search';
import Zakat from './pages/Zakat';
import Sadaqah from './pages/Sadaqah';
import AdhanBanner from './components/AdhanBanner';
import { useApp } from './context/AppContext';
import { DEFAULT_TRANSLATION, LANGS, useT } from './i18n';

export default function App() {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const { stats, settings, updateSettings } = useApp();
  const { t, num, lang, dir } = useT();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setMore(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // اتجاه الصفحة + نسخة Bootstrap المناسبة (RTL/LTR) + الوضع الليلي
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
    html.setAttribute('data-bs-theme', settings.theme === 'dark' ? 'dark' : 'light');
    let link = document.getElementById('bs-css');
    if (!link) {
      link = document.createElement('link');
      link.id = 'bs-css';
      link.rel = 'stylesheet';
      document.head.prepend(link);
    }
    const href = dir === 'rtl' ? bsRtl : bsLtr;
    if (link.getAttribute('href') !== href) link.setAttribute('href', href);
    document.title = t('appTitle');
  }, [lang, dir, settings.theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeLang = (code) =>
    updateSettings({ lang: code, translation: DEFAULT_TRANSLATION[code], showTranslation: code !== 'ar' });

  const link = ({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '');
  const moreLinks = [
    ['/duas', 'nav.duas'],
    ['/hajj', 'nav.hajj'],
    ['/zakat', 'nav.zakat'],
    ['/sadaqah', 'nav.sadaqah'],
    ['/tasbeeh', 'nav.tasbeeh'],
    ['/search', 'nav.search'],
    ['/test', 'nav.test'],
    ['/progress', 'nav.progress'],
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-quran sticky-top shadow-sm">
        <div className="container">
          <NavLink to="/" className="navbar-brand fw-bold">📖 {t('appName')}</NavLink>
          <button className="navbar-toggler" type="button" onClick={() => setOpen((o) => !o)} aria-label="menu">
            <span className="navbar-toggler-icon" />
          </button>
          <div className={'collapse navbar-collapse' + (open ? ' show' : '')}>
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><NavLink to="/" end className={link}>{t('nav.quran')}</NavLink></li>
              <li className="nav-item"><NavLink to="/memorize/1" className={link}>{t('nav.memorize')}</NavLink></li>
              <li className="nav-item"><NavLink to="/prayer" className={link}>{t('nav.prayer')}</NavLink></li>
              <li className="nav-item"><NavLink to="/adhkar" className={link}>{t('nav.adhkar')}</NavLink></li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link" onClick={() => setMore((m) => !m)}>
                  {t('nav.more')}
                  {stats.due.length > 0 && <span className="badge bg-warning text-dark ms-1">{num(stats.due.length)}</span>}
                </button>
                <ul className={'dropdown-menu' + (more ? ' show' : '')}>
                  {moreLinks.map(([to, key]) => (
                    <li key={to}>
                      <NavLink to={to} className="dropdown-item">
                        {t(key)}
                        {to === '/test' && stats.due.length > 0 && <span className="badge bg-warning text-dark ms-1">{num(stats.due.length)}</span>}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <div className="d-flex gap-2 align-items-center py-2 py-lg-0">
              <select className="form-select form-select-sm lang-select" value={lang} onChange={(e) => changeLang(e.target.value)} aria-label="language">
                {LANGS.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
              <button
                className="btn btn-sm btn-outline-light"
                title={t('toggleTheme')}
                onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              >
                {settings.theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:n" element={<SurahReader />} />
          <Route path="/memorize/:n" element={<Memorize />} />
          <Route path="/test" element={<Test />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/prayer" element={<PrayerTimes />} />
          <Route path="/adhkar" element={<Adhkar />} />
          <Route path="/duas" element={<Duas />} />
          <Route path="/hajj" element={<HajjUmrah />} />
          <Route path="/tasbeeh" element={<Tasbeeh />} />
          <Route path="/search" element={<Search />} />
          <Route path="/zakat" element={<Zakat />} />
          <Route path="/sadaqah" element={<Sadaqah />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <AdhanBanner />

      <footer className="text-center text-muted small py-4 border-top">
        <div className="quran-font fs-6 mb-1" dir="rtl">﴿وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ﴾</div>
        {t('footer')}
      </footer>
    </>
  );
}
