// الأذكار — من حصن المسلم وكتب السنة، مع العزو للمصدر
// q: مقطع قرآني يُجلب نصه من المصحف مباشرة لضمان الدقة { s: سورة, from, to }
// only: 'morning' | 'evening' — إن لم يُحدد فهو للصباح والمساء
// textE: صيغة المساء إن اختلفت

const SRC = {
  muslim: { ar: 'رواه مسلم', en: 'Muslim' },
  bukhari: { ar: 'رواه البخاري', en: 'Al-Bukhari' },
  agreed: { ar: 'متفق عليه (البخاري ومسلم)', en: 'Al-Bukhari & Muslim' },
  abuTirmidhi: { ar: 'رواه أبو داود والترمذي', en: 'Abu Dawud & At-Tirmidhi' },
  abuDawud: { ar: 'رواه أبو داود', en: 'Abu Dawud' },
  abuIbnMajah: { ar: 'رواه أبو داود وابن ماجه', en: 'Abu Dawud & Ibn Majah' },
  ahmad: { ar: 'رواه أحمد', en: 'Ahmad' },
};

const MUAWWIDHAT = [
  { s: 112, from: 1, to: 4 },
  { s: 113, from: 1, to: 5 },
  { s: 114, from: 1, to: 6 },
];

export const DAILY = [
  {
    id: 'kursi',
    q: [{ s: 2, from: 255, to: 255 }],
    count: 1,
    src: { ar: 'رواه النسائي في الكبرى والحاكم، وصححه الألباني', en: "An-Nasa'i, Al-Hakim (sahih — Al-Albani)" },
    fadl: {
      ar: 'من قالها حين يصبح أُجير من الجن حتى يمسي، ومن قالها حين يمسي أُجير منهم حتى يصبح',
      en: 'Whoever recites it in the morning is protected from the jinn until evening, and whoever recites it in the evening is protected until morning.',
    },
  },
  {
    id: 'muawwidhat',
    q: MUAWWIDHAT,
    basmala: true,
    count: 3,
    src: SRC.abuTirmidhi,
    fadl: { ar: 'تكفيك من كل شيء', en: 'They will suffice you against everything.' },
  },
  {
    id: 'baqarahEnd',
    only: 'evening',
    q: [{ s: 2, from: 285, to: 286 }],
    count: 1,
    src: SRC.agreed,
    fadl: { ar: 'من قرأ بالآيتين من آخر سورة البقرة في ليلة كفتاه', en: 'Whoever recites the last two verses of Al-Baqarah at night, they will suffice him.' },
  },
  {
    id: 'mulk',
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    textE: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    en: 'We have entered the morning (evening) and all dominion belongs to Allah; praise be to Allah. None has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things. My Lord, I ask You for the good of this day (night) and of what follows it, and I seek refuge in You from its evil and the evil of what follows it. My Lord, I seek refuge in You from laziness and the misery of old age; my Lord, I seek refuge in You from punishment in the Fire and in the grave.',
    count: 1,
    src: SRC.muslim,
  },
  {
    id: 'bika',
    text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    textE: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    en: 'O Allah, by You we enter the morning and by You we enter the evening; by You we live and by You we die, and to You is the resurrection (in the evening: the final return).',
    count: 1,
    src: SRC.abuTirmidhi,
  },
  {
    id: 'sayyid',
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    en: 'O Allah, You are my Lord; none has the right to be worshipped but You. You created me and I am Your servant, and I keep Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.',
    count: 1,
    src: SRC.bukhari,
    fadl: {
      ar: 'سيد الاستغفار: من قالها موقنًا بها فمات من يومه أو ليلته دخل الجنة',
      en: 'The master of seeking forgiveness: whoever says it with certainty and dies that day or night enters Paradise.',
    },
  },
  {
    id: 'afini',
    text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
    en: 'O Allah, grant me well-being in my body, in my hearing and in my sight; none has the right to be worshipped but You. O Allah, I seek refuge in You from disbelief and poverty, and from the punishment of the grave; none has the right to be worshipped but You.',
    count: 3,
    src: SRC.abuDawud,
  },
  {
    id: 'afw',
    text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    en: 'O Allah, I ask You for pardon and well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly life, my family and my wealth. O Allah, conceal my faults and calm my fears. O Allah, guard me from in front of me and behind me, from my right and my left, and from above me, and I seek refuge in Your greatness from being taken unawares from beneath me.',
    count: 1,
    src: SRC.abuIbnMajah,
  },
  {
    id: 'alimAlghayb',
    text: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
    en: 'O Allah, Knower of the unseen and the seen, Originator of the heavens and the earth, Lord and Sovereign of all things, I bear witness that none has the right to be worshipped but You. I seek refuge in You from the evil of my own self, from the evil of Satan and his call to associate partners, and from bringing evil upon myself or upon a Muslim.',
    count: 1,
    src: SRC.abuTirmidhi,
  },
  {
    id: 'bismillah',
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    en: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    count: 3,
    src: SRC.abuTirmidhi,
    fadl: { ar: 'من قالها ثلاثًا لم يضره شيء', en: 'Whoever says it three times, nothing will harm him.' },
  },
  {
    id: 'radeetu',
    text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
    en: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
    count: 3,
    src: SRC.abuTirmidhi,
  },
  {
    id: 'hayyQayyum',
    text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    en: 'O Ever-Living, O Sustainer of all, by Your mercy I seek help: set right all my affairs and do not leave me to myself even for the blink of an eye.',
    count: 1,
    src: { ar: 'رواه الحاكم، وحسنه الألباني', en: 'Al-Hakim (hasan — Al-Albani)' },
  },
  {
    id: 'fitrah',
    text: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
    textE: 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
    en: 'We have entered the morning (evening) upon the natural way of Islam, the word of sincerity, the religion of our Prophet Muhammad ﷺ, and the way of our father Ibrahim, upright and submitting to Allah, and he was not of the polytheists.',
    count: 1,
    src: SRC.ahmad,
  },
  {
    id: 'adadaKhalqihi',
    only: 'morning',
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    en: 'Glory be to Allah and praise be to Him, as many times as the number of His creation, as much as pleases Him, as much as the weight of His Throne, and as much as the ink of His words.',
    count: 3,
    src: SRC.muslim,
  },
  {
    id: 'kalimat',
    only: 'evening',
    text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    count: 3,
    src: SRC.muslim,
  },
  {
    id: 'tahleel100',
    only: 'morning',
    text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    en: 'None has the right to be worshipped but Allah alone, without partner; His is the dominion and His is the praise, and He is able to do all things.',
    count: 100,
    src: SRC.agreed,
    fadl: {
      ar: 'من قالها في يوم مائة مرة كانت له عدل عشر رقاب، وكُتبت له مائة حسنة، ومُحيت عنه مائة سيئة، وكانت له حرزًا من الشيطان يومه ذلك حتى يمسي',
      en: 'Whoever says it a hundred times in a day: it equals freeing ten slaves, a hundred good deeds are recorded and a hundred sins erased, and it is a protection from Satan that day until evening.',
    },
  },
  {
    id: 'subhan100',
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    en: 'Glory be to Allah and praise be to Him.',
    count: 100,
    src: SRC.muslim,
    fadl: {
      ar: 'لم يأتِ أحد يوم القيامة بأفضل مما جاء به إلا أحد قال مثل ما قال أو زاد عليه',
      en: 'No one will bring anything better on the Day of Resurrection except one who said the same or more.',
    },
  },
  {
    id: 'istighfar',
    text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    en: 'I seek the forgiveness of Allah and repent to Him.',
    count: 100,
    src: SRC.muslim,
  },
  {
    id: 'salawat',
    text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    en: 'O Allah, send blessings and peace upon our Prophet Muhammad.',
    count: 10,
    src: { ar: 'رواه الطبراني، وحسنه الألباني', en: "At-Tabarani (hasan — Al-Albani)" },
    fadl: {
      ar: 'من صلى عليّ حين يصبح عشرًا وحين يمسي عشرًا أدركته شفاعتي يوم القيامة',
      en: 'Whoever sends blessings on me ten times in the morning and ten in the evening will attain my intercession on the Day of Resurrection.',
    },
  },
];

