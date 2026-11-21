import { useState } from 'react';
import {
  ARAFAH_DHIKR, BETWEEN_CORNERS, CHECKLIST, HAJJ_DAYS, HAJJ_TYPES, MAHZURAT, MAWAQIT, PILLARS, SAFA_DHIKR,
  TALBIYA, TALBIYA_EN, UMRAH_STEPS,
} from '../data/hajj';
import useLocalStorage from '../hooks/useLocalStorage';
import { useT } from '../i18n';

const DHIKR = { talbiya: TALBIYA, corners: BETWEEN_CORNERS, safa: SAFA_DHIKR, arafah: ARAFAH_DHIKR };
const TABS = ['umrah', 'hajj', 'ihram', 'checklist'];

function DhikrBox({ id }) {
  const { t, lang } = useT();
  if (!id) return null;
  return (
    <div className="dhikr-box mt-2">
      <div className="small text-muted mb-1">{t('sayHere')}</div>
      <div className="dhikr-text" dir="rtl">{DHIKR[id]}</div>
      {id === 'talbiya' && lang !== 'ar' && <div className="translation-text mt-1">{TALBIYA_EN}</div>}
    </div>
  );
}

function Steps({ steps, titleKey = 'title' }) {
  const { pick, num } = useT();
  const [open, setOpen] = useState(0);
  return (
    <div className="vstack gap-2">
      {steps.map((s, i) => (
        <div key={i} className="card shadow-sm">
          <button className="card-header step-head text-start d-flex align-items-center gap-2" onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="step-num">{num(i + 1)}</span>
            <span className="fw-semibold flex-grow-1">{pick(s[titleKey])}</span>
            <span>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div className="card-body">
              <ul className="mb-0 guide-list">
                {pick(s.points).map((p, k) => <li key={k}>{p}</li>)}
              </ul>
              <DhikrBox id={s.dhikr} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HajjUmrah() {
  const { t, pick, num } = useT();
  const [tab, setTab] = useState('umrah');
  const [checked, setChecked] = useLocalStorage('hifz:hajjChecklist', {});
  const doneCount = CHECKLIST.filter((c) => checked[c.id]).length;

  return (
    <>
      <h2 className="h4 mb-2">🕋 {t('nav.hajj')}</h2>
      <div className="alert alert-light border small">{t('hajjDisclaimer')}</div>

      <ul className="nav nav-pills mb-3 flex-nowrap overflow-auto">
        {TABS.map((k) => (
          <li className="nav-item" key={k}>
            <button className={'nav-link text-nowrap' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{t('hajjTab.' + k)}</button>
          </li>
        ))}
      </ul>

      {tab === 'umrah' && <Steps steps={UMRAH_STEPS} />}

      {tab === 'hajj' && (
        <>
          <div className="card card-body shadow-sm mb-3">
            <h3 className="h6 fw-bold">{t('hajjTypes')}</h3>
            <ul className="mb-0 guide-list">{pick(HAJJ_TYPES).map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
          <Steps steps={HAJJ_DAYS} titleKey="day" />
          <div className="row g-3 mt-1">
            <div className="col-md-6">
              <div className="card card-body shadow-sm h-100">
                <h3 className="h6 fw-bold text-danger">{t('arkan')}</h3>
                <ol className="mb-0">{pick(PILLARS.arkan).map((x, i) => <li key={i}>{x}</li>)}</ol>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card card-body shadow-sm h-100">
                <h3 className="h6 fw-bold text-primary">{t('wajibat')}</h3>
                <ol className="mb-0">{pick(PILLARS.wajibat).map((x, i) => <li key={i}>{x}</li>)}</ol>
              </div>
            </div>
          </div>
          <div className="alert alert-warning small mt-3">{pick(PILLARS.note)}</div>
        </>
      )}

      {tab === 'ihram' && (
        <>
          <div className="card card-body shadow-sm mb-3">
            <h3 className="h6 fw-bold">{t('talbiya')}</h3>
            <DhikrBox id="talbiya" />
          </div>
          <div className="card card-body shadow-sm mb-3">
            <h3 className="h6 fw-bold">{t('mawaqit')}</h3>
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <tbody>
                  {MAWAQIT.map((m, i) => (
                    <tr key={i}><td className="fw-semibold">{pick(m.name)}</td><td className="text-muted">{pick(m.for)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card card-body shadow-sm">
            <h3 className="h6 fw-bold text-danger">{t('mahzurat')}</h3>
            <ul className="mb-0 guide-list">{pick(MAHZURAT).map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        </>
      )}

      {tab === 'checklist' && (
        <div className="card card-body shadow-sm">
          <div className="d-flex justify-content-between mb-2">
            <h3 className="h6 fw-bold mb-0">{t('travelChecklist')}</h3>
            <span className="badge bg-success">{num(doneCount)} / {num(CHECKLIST.length)}</span>
          </div>
          {CHECKLIST.map((c) => (
            <div className="form-check py-1" key={c.id}>
              <input className="form-check-input" type="checkbox" id={c.id} checked={!!checked[c.id]}
                onChange={(e) => setChecked((x) => ({ ...x, [c.id]: e.target.checked }))} />
              <label className="form-check-label" htmlFor={c.id}>{pick(c)}</label>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
