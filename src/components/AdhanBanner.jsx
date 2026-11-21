import useAdhan from '../hooks/useAdhan';
import { useT } from '../i18n';
import { ADHAN_DUA, ADHAN_DUA_EN } from '../lib/adhan';

/** شريط يظهر وقت الأذان في أي صفحة، وبعد انتهائه يعرض الدعاء بعد الأذان */
export default function AdhanBanner() {
  const { current, stop, dismiss } = useAdhan();
  const { t, lang } = useT();
  if (!current) return null;

  return (
    <div className="adhan-banner shadow-lg">
      <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
        <strong>🕌 {t('adhanNow', { p: t('p.' + current.prayer) })}</strong>
        <div className="d-flex gap-2">
          {current.playing && <button className="btn btn-sm btn-light" onClick={stop}>■ {t('stop')}</button>}
          <button className="btn btn-sm btn-outline-light" onClick={dismiss} aria-label="close">✕</button>
        </div>
      </div>
      <div className="small opacity-75">{t('adhanDuaTitle')}</div>
      <div className="dhikr-text adhan-dua" dir="rtl">{ADHAN_DUA}</div>
      {lang !== 'ar' && <div className="small opacity-75">{ADHAN_DUA_EN}</div>}
      <div className="small opacity-50 mt-1">📚 {t('bukhari')}</div>
    </div>
  );
}
