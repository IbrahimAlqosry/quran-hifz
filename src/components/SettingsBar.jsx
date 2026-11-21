import { RECITERS, TAFSIRS } from '../api/quran';
import { useApp } from '../context/AppContext';

/** شريط الإعدادات: التفسير، القارئ، حجم الخط */
export default function SettingsBar({ showTafsir = true }) {
  const { settings, updateSettings } = useApp();

  return (
    <div className="card card-body shadow-sm mb-3">
      <div className="row g-2 align-items-end">
        {showTafsir && (
          <div className="col-md-4">
            <label className="form-label small mb-1">كتاب التفسير</label>
            <select
              className="form-select form-select-sm"
              value={settings.tafsir}
              onChange={(e) => updateSettings({ tafsir: e.target.value })}
            >
              {TAFSIRS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="col-md-4">
          <label className="form-label small mb-1">القارئ</label>
          <select
            className="form-select form-select-sm"
            value={settings.reciter}
            onChange={(e) => updateSettings({ reciter: e.target.value })}
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label small mb-1">حجم الخط: {settings.fontSize}</label>
          <input
            type="range"
            className="form-range"
            min="20"
            max="48"
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
