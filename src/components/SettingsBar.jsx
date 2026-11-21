import { useMemo } from 'react';
import { getTranslationEditions, RECITERS, TAFSIRS } from '../api/quran';
import useAsync from '../hooks/useAsync';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';

function langName(code, ui) {
  try {
    return new Intl.DisplayNames([ui], { type: 'language' }).of(code) || code;
  } catch {
    return code;
  }
}

/** شريط الإعدادات: التفسير، ترجمة المعاني (كل اللغات)، القارئ، حجم الخط */
export default function SettingsBar({ showTafsir = true, showTranslation = true }) {
  const { settings, updateSettings } = useApp();
  const { t, pick, lang, num } = useT();
  const { data: editions } = useAsync(() => (showTranslation ? getTranslationEditions() : Promise.resolve([])), [showTranslation]);

  const groups = useMemo(() => {
    const g = {};
    (editions || []).forEach((e) => {
      (g[e.language] ||= []).push(e);
    });
    return Object.entries(g)
      .map(([code, list]) => ({ code, label: langName(code, lang), list }))
      .sort((a, b) => (a.code === lang ? -1 : b.code === lang ? 1 : a.label.localeCompare(b.label)));
  }, [editions, lang]);

  const col = showTafsir && showTranslation ? 'col-md-3' : 'col-md-4';

  return (
    <div className="card card-body shadow-sm mb-3">
      <div className="row g-2 align-items-end">
        {showTafsir && (
          <div className={col}>
            <label className="form-label small mb-1">{t('tafsirBook')}</label>
            <select className="form-select form-select-sm" value={settings.tafsir} onChange={(e) => updateSettings({ tafsir: e.target.value })}>
              {TAFSIRS.map((x) => <option key={x.id} value={x.id}>{pick(x.name)}</option>)}
            </select>
          </div>
        )}
        {showTranslation && (
          <div className={col}>
            <label className="form-label small mb-1">{t('translationLabel')}</label>
            <select
              className="form-select form-select-sm"
              value={settings.translation || ''}
              onChange={(e) => updateSettings({ translation: e.target.value, showTranslation: Boolean(e.target.value) })}
            >
              <option value="">{t('none')}</option>
              {groups.map((g) => (
                <optgroup key={g.code} label={g.label}>
                  {g.list.map((e) => <option key={e.identifier} value={e.identifier}>{e.name} — {e.englishName}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
        )}
        <div className={col}>
          <label className="form-label small mb-1">{t('reciter')}</label>
          <select className="form-select form-select-sm" value={settings.reciter} onChange={(e) => updateSettings({ reciter: e.target.value })}>
            {RECITERS.map((r) => <option key={r.id} value={r.id}>{pick(r.name)}</option>)}
          </select>
        </div>
        <div className={col}>
          <label className="form-label small mb-1">{t('fontSize')}: {num(settings.fontSize)}</label>
          <input type="range" className="form-range" min="20" max="48" value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })} />
        </div>
      </div>
    </div>
  );
}
