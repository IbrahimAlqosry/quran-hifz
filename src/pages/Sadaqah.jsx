import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n';

// الأضحية والصدقات — أحكام مختصرة على ما عليه عامة أهل العلم، مع الأحاديث وعزوها

const UDHIYA = [
  {
    title: { ar: 'حكمها', en: 'Ruling' },
    points: {
      ar: ['سنة مؤكدة عند جمهور العلماء للقادر، وأوجبها الحنفية على المقيم الموسر.', 'تُجزئ الشاة الواحدة عن الرجل وأهل بيته.'],
      en: ['A confirmed Sunnah for those able, according to the majority; the Hanafis consider it obligatory for a resident who can afford it.', 'One sheep suffices for a man and his household.'],
    },
  },
  {
    title: { ar: 'وقتها', en: 'Time' },
    points: {
      ar: ['يبدأ بعد صلاة عيد الأضحى، وينتهي بغروب شمس ١٣ ذي الحجة (آخر أيام التشريق).', 'من ذبح قبل صلاة العيد فهي شاة لحم وليست أضحية.'],
      en: ['From after the Eid al-Adha prayer until sunset on 13 Dhul-Hijjah (the last day of Tashreeq).', 'An animal slaughtered before the Eid prayer is ordinary meat, not an udhiyah.'],
    },
  },
  {
    title: { ar: 'السن المجزئة', en: 'Minimum age' },
    points: {
      ar: ['الضأن (الخروف): ما أتم ستة أشهر (الجَذَع).', 'المعز: سنة كاملة.', 'البقر والجاموس: سنتان.', 'الإبل: خمس سنين.'],
      en: ['Sheep: six months.', 'Goats: one full year.', 'Cattle and buffalo: two years.', 'Camels: five years.'],
    },
  },
  {
    title: { ar: 'العيوب المانعة', en: 'Disqualifying defects' },
    points: {
      ar: [
        'قال ﷺ: «أربع لا تجوز في الأضاحي: العوراء البيّن عورها، والمريضة البيّن مرضها، والعرجاء البيّن ظلعها، والكسير التي لا تُنقي» (رواه أبو داود والترمذي).',
        'ويُلحق بها ما كان أشد منها كالعمياء ومقطوعة الرِّجل.',
      ],
      en: [
        'The Prophet ﷺ said: “Four are not acceptable for sacrifice: one clearly blind in one eye, one clearly sick, one clearly lame, and one so emaciated it has no marrow” (Abu Dawud, At-Tirmidhi).',
        'Worse defects, such as total blindness or a missing leg, are included.',
      ],
    },
  },
  {
    title: { ar: 'الاشتراك', en: 'Sharing' },
    points: {
      ar: ['تجزئ البدنة (الجمل) والبقرة عن سبعة أشخاص، لكل واحد سُبعها.', 'الشاة لا يُشترك فيها، لكن يُشرك المضحي أهل بيته في الثواب.'],
      en: ['A camel or a cow may be shared by seven people, each owning a seventh.', 'A sheep cannot be shared in ownership, but one may include his household in its reward.'],
    },
  },
  {
    title: { ar: 'الذبح والتوزيع', en: 'Slaughter & distribution' },
    points: {
      ar: [
        'يُستحب أن يذبحها بنفسه إن أحسن، ويقول: «بسم الله والله أكبر، اللهم هذا منك ولك».',
        'الإحسان في الذبح: حدّ الشفرة، وإراحة الذبيحة، وعدم الذبح أمام الأخرى.',
        'يُستحب تقسيمها أثلاثًا: يأكل ثلثًا، ويهدي ثلثًا، ويتصدق بثلث.',
        'لا يُباع منها شيء (ولا جلدها)، ولا يُعطى الجزّار أجرته منها.',
      ],
      en: [
        'It is recommended to slaughter it yourself if able, saying: “Bismillah, wallahu akbar; O Allah, this is from You and for You.”',
        'Slaughter with excellence: sharpen the blade, keep the animal calm, and do not slaughter in front of other animals.',
        'It is recommended to divide it in thirds: eat a third, gift a third, and give a third in charity.',
        'Nothing of it may be sold (not even the skin), and the butcher is not paid from it.',
      ],
    },
  },
  {
    title: { ar: 'لمن أراد أن يضحي', en: 'For whoever intends to sacrifice' },
    points: {
      ar: ['قال ﷺ: «إذا دخل العشر وأراد أحدكم أن يضحي فلا يمس من شعره وبشره شيئًا» (رواه مسلم) — من أول ذي الحجة حتى يذبح.'],
      en: ['The Prophet ﷺ said: “When the ten days begin and one of you intends to sacrifice, let him not take anything from his hair or skin” (Muslim) — from 1 Dhul-Hijjah until the slaughter.'],
    },
  },
];