export const AFTER_PRAYER = [
  {
    id: 'p-istighfar',
    text: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    en: 'I seek the forgiveness of Allah (three times). O Allah, You are Peace and from You is peace; blessed are You, O Possessor of majesty and honour.',
    count: 1,
    src: SRC.muslim,
  },
  {
    id: 'p-tahleel',
    text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    en: 'None has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things. O Allah, none can withhold what You give, none can give what You withhold, and the wealth of the wealthy cannot avail him against You.',
    count: 1,
    src: SRC.agreed,
  },
  { id: 'p-subhan', text: 'سُبْحَانَ اللَّهِ', en: 'Glory be to Allah.', count: 33, src: SRC.muslim },
  { id: 'p-hamd', text: 'الْحَمْدُ لِلَّهِ', en: 'Praise be to Allah.', count: 33, src: SRC.muslim },
  { id: 'p-takbir', text: 'اللَّهُ أَكْبَرُ', en: 'Allah is the Greatest.', count: 33, src: SRC.muslim },
  {
    id: 'p-tamam',
    text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    en: 'None has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things.',
    count: 1,
    src: SRC.muslim,
    fadl: {
      ar: 'تمام المائة: غُفرت خطاياه وإن كانت مثل زبد البحر',
      en: 'Completing the hundred: his sins are forgiven even if they are like the foam of the sea.',
    },
  },
  {
    id: 'p-kursi',
    q: [{ s: 2, from: 255, to: 255 }],
    count: 1,
    src: { ar: 'رواه النسائي في الكبرى، وصححه الألباني', en: "An-Nasa'i (sahih — Al-Albani)" },
    fadl: { ar: 'من قرأها دبر كل صلاة لم يمنعه من دخول الجنة إلا أن يموت', en: 'Whoever recites it after every prayer, nothing prevents him from entering Paradise except death.' },
  },
  {
    id: 'p-muawwidhat',
    q: MUAWWIDHAT,
    basmala: true,
    count: 1,
    src: SRC.abuTirmidhi,
    fadl: { ar: 'مرة بعد كل صلاة، وثلاثًا بعد الفجر والمغرب', en: 'Once after each prayer, and three times after Fajr and Maghrib.' },
  },
];

