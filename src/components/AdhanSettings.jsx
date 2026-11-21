import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';
import { ADHAN_VOICES, adhanUrl, getAudio, requestNotify, unlockAudio } from '../lib/adhan';

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function AdhanSettings() {
  const { settings, updateSettings } = useApp();
  const { t, pick } = useT();
  const cfg = settings.adhan || { enabled: false, voice: 'makkah', prayers: {} };
  const [previewing, setPreviewing] = useState(false);

  const set = (patch) => updateSettings({ adhan: { ...cfg, ...patch } });

  const toggle = async () => {
    if (!cfg.enabled) {
      await unlockAudio(cfg.voice);
      await requestNotify();
    }
    set({ enabled: !cfg.enabled });
  };

  const preview = () => {
    const a = getAudio();
    if (previewing) {
      a.pause();
      setPreviewing(false);
      return;
    }
    a.src = adhanUrl(cfg.voice);
    a.currentTime = 0;
    a.onended = () => setPreviewing(false);
    a.play().then(() => setPreviewing(true)).catch(() => setPreviewing(false));
  };

  return (
    <div className="card card-body shadow-sm mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="h6 fw-bold mb-0">📢 {t('adhanTitle')}</h3>
        <div className="form-check form-switch m-0">
          <input className="form-check-input" type="checkbox" role="switch" id="adhan-on" checked={!!cfg.enabled} onChange={toggle} />
          <label className="form-check-label" htmlFor="adhan-on">{cfg.enabled ? t('on') : t('off')}</label>
        </div>
      </div>

      <div className="row g-2 align-items-end mb-2">
        <div className="col-8">
          <label className="form-label small mb-1">{t('adhanVoice')}</label>
          <select className="form-select form-select-sm" value={cfg.voice}
            onChange={(e) => { getAudio().pause(); setPreviewing(false); set({ voice: e.target.value }); }}>
            {[['eg', 'adhanEg'], ['sa', 'adhanSa'], ['other', 'adhanOther']].map(([g, k]) => (
              <optgroup key={g} label={t(k)}>
                {ADHAN_VOICES.filter((v) => v.group === g).map((v) => <option key={v.id} value={v.id}>{pick(v.name)}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="col-4">
          <button className="btn btn-sm btn-outline-success w-100" onClick={preview}>
            {previewing ? `■ ${t('stop')}` : `▶ ${t('adhanPreview')}`}
          </button>
        </div>
      </div>

      <div className="small mb-1">{t('adhanPrayers')}</div>
      <div className="d-flex flex-wrap gap-3 mb-2">
        {PRAYERS.map((p) => (
          <div className="form-check" key={p}>
            <input className="form-check-input" type="checkbox" id={`adhan-${p}`} checked={!!cfg.prayers?.[p]}
              onChange={(e) => set({ prayers: { ...cfg.prayers, [p]: e.target.checked } })} />
            <label className="form-check-label" htmlFor={`adhan-${p}`}>{t('p.' + p)}</label>
          </div>
        ))}
      </div>
      <div className="small text-muted">ℹ️ {t('adhanNote')}</div>
    </div>
  );
}
