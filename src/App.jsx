import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SurahReader from './pages/SurahReader';
import Memorize from './pages/Memorize';
import Test from './pages/Test';
import Progress from './pages/Progress';
import { useApp } from './context/AppContext';
import { toArabicDigits } from './utils/arabic';

export default function App() {
  const [open, setOpen] = useState(false);
  const { stats } = useApp();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const link = ({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '');

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-quran sticky-top shadow-sm">
        <div className="container">
          <NavLink to="/" className="navbar-brand fw-bold">
            📖 حِفظ وتدبُّر
          </NavLink>
          <button className="navbar-toggler" type="button" onClick={() => setOpen((o) => !o)} aria-label="القائمة">
            <span className="navbar-toggler-icon" />
          </button>
          <div className={'collapse navbar-collapse' + (open ? ' show' : '')}>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to="/" end className={link}>السور</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/memorize/1" className={link}>الحفظ</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/test" className={link}>
                  التسميع والمراجعة
                  {stats.due.length > 0 && (
                    <span className="badge bg-warning text-dark ms-1">{toArabicDigits(stats.due.length)}</span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/progress" className={link}>تقدّمي</NavLink>
              </li>
            </ul>
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
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="text-center text-muted small py-4 border-top">
        النص القرآني والتفاسير والتلاوات من AlQuran Cloud — ﴿وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ﴾
      </footer>
    </>
  );
}