export const SLEEP = [
  {
    id: 's-muawwidhat',
    q: MUAWWIDHAT,
    basmala: true,
    count: 3,
    src: SRC.bukhari,
    fadl: {
      ar: 'يجمع كفيه وينفث فيهما ويقرأ، ثم يمسح بهما ما استطاع من جسده، يبدأ برأسه ووجهه',
      en: 'Cup the hands, blow lightly into them, recite, then wipe over as much of the body as possible, starting with the head and face.',
    },
  },
  {
    id: 's-kursi',
    q: [{ s: 2, from: 255, to: 255 }],
    count: 1,
    src: SRC.bukhari,
    fadl: { ar: 'لا يزال عليك من الله حافظ، ولا يقربك شيطان حتى تصبح', en: 'A guardian from Allah stays with you and no devil comes near you until morning.' },
  },
  { id: 's-baqarah', q: [{ s: 2, from: 285, to: 286 }], count: 1, src: SRC.agreed },
  {
    id: 's-bismika',
    text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    en: 'In Your name, O Allah, I die and I live.',
    count: 1,
    src: SRC.bukhari,
  },
  {
    id: 's-qini',
    text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    en: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
    count: 3,
    src: SRC.abuTirmidhi,
  },
  { id: 's-subhan', text: 'سُبْحَانَ اللَّهِ', en: 'Glory be to Allah.', count: 33, src: SRC.agreed },
  { id: 's-hamd', text: 'الْحَمْدُ لِلَّهِ', en: 'Praise be to Allah.', count: 33, src: SRC.agreed },
  { id: 's-takbir', text: 'اللَّهُ أَكْبَرُ', en: 'Allah is the Greatest.', count: 34, src: SRC.agreed },
];

export const ADHKAR_CATS = ['morning', 'evening', 'prayer', 'sleep'];

export function getAdhkar(cat) {
  if (cat === 'prayer') return AFTER_PRAYER;
  if (cat === 'sleep') return SLEEP;
  return DAILY.filter((i) => !i.only || i.only === cat);
}
