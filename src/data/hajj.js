// دليل العمرة والحج — مختصر على ما عليه عامة أهل العلم، مع الإشارة لمواضع الخلاف المشهورة

export const TALBIYA = 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ';
export const TALBIYA_EN = 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Surely all praise, blessings and dominion belong to You; You have no partner.';

export const BETWEEN_CORNERS = 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ';
export const SAFA_DHIKR = 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ';
export const ARAFAH_DHIKR = 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ';

export const UMRAH_STEPS = [
  {
    title: { ar: 'الإحرام من الميقات', en: 'Ihram at the Miqat' },
    points: {
      ar: [
        'يُستحب قبل الإحرام: الاغتسال، والتنظف، وتطييب البدن (لا ثياب الإحرام) للرجل.',
        'يلبس الرجل إزارًا ورداءً أبيضين ونعلين، وتلبس المرأة ثيابها العادية الساترة غير المتزينة، ولا تلبس النقاب ولا القفازين.',
        'ينوي الدخول في النسك عند الميقات ويقول: «لبيك عمرة».',
        'إن كان مسافرًا بالطائرة أحرم عند محاذاة الميقات، والأحوط أن يلبس ملابس الإحرام قبل الإقلاع.',
        'يبدأ التلبية ويُكثر منها، ويرفع بها الرجل صوته، وتُسرّ بها المرأة.',
      ],
      en: [
        'Recommended before ihram: bathing, cleanliness, and (for men) applying perfume to the body, not the ihram garments.',
        'Men wear two white unstitched sheets (izar and rida’) and sandals; women wear their normal modest clothing without adornment, and no niqab or gloves.',
        'At the miqat, make the intention to enter the rites and say: “Labbayka ‘Umrah”.',
        'When flying, enter ihram when the plane is level with the miqat; it is safer to change into ihram clothes before take-off.',
        'Begin the Talbiyah and recite it often — men aloud, women quietly.',
      ],
    },
    dhikr: 'talbiya',
  },
  {
    title: { ar: 'دخول المسجد الحرام', en: 'Entering Al-Masjid Al-Haram' },
    points: {
      ar: [
        'يقدّم رجله اليمنى ويقول دعاء دخول المسجد: «اللهم افتح لي أبواب رحمتك».',
        'يقطع التلبية عند بدء الطواف.',
      ],
      en: ['Enter with the right foot and say: “O Allah, open for me the gates of Your mercy.”', 'Stop the Talbiyah when you begin Tawaf.'],
    },
  },
  {
    title: { ar: 'الطواف (٧ أشواط)', en: 'Tawaf (7 circuits)' },
    points: {
      ar: [
        'يبدأ من الحجر الأسود وينتهي عنده، والكعبة عن يساره.',
        'يشترط جمهور العلماء الطهارة للطواف.',
        'يُسن للرجل الاضطباع (كشف الكتف الأيمن) في هذا الطواف، والرَّمَل (الإسراع مع تقارب الخطى) في الأشواط الثلاثة الأولى.',
        'يستلم الحجر الأسود ويقبّله إن تيسر، وإلا أشار إليه بيده وقال: «الله أكبر» دون مزاحمة.',
        'يقول بين الركن اليماني والحجر الأسود: ﴿رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...﴾.',
        'ليس لكل شوط دعاء مخصوص، بل يدعو ويذكر الله ويقرأ القرآن بما شاء.',
      ],
      en: [
        'Start and end each circuit at the Black Stone, keeping the Ka‘bah on your left.',
        'Most scholars require ritual purity (wudu’) for Tawaf.',
        'For men: uncover the right shoulder (idtiba‘) during this Tawaf and walk briskly (raml) in the first three circuits.',
        'Touch and kiss the Black Stone if easy; otherwise point to it saying “Allahu Akbar” — do not push others.',
        'Between the Yemeni Corner and the Black Stone say: “Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.”',
        'There is no specific supplication for each circuit; make any dhikr, du‘a’ or Quran recitation.',
      ],
    },
    dhikr: 'corners',
  },
  {
    title: { ar: 'ركعتا الطواف وزمزم', en: 'Two rak‘ahs and Zamzam' },
    points: {
      ar: [
        'يصلي ركعتين خلف مقام إبراهيم إن تيسر وإلا في أي مكان من المسجد، لقوله تعالى: ﴿وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى﴾.',
        'يُسن أن يقرأ فيهما بعد الفاتحة: سورة الكافرون ثم الإخلاص.',
        'يشرب من ماء زمزم ويدعو بما شاء.',
      ],
      en: [
        'Pray two rak‘ahs behind Maqam Ibrahim if possible, otherwise anywhere in the mosque.',
        'It is Sunnah to recite Al-Kafirun and Al-Ikhlas after Al-Fatihah.',
        'Drink Zamzam water and supplicate.',
      ],
    },
  },
  {
    title: { ar: 'السعي بين الصفا والمروة (٧ أشواط)', en: "Sa'i between Safa and Marwah (7 laps)" },
    points: {
      ar: [
        'يبدأ بالصفا ويقرأ عند أول صعوده: ﴿إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ﴾ ويقول: «أبدأ بما بدأ الله به».',
        'يستقبل القبلة على الصفا ويرفع يديه ويكبّر ويوحّد الله ثلاثًا ويدعو بينها، ويفعل مثل ذلك على المروة.',
        'الذهاب من الصفا إلى المروة شوط، والعودة شوط آخر، فينتهي السعي عند المروة.',
        'يُسن للرجل الإسراع بين العلمين الأخضرين.',
        'لا تشترط الطهارة للسعي على الصحيح، لكنها أفضل.',
      ],
      en: [
        'Start at Safa, reciting “Indeed, Safa and Marwah are among the symbols of Allah” and saying “I begin with what Allah began with.”',
        'On Safa face the Qiblah, raise your hands, say the takbir and tahlil three times with supplication in between; do the same on Marwah.',
        'Safa → Marwah is one lap and Marwah → Safa is another, so Sa‘i ends at Marwah.',
        'Men walk briskly between the two green markers.',
        'Purity is not a condition for Sa‘i according to the stronger view, but it is better.',
      ],
    },
    dhikr: 'safa',
  },
  {
    title: { ar: 'الحلق أو التقصير', en: 'Shaving or shortening the hair' },
    points: {
      ar: [
        'يحلق الرجل رأسه أو يقصّر من جميعه، والحلق أفضل (إلا إن كان الحج قريبًا فالتقصير للمتمتع أولى ليحلق في الحج).',
        'تقصّر المرأة من أطراف شعرها قدر أنملة.',
        'بذلك تمت العمرة ويحلّ له كل ما حُرّم عليه بالإحرام. تقبّل الله منك.',
      ],
      en: [
        'Men shave the head or shorten hair from all of it; shaving is better (unless Hajj is near, in which case shortening is preferable so one can shave in Hajj).',
        'Women cut a fingertip’s length from the ends of their hair.',
        'The Umrah is complete and all ihram restrictions are lifted. May Allah accept it from you.',
      ],
    },
  },
];

