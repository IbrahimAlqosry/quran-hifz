import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCATION, distanceToMakkah, getPrayerTimes, METHODS, PRAYERS, qiblaDirection, toDate } from '../api/prayer';
import AdhanSettings from '../components/AdhanSettings';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import { ErrorBox, Loader } from '../components/Status';


export default function PrayerTimes() {
  const { settings, updateSettings } = useApp();
  const { t, num, pick, lang } = useT();
  const location = settings.location || DEFAULT_LOCATION;
  const [reload, setReload] = useState(0);
  const { data, loading, error } = useAsync(
    () => getPrayerTimes(location, settings.prayerMethod),
    [JSON.stringify(location), settings.prayerMethod, reload]
  );

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // الصلاة القادمة والعد التنازلي
  const next = useMemo(() => {
    if (!data) return null;
    const list = PRAYERS.filter((p) => p !== 'Sunrise').map((p) => ({ p, at: toDate(data.timings[p]) }));
    let n = list.find((x) => x.at.getTime() > now);
    if (!n) {
      const fajr = toDate(data.timings.Fajr);
      fajr.setDate(fajr.getDate() + 1);
      n = { p: 'Fajr', at: fajr };
    }
    const diff = Math.max(0, n.at.getTime() - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { ...n, left: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` };
  }, [data, now]);

  // تغيير الموقع
  const [city, setCity] = useState(location.city || '');
  const [country, setCountry] = useState(location.country || '');
  const [geoMsg, setGeoMsg] = useState('');

  const useGps = () => {
    if (!navigator.geolocation) return setGeoMsg(t('geoUnsupported'));
    setGeoMsg(t('locating'));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateSettings({ location: { lat: +pos.coords.latitude.toFixed(4), lng: +pos.coords.longitude.toFixed(4) } });
        setGeoMsg('');
      },
      () => setGeoMsg(t('geoDenied')),
      { timeout: 15000 }
    );
  };

  const saveCity = (e) => {
    e.preventDefault();
    if (city.trim()) updateSettings({ location: { city: city.trim(), country: country.trim() } });
  };

  // القبلة + البوصلة
  const qibla = data && !Number.isNaN(data.lat) ? qiblaDirection(data.lat, data.lng) : null;
  const [heading, setHeading] = useState(null);
  const [compassMsg, setCompassMsg] = useState('');

  useEffect(() => {
    const onOrient = (e) => {
      if (typeof e.webkitCompassHeading === 'number') setHeading(e.webkitCompassHeading);
      else if (e.absolute && typeof e.alpha === 'number') setHeading((360 - e.alpha) % 360);
    };
    window.addEventListener('deviceorientationabsolute', onOrient);
    window.addEventListener('deviceorientation', onOrient);
    return () => {
      window.removeEventListener('deviceorientationabsolute', onOrient);
      window.removeEventListener('deviceorientation', onOrient);
    };
  }, []);

  const enableCompass = async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const r = await DeviceOrientationEvent.requestPermission();
        if (r !== 'granted') return setCompassMsg(t('compassDenied'));
      }
      setCompassMsg(t('compassHint'));
    } catch {
      setCompassMsg(t('compassDenied'));
    }
  };

  const arrow = qibla == null ? 0 : heading == null ? qibla : (qibla - heading + 360) % 360;
  const hijri = data?.hijri;
  const locLabel = location.city ? `${location.city}${location.country ? ', ' + location.country : ''}` : `${num(location.lat)}, ${num(location.lng)}`;

  return (
    <>
      <h2 className="h4 mb-3 page-title">🕌 {t('nav.prayer')}</h2>

      {loading && !data && <Loader />}
      {error && <ErrorBox error={error} onRetry={() => setReload((r) => r + 1)} />}

      {data && (
        <div className="row g-3 mb-3">
          <div className="col-lg-7">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                  <div>
                    <div className="fw-bold">📍 {locLabel}</div>
                    {hijri && (
                      <div className="small text-muted">
                        {lang === 'ar' ? hijri.weekday?.ar : hijri.weekday?.en} — {num(hijri.day)} {lang === 'ar' ? hijri.month?.ar : hijri.month?.en} {num(hijri.year)} {t('hijriSuffix')}
                        {data.gregorian && <> · {data.gregorian.date}</>}
                      </div>
                    )}
                  </div>
                  {next && (
                    <div className="next-prayer text-center">
                      <div className="small">{t('nextPrayer')}: <strong>{t('p.' + next.p)}</strong></div>
                      <div className="fs-4 fw-bold font-monospace">{next.left}</div>
                    </div>
                  )}
                </div>
                <ul className="list-group">
                  {PRAYERS.map((p) => (
                    <li key={p} className={'list-group-item d-flex justify-content-between align-items-center' + (next?.p === p ? ' active-prayer' : '')}>
                      <span>{t('p.' + p)}</span>
                      <span className="fw-bold font-monospace">{data.timings[p]}</span>
                    </li>
                  ))}
                </ul>
                <div className="small text-muted mt-2">{t('tzNote', { tz: data.timezone || '' })}</div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm h-100 text-center">
              <div className="card-body">
                <h3 className="h6 fw-bold">🧭 {t('qibla')}</h3>
                {qibla != null ? (
                  <>
                    <div className="compass my-3">
                      <div className="compass-n">N</div>
                      <div className="compass-arrow" style={{ transform: `rotate(${arrow}deg)` }}>🕋</div>
                    </div>
                    <div>{t('qiblaDeg', { d: num(qibla.toFixed(1)) })}</div>
                    <div className="small text-muted">{t('distance', { km: num(distanceToMakkah(data.lat, data.lng).toLocaleString('en')) })}</div>
                    <button className="btn btn-sm btn-outline-success mt-2" onClick={enableCompass}>{t('enableCompass')}</button>
                    {compassMsg && <div className="small text-muted mt-2">{compassMsg}</div>}
                    {heading == null && <div className="small text-muted mt-1">{t('compassFallback')}</div>}
                  </>
                ) : (
                  <div className="text-muted small">{t('qiblaNeedsLocation')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AdhanSettings />

      <div className="card card-body shadow-sm">
        <h3 className="h6 fw-bold">{t('locationSettings')}</h3>
        <button className="btn btn-success mb-2" onClick={useGps}>📍 {t('useMyLocation')}</button>
        {geoMsg && <div className="small text-muted mb-2">{geoMsg}</div>}
        <form className="row g-2 mb-3" onSubmit={saveCity}>
          <div className="col-5"><input className="form-control" placeholder={t('city')} value={city} onChange={(e) => setCity(e.target.value)} /></div>
          <div className="col-4"><input className="form-control" placeholder={t('country')} value={country} onChange={(e) => setCountry(e.target.value)} /></div>
          <div className="col-3"><button className="btn btn-outline-success w-100">{t('save')}</button></div>
        </form>
        <label className="form-label small mb-1">{t('calcMethod')}</label>
        <select className="form-select" value={settings.prayerMethod} onChange={(e) => updateSettings({ prayerMethod: Number(e.target.value) })}>
          {METHODS.map((m) => <option key={m.id} value={m.id}>{pick(m.name)}</option>)}
        </select>
      </div>
    </>
  );
}