const VIRTUES = [
  { text: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ', en: 'Charity never decreases wealth.', src: { ar: 'رواه مسلم', en: 'Muslim' } },
  { text: 'اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ', en: 'Protect yourselves from the Fire, even with half a date.', src: { ar: 'متفق عليه', en: 'Al-Bukhari & Muslim' } },
  {
    text: 'إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
    en: 'When a person dies, his deeds end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.',
    src: { ar: 'رواه مسلم', en: 'Muslim' },
  },
  {
    text: 'الصَّدَقَةُ عَلَى الْمِسْكِينِ صَدَقَةٌ، وَهِيَ عَلَى ذِي الرَّحِمِ ثِنْتَانِ: صَدَقَةٌ وَصِلَةٌ',
    en: 'Charity to the poor is charity; to a relative it is twofold: charity and upholding kinship.',
    src: { ar: 'رواه الترمذي والنسائي', en: "At-Tirmidhi & An-Nasa'i" },
  },
  {
    text: 'وَرَجُلٌ تَصَدَّقَ بِصَدَقَةٍ فَأَخْفَاهَا حَتَّى لَا تَعْلَمَ شِمَالُهُ مَا تُنْفِقُ يَمِينُهُ',
    en: '(Among the seven shaded by Allah:) a man who gives charity so secretly that his left hand does not know what his right hand gives.',
    src: { ar: 'متفق عليه', en: 'Al-Bukhari & Muslim' },
  },
  {
    text: 'كُلُّ مَعْرُوفٍ صَدَقَةٌ',
    en: 'Every act of kindness is charity.',
    src: { ar: 'رواه البخاري', en: 'Al-Bukhari' },
  },
];

const JARIYA = {
  ar: [
    'حفر بئر أو توصيل مياه شرب، أو وضع مبرّد مياه في مكان عام',
    'بناء مسجد أو المساهمة فيه، أو فرشه وإنارته',
    'طباعة المصاحف وتوزيعها، أو دعم حلقات التحفيظ',
    'كفالة يتيم أو طالب علم',
    'غرس شجرة ينتفع بها الناس',
    'المساهمة في مستشفى أو جهاز طبي أو وقف خيري',
    'نشر علم نافع — ومنه مشاركة هذا التطبيق',
  ],
  en: [
    'Digging a well, providing drinking water, or a public water cooler',
    'Building or contributing to a mosque, its carpets or lighting',
    'Printing and distributing Qurans, or supporting memorization circles',
    'Sponsoring an orphan or a student of knowledge',
    'Planting a tree that benefits people',
    'Contributing to a hospital, medical equipment or a charitable endowment (waqf)',
    'Spreading beneficial knowledge — including sharing this app',
  ],
};

export default function Sadaqah() {
  const { settings } = useApp();
  const { t, pick, num, lang } = useT();
  const [tab, setTab] = useState('udhiya');

  return (
    <>
      <h2 className="h4 mb-3">🐑 {t('nav.sadaqah')}</h2>
      <ul className="nav nav-pills mb-3">
        {['udhiya', 'sadaqah'].map((k) => (
          <li className="nav-item" key={k}>
            <button className={'nav-link' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{t('sadTab.' + k)}</button>
          </li>
        ))}
      </ul>

      {tab === 'udhiya' && (
        <div className="vstack gap-3">
          {UDHIYA.map((s, i) => (
            <div className="card card-body shadow-sm" key={i}>
              <h3 className="h6 fw-bold text-success"><span className="step-num me-2">{num(i + 1)}</span>{pick(s.title)}</h3>
              <ul className="guide-list mb-0">{pick(s.points).map((p, k) => <li key={k}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      )}

      {tab === 'sadaqah' && (
        <>
          <h3 className="h6 fw-bold mb-2">{t('sadVirtues')}</h3>
          <div className="vstack gap-2 mb-4">
            {VIRTUES.map((v, i) => (
              <div className="card card-body shadow-sm" key={i}>
                <div className="dhikr-text" dir="rtl" style={{ fontSize: settings.fontSize * 0.7 }}>«{v.text}»</div>
                {lang !== 'ar' && <div className="translation-text">{v.en}</div>}
                <div className="small text-muted">📚 {pick(v.src)}</div>
              </div>
            ))}
          </div>
          <div className="card card-body shadow-sm">
            <h3 className="h6 fw-bold">{t('sadJariya')}</h3>
            <ul className="guide-list mb-0">{pick(JARIYA).map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        </>
      )}
    </>
  );
}