export const HAJJ_TYPES = {
  ar: [
    'التمتع: عمرة في أشهر الحج ثم التحلل، ثم الإحرام بالحج يوم التروية — وعليه الهدي. (الأيسر والأكثر شيوعًا)',
    'القِران: الإحرام بالعمرة والحج معًا والبقاء محرمًا إلى يوم النحر — وعليه الهدي.',
    'الإفراد: الإحرام بالحج وحده — ولا هدي عليه.',
  ],
  en: [
    'Tamattu‘: Umrah during the Hajj months, exit ihram, then enter ihram for Hajj on the 8th — a sacrificial animal is required. (Easiest and most common)',
    'Qiran: ihram for Umrah and Hajj together, remaining in ihram until the 10th — a sacrificial animal is required.',
    'Ifrad: ihram for Hajj only — no sacrifice required.',
  ],
};

export const HAJJ_DAYS = [
  {
    day: { ar: '٨ ذو الحجة — يوم التروية', en: '8 Dhul-Hijjah — Day of Tarwiyah' },
    points: {
      ar: [
        'يُحرم المتمتع بالحج من مكانه في مكة ضحى ويقول: «لبيك حجًا».',
        'يتوجه إلى منى ويصلي بها الظهر والعصر والمغرب والعشاء والفجر، يقصر الرباعية دون جمع.',
      ],
      en: [
        'The mutamatti‘ enters ihram for Hajj from where he is in Makkah in the forenoon, saying “Labbayka Hajjan”.',
        'Go to Mina and pray Dhuhr, Asr, Maghrib, Isha and Fajr there, shortening four-rak‘ah prayers without combining.',
      ],
    },
  },
  {
    day: { ar: '٩ ذو الحجة — يوم عرفة (الركن الأعظم)', en: '9 Dhul-Hijjah — Day of Arafah (the greatest pillar)' },
    points: {
      ar: [
        'بعد طلوع الشمس يسير إلى عرفة، ويصلي الظهر والعصر جمع تقديم وقصرًا.',
        'يتأكد أنه داخل حدود عرفة، ويتفرغ للذكر والدعاء مستقبلًا القبلة حتى غروب الشمس. «الحج عرفة».',
        'خير الدعاء دعاء يوم عرفة، وخير ما قاله النبي ﷺ والنبيون من قبله: «لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير».',
        'بعد الغروب ينصرف إلى مزدلفة بسكينة، فيصلي بها المغرب والعشاء جمعًا وقصرًا للعشاء، ويبيت بها.',
        'يجوز للضعفاء والنساء ومن معهم الانصراف من مزدلفة بعد منتصف الليل.',
      ],
      en: [
        'After sunrise go to Arafah; pray Dhuhr and Asr combined and shortened at the time of Dhuhr.',
        'Make sure you are within the boundaries of Arafah, and devote yourself to dhikr and du‘a’ facing the Qiblah until sunset. “Hajj is Arafah.”',
        'The best supplication is that of the Day of Arafah, and the best thing said by the Prophet ﷺ and the prophets before him is: “None has the right to be worshipped but Allah alone…”.',
        'After sunset proceed calmly to Muzdalifah; pray Maghrib and Isha combined (Isha shortened) and spend the night there.',
        'The weak, women and those accompanying them may leave Muzdalifah after midnight.',
      ],
    },
    dhikr: 'arafah',
  },
  {
    day: { ar: '١٠ ذو الحجة — يوم النحر (العيد)', en: '10 Dhul-Hijjah — Day of Sacrifice (Eid)' },
    points: {
      ar: [
        'يصلي الفجر بمزدلفة ويذكر الله ويدعو حتى يُسفر جدًا، ثم يدفع إلى منى قبل طلوع الشمس.',
        'يرمي جمرة العقبة بسبع حصيات متعاقبات، يكبّر مع كل حصاة، ويقطع التلبية.',
        'يذبح الهدي إن كان متمتعًا أو قارنًا.',
        'يحلق أو يقصّر — وبالرمي والحلق يتحلل التحلل الأول فيحل له كل شيء إلا النساء.',
        'يطوف طواف الإفاضة (ركن) ويسعى إن كان متمتعًا، وبه يتحلل التحلل الثاني.',
        'الترتيب بين هذه الأعمال سنة، ومن قدّم أو أخّر فلا حرج.',
      ],
      en: [
        'Pray Fajr at Muzdalifah, remain in dhikr and du‘a’ until it is very bright, then leave for Mina before sunrise.',
        'Stone Jamrat al-‘Aqabah with seven pebbles one after another, saying “Allahu Akbar” with each; stop the Talbiyah.',
        'Offer the sacrifice if performing Tamattu‘ or Qiran.',
        'Shave or shorten the hair — after stoning and shaving you are partially released (everything lawful except marital relations).',
        'Perform Tawaf al-Ifadah (a pillar) and Sa‘i if performing Tamattu‘; you are then fully released from ihram.',
        'The order of these acts is Sunnah; there is no harm in changing it.',
      ],
    },
  },
  {
    day: { ar: '١١ و١٢ (و١٣) ذو الحجة — أيام التشريق', en: '11, 12 (and 13) Dhul-Hijjah — Days of Tashreeq' },
    points: {
      ar: [
        'يبيت ليالي التشريق بمنى.',
        'يرمي كل يوم بعد الزوال الجمرات الثلاث: الصغرى ثم الوسطى ثم العقبة، بسبع حصيات لكل منها مع التكبير.',
        'يقف بعد الصغرى والوسطى مستقبل القبلة يدعو طويلًا، ولا يقف بعد العقبة.',
        'من أراد التعجل خرج من منى يوم ١٢ قبل غروب الشمس، ومن تأخر رمى يوم ١٣.',
      ],
      en: [
        'Spend the nights of Tashreeq in Mina.',
        'Each day after midday stone all three Jamarat — small, middle, then ‘Aqabah — seven pebbles each with takbir.',
        'After the small and middle Jamarat, stand facing the Qiblah and supplicate at length; do not stop after ‘Aqabah.',
        'Whoever hastens leaves Mina on the 12th before sunset; whoever stays stones again on the 13th.',
      ],
    },
  },
  {
    day: { ar: 'طواف الوداع', en: 'Farewell Tawaf' },
    points: {
      ar: [
        'آخر عمل قبل مغادرة مكة: طواف سبعة أشواط بلا سعي.',
        'يسقط عن الحائض والنفساء.',
      ],
      en: ['The last act before leaving Makkah: seven circuits of Tawaf, with no Sa‘i.', 'Waived for women in menses or post-natal bleeding.'],
    },
  },
];

