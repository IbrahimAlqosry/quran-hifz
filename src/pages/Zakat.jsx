import { useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useT } from '../i18n';
import QuranPassage from '../components/QuranPassage';

// النصاب: ٨٥ جرام ذهب خالص (عيار ٢٤) أو ٥٩٥ جرام فضة خالصة — والزكاة ربع العشر ٢٫٥٪
const GOLD_NISAB = 85;
const SILVER_NISAB = 595;
const KARATS = [24, 22, 21, 18];

const EMPTY = {
  currency: 'EGP', goldPrice: '', silverPrice: '', nisabBasis: 'gold',
  cash: '', bank: '', investments: '', receivables: '', trade: '', debts: '',
  gold: { 24: '', 22: '', 21: '', 18: '' }, silver: '', includeJewelry: true,
};

const n = (v) => {
  const x = parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(x) && x > 0 ? x : 0;
};

export default function Zakat() {
  const { t, num, pick } = useT();
  const [f, setF] = useLocalStorage('hifz:zakat', EMPTY);
  const [tab, setTab] = useState('money');
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const r = useMemo(() => {
    const pureGold = KARATS.reduce((s, k) => s + (n(f.gold?.[k]) * k) / 24, 0);
    const goldValue = pureGold * n(f.goldPrice);
    const silverValue = n(f.silver) * n(f.silverPrice);
    const metals = f.includeJewelry ? goldValue + silverValue : 0;
    const assets = n(f.cash) + n(f.bank) + n(f.investments) + n(f.receivables) + n(f.trade) + metals;
    const net = Math.max(0, assets - n(f.debts));
    const nisab = f.nisabBasis === 'gold' ? GOLD_NISAB * n(f.goldPrice) : SILVER_NISAB * n(f.silverPrice);
    const hasPrice = nisab > 0;
    const due = hasPrice && net >= nisab ? net * 0.025 : 0;
    return { pureGold, goldValue, silverValue, assets, net, nisab, hasPrice, due };
  }, [f]);

  const money = (v) => `${num(Math.round(v).toLocaleString('en'))} ${f.currency}`;
  const field = (k, label) => (
    <div className="col-sm-6" key={k}>
      <label className="form-label small mb-1">{label}</label>
      <input type="number" inputMode="decimal" min="0" className="form-control" value={f[k]} onChange={(e) => set(k, e.target.value)} />
    </div>
  );

  return (
    <>
      <h2 className="h4 mb-3 page-title">💰 {t('nav.zakat')}</h2>
      <ul className="nav nav-pills mb-3 flex-nowrap overflow-auto">
        {['money', 'fitr', 'other'].map((k) => (
          <li className="nav-item" key={k}>
            <button className={'nav-link text-nowrap' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{t('zakatTab.' + k)}</button>
          </li>
        ))}
      </ul>

      {tab === 'money' && (
        <div className="row g-3">
          <div className="col-lg-7">
            <div className="card card-body shadow-sm mb-3">
              <h3 className="h6 fw-bold">1. {t('zPrices')}</h3>
              <div className="row g-2">
                <div className="col-4">
                  <label className="form-label small mb-1">{t('zCurrency')}</label>
                  <input className="form-control" value={f.currency} onChange={(e) => set('currency', e.target.value.toUpperCase().slice(0, 4))} />
                </div>
                <div className="col-4">
                  <label className="form-label small mb-1">{t('zGoldPrice')}</label>
                  <input type="number" min="0" className="form-control" value={f.goldPrice} onChange={(e) => set('goldPrice', e.target.value)} />
                </div>
                <div className="col-4">
                  <label className="form-label small mb-1">{t('zSilverPrice')}</label>
                  <input type="number" min="0" className="form-control" value={f.silverPrice} onChange={(e) => set('silverPrice', e.target.value)} />
                </div>
              </div>
              <div className="small text-muted mt-2">{t('zPriceHint')}</div>
              <div className="mt-2">
                <span className="small me-2">{t('zNisabBasis')}:</span>
                {['gold', 'silver'].map((b) => (
                  <div className="form-check form-check-inline" key={b}>
                    <input className="form-check-input" type="radio" id={'nb-' + b} checked={f.nisabBasis === b} onChange={() => set('nisabBasis', b)} />
                    <label className="form-check-label small" htmlFor={'nb-' + b}>{t('zBasis.' + b)}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-body shadow-sm mb-3">
              <h3 className="h6 fw-bold">2. {t('zAssets')}</h3>
              <div className="row g-2">
                {field('cash', t('zCash'))}
                {field('bank', t('zBank'))}
                {field('investments', t('zInvest'))}
                {field('receivables', t('zReceivables'))}
                {field('trade', t('zTrade'))}
                {field('debts', t('zDebts'))}
              </div>
            </div>

            <div className="card card-body shadow-sm">
              <h3 className="h6 fw-bold">3. {t('zGold')}</h3>
              <div className="row g-2">
                {KARATS.map((k) => (
                  <div className="col-3" key={k}>
                    <label className="form-label small mb-1">{t('zKarat', { k: num(k) })}</label>
                    <input type="number" min="0" className="form-control" value={f.gold?.[k] || ''}
                      onChange={(e) => setF((x) => ({ ...x, gold: { ...x.gold, [k]: e.target.value } }))} />
                  </div>
                ))}
                <div className="col-6">
                  <label className="form-label small mb-1">{t('zSilverGrams')}</label>
                  <input type="number" min="0" className="form-control" value={f.silver} onChange={(e) => set('silver', e.target.value)} />
                </div>
              </div>
              <div className="form-check mt-2">
                <input className="form-check-input" type="checkbox" id="jew" checked={f.includeJewelry} onChange={(e) => set('includeJewelry', e.target.checked)} />
                <label className="form-check-label small" htmlFor="jew">{t('zIncludeJewelry')}</label>
              </div>
              <div className="small text-muted">{t('zJewelryNote')}</div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm zakat-result sticky-lg-top" style={{ top: 80 }}>
              <div className="card-body">
                <h3 className="h6 fw-bold">{t('zResult')}</h3>
                <ul className="list-unstyled small mb-3">
                  <li className="d-flex justify-content-between"><span>{t('zPureGold')}</span><span>{num(r.pureGold.toFixed(2))} g</span></li>
                  <li className="d-flex justify-content-between"><span>{t('zTotalAssets')}</span><span>{money(r.assets)}</span></li>
                  <li className="d-flex justify-content-between"><span>{t('zDebts')}</span><span>− {money(n(f.debts))}</span></li>
                  <li className="d-flex justify-content-between fw-bold"><span>{t('zNet')}</span><span>{money(r.net)}</span></li>
                  <li className="d-flex justify-content-between"><span>{t('zNisab')}</span><span>{r.hasPrice ? money(r.nisab) : '—'}</span></li>
                </ul>
                {!r.hasPrice ? (
                  <div className="alert alert-warning small mb-0">{t('zNeedPrice')}</div>
                ) : r.due > 0 ? (
                  <div className="text-center">
                    <div className="small">{t('zDue')}</div>
                    <div className="display-6 fw-bold text-success">{money(r.due)}</div>
                    <div className="small text-muted">{t('zRate')}</div>
                  </div>
                ) : (
                  <div className="alert alert-info small mb-0">{t('zBelowNisab')}</div>
                )}
                <hr />
                <ul className="small text-muted mb-0 ps-3">
                  <li>{t('zHawl')}</li>
                  <li>{t('zHouse')}</li>
                  <li>{t('zConsult')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'fitr' && (
        <div className="card card-body shadow-sm">
          <ul className="guide-list mb-0">
            {pick(FITR).map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      )}

      {tab === 'other' && (
        <>
          <div className="card card-body shadow-sm mb-3">
            <h3 className="h6 fw-bold">{t('zRecipients')}</h3>
            <QuranPassage s={9} from={60} to={60} showRef />
          </div>
          <div className="card card-body shadow-sm">
            <ul className="guide-list mb-0">{pick(OTHER).map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        </>
      )}
    </>
  );
}

const FITR = {
  ar: [
    'زكاة الفطر واجبة على كل مسلم يملك قوت يومه وليلته يوم العيد، يخرجها عن نفسه وعمّن تلزمه نفقتهم.',
    'مقدارها صاع من غالب قوت البلد (أرز، قمح، تمر…)، ويقدّر بنحو ٢٫٥ إلى ٣ كيلوجرامات.',
    'يجيز الحنفية ودار الإفتاء المصرية إخراجها نقدًا بقيمة الصاع، وتعلن دار الإفتاء القيمة كل عام — والجمهور على إخراجها طعامًا.',
    'وقتها: من غروب شمس آخر يوم من رمضان إلى صلاة العيد، ويجوز تعجيلها قبل العيد بيوم أو يومين، ولا يجوز تأخيرها بعد الصلاة بلا عذر.',
    'تُعطى للفقراء والمساكين.',
  ],
  en: [
    'Zakat al-Fitr is obligatory on every Muslim who has food for the day and night of Eid, paid for oneself and one’s dependants.',
    'It is one sa‘ of the local staple food (rice, wheat, dates…), roughly 2.5–3 kg per person.',
    'The Hanafi school and Egypt’s Dar al-Ifta allow paying its cash value (announced yearly); the majority require paying it in food.',
    'Time: from sunset on the last day of Ramadan until the Eid prayer; it may be paid a day or two early, and must not be delayed past the prayer without excuse.',
    'It is given to the poor and needy.',
  ],
};

const OTHER = {
  ar: [
    'زكاة الزروع والثمار: نصابها خمسة أوسق (≈ ٦٥٣ كجم)، والواجب العُشر (١٠٪) فيما سُقي بلا كلفة كالمطر، ونصف العُشر (٥٪) فيما سُقي بالآلات أو بمؤنة، وتُخرج عند الحصاد.',
    'زكاة الأنعام (الإبل والبقر والغنم السائمة): لها أنصبة ومقادير مفصّلة — أقلها في الغنم ٤٠ شاة فيها شاة.',
    'الركاز (الكنز المدفون): فيه الخُمس (٢٠٪).',
    'الأسهم والصناديق: إن كانت للمتاجرة زُكّيت قيمتها السوقية كلها، وإن كانت للاستثمار طويل الأجل ففيها تفصيل بين أهل العلم.',
    'المال المستفاد أثناء الحول (كالراتب) يُضم لما عندك، والأيسر تحديد يوم سنوي ثابت تحسب فيه زكاة كل ما تملك.',
  ],
  en: [
    'Crops and fruits: nisab is five awsuq (≈ 653 kg); 10% if watered naturally (rain), 5% if irrigated at a cost; paid at harvest.',
    'Grazing livestock (camels, cattle, sheep): detailed thresholds — the minimum for sheep is 40, on which one sheep is due.',
    'Buried treasure (rikaz): one fifth (20%).',
    'Shares and funds: if held for trading, zakat is on the full market value; long-term investments have more detailed rulings.',
    'Wealth acquired during the year (such as salary) is added to what you own; it is easiest to pick one fixed day a year to calculate zakat on everything.',
  ],
};