export const PILLARS = {
  arkan: {
    ar: ['الإحرام (نية الدخول في النسك)', 'الوقوف بعرفة', 'طواف الإفاضة', 'السعي بين الصفا والمروة'],
    en: ['Ihram (intention to enter the rites)', 'Standing at Arafah', 'Tawaf al-Ifadah', "Sa'i between Safa and Marwah"],
  },
  wajibat: {
    ar: [
      'الإحرام من الميقات',
      'البقاء بعرفة حتى الغروب لمن وقف نهارًا',
      'المبيت بمزدلفة',
      'المبيت بمنى ليالي التشريق',
      'رمي الجمار',
      'الحلق أو التقصير',
      'طواف الوداع',
    ],
    en: [
      'Entering ihram from the miqat',
      'Remaining at Arafah until sunset if standing by day',
      'Spending the night at Muzdalifah',
      'Spending the nights of Tashreeq in Mina',
      'Stoning the Jamarat',
      'Shaving or shortening the hair',
      'Farewell Tawaf',
    ],
  },
  note: {
    ar: 'من ترك ركنًا لم يصح حجه حتى يأتي به، ومن ترك واجبًا فعليه دم (فدية) وحجه صحيح.',
    en: 'Leaving out a pillar invalidates Hajj until it is performed; leaving out an obligation requires an expiation (sacrifice) but the Hajj remains valid.',
  },
};

export const MAWAQIT = [
  { name: { ar: 'ذو الحليفة (أبيار علي)', en: "Dhul-Hulayfah (Abyar 'Ali)" }, for: { ar: 'أهل المدينة ومن مرّ بها', en: 'People of Madinah and those passing by it' } },
  { name: { ar: 'الجُحفة (رابغ)', en: 'Al-Juhfah (Rabigh)' }, for: { ar: 'أهل مصر والشام والمغرب', en: 'Egypt, the Levant and North Africa' } },
  { name: { ar: 'قرن المنازل (السيل الكبير)', en: 'Qarn al-Manazil (As-Sayl al-Kabir)' }, for: { ar: 'أهل نجد والطائف', en: "Najd and Ta'if" } },
  { name: { ar: 'يلملم (السعدية)', en: "Yalamlam (As-Sa'diyyah)" }, for: { ar: 'أهل اليمن', en: 'Yemen' } },
  { name: { ar: 'ذات عرق', en: "Dhat 'Irq" }, for: { ar: 'أهل العراق', en: 'Iraq' } },
];

export const MAHZURAT = {
  ar: [
    'إزالة الشعر من أي موضع من البدن',
    'تقليم الأظافر',
    'استعمال الطيب في البدن أو الثوب',
    'تغطية الرأس بملاصق للرجل',
    'لبس المخيط (المفصّل على البدن) للرجل',
    'لبس النقاب والقفازين للمرأة',
    'عقد النكاح',
    'الجماع ومقدماته',
    'قتل الصيد البري أو التعرض له',
  ],
  en: [
    'Removing hair from any part of the body',
    'Clipping nails',
    'Using perfume on the body or clothes',
    'Covering the head with something touching it (men)',
    'Wearing tailored/fitted garments (men)',
    'Wearing niqab or gloves (women)',
    'Contracting marriage',
    'Marital relations and foreplay',
    'Hunting land game',
  ],
};

export const CHECKLIST = [
  { id: 'passport', ar: 'جواز السفر والتأشيرة وصور منها', en: 'Passport, visa and copies' },
  { id: 'ihram', ar: 'ملابس الإحرام (قطعتان على الأقل) وحزام', en: 'Ihram garments (at least two sets) and belt' },
  { id: 'sandals', ar: 'نعل مريح مفتوح', en: 'Comfortable open sandals' },
  { id: 'meds', ar: 'الأدوية الشخصية وروشتة الطبيب', en: 'Personal medicines and prescriptions' },
  { id: 'unscented', ar: 'صابون وشامبو بدون رائحة', en: 'Unscented soap and shampoo' },
  { id: 'umbrella', ar: 'شمسية وزجاجة ماء', en: 'Umbrella and water bottle' },
  { id: 'bag', ar: 'حقيبة صغيرة للحصى والأغراض', en: 'Small bag for pebbles and essentials' },
  { id: 'charger', ar: 'شاحن متنقل للموبايل', en: 'Power bank' },
  { id: 'money', ar: 'نقود بالريال السعودي', en: 'Saudi riyals in cash' },
  { id: 'nails', ar: 'قص الأظافر والشعر قبل الإحرام', en: 'Trim nails and hair before ihram' },
  { id: 'debts', ar: 'رد المظالم وكتابة الوصية وقضاء الديون', en: 'Settle debts, return rights and write a will' },
];
