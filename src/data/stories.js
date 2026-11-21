// قصص الأنبياء كما وردت في القرآن الكريم — فصول مرتبة زمنيًا قدر الإمكان
// كل فصل: عنوان + مقاطع قرآنية [سورة, من, إلى]. النص من المصحف، والرواية من التفسير الميسر (مجمع الملك فهد).
// الترتيب مطابق لـ PROPHETS في prophets.js

const c = (ar, en, ...p) => ({ title: { ar, en }, passages: p.map(([s, from, to]) => ({ s, from, to })) });

export const STORIES = [
  // آدم
  [
    c('خلق آدم واستخلافه في الأرض', 'The creation of Adam', [2, 30, 33]),
    c('سجود الملائكة وإباء إبليس', 'The angels prostrate; Iblis refuses', [2, 34, 34], [7, 11, 18]),
    c('في الجنة والأكل من الشجرة', 'In the Garden and the tree', [7, 19, 25]),
    c('التوبة والهبوط إلى الأرض', 'Repentance and descent to earth', [2, 35, 39], [20, 120, 123]),
  ],
  // إدريس
  [c('إدريس الصدّيق الصابر', 'Idris, the truthful and patient', [19, 56, 57], [21, 85, 86])],
  // نوح
  [
    c('دعوة نوح لقومه ليلًا ونهارًا', 'Nuh calls his people night and day', [71, 1, 20]),
    c('دعاء نوح على الظالمين', 'Nuh’s prayer against the wrongdoers', [71, 21, 28]),
    c('صناعة السفينة', 'Building the Ark', [11, 25, 39]),
    c('الطوفان والابن العاصي', 'The Flood and the disobedient son', [11, 40, 49]),
  ],
  // هود
  [
    c('هود يدعو قوم عاد', 'Hud calls the people of ‘Ad', [11, 50, 57]),
    c('هلاك عاد بالريح', '‘Ad destroyed by the wind', [11, 58, 60], [46, 21, 26]),
  ],
  // صالح
  [
    c('صالح يدعو ثمود', 'Salih calls Thamud', [11, 61, 63]),
    c('آية الناقة', 'The sign of the she-camel', [26, 141, 159]),
    c('عقر الناقة والصيحة', 'The camel killed; the Blast', [11, 64, 68], [91, 11, 15]),
  ],
  // إبراهيم
  [
    c('إبراهيم يتأمل الكواكب', 'Ibrahim reflects on the stars', [6, 74, 83]),
    c('تحطيم الأصنام والنار', 'Breaking the idols and the fire', [21, 51, 73]),
    c('المناظرة مع الملك', 'The debate with the king', [2, 258, 258]),
    c('ضيف إبراهيم والبشرى', 'The guests and the glad tidings', [11, 69, 76]),
    c('الذبيح والفداء', 'The sacrifice and the ransom', [37, 99, 113]),
    c('بناء الكعبة والدعاء', 'Building the Ka‘bah', [2, 124, 129]),
  ],
  // لوط
  [
    c('لوط ينهى قومه', 'Lut forbids his people', [26, 160, 175]),
    c('الملائكة وهلاك القرية', 'The angels and the destruction', [11, 77, 83]),
  ],
  // إسماعيل
  [
    c('إسماعيل الصابر صادق الوعد', 'Isma‘il, patient and true to his promise', [37, 100, 107], [19, 54, 55]),
    c('مع أبيه في بناء البيت', 'With his father building the House', [2, 127, 129]),
  ],
  // إسحاق
  [c('البشارة بإسحاق', 'The glad tidings of Ishaq', [11, 69, 73], [37, 112, 113])],
  // يعقوب
  [
    c('وصية يعقوب لبنيه', 'Ya‘qub’s counsel to his sons', [2, 132, 133]),
    c('حزن يعقوب وصبره', 'Ya‘qub’s grief and patience', [12, 83, 87]),
    c('اللقاء بعد الفراق', 'Reunion after separation', [12, 94, 100]),
  ],
  // يوسف
  [
    c('الرؤيا وكيد الإخوة', 'The dream and the brothers’ plot', [12, 3, 20]),
    c('في بيت العزيز', 'In the house of the ‘Aziz', [12, 21, 35]),
    c('في السجن وتعبير الرؤى', 'In prison: interpreting dreams', [12, 36, 57]),
    c('إخوة يوسف في مصر', 'The brothers come to Egypt', [12, 58, 82]),
    c('جمع الشمل وتأويل الرؤيا', 'Reunion and the dream fulfilled', [12, 83, 101]),
  ],
  // أيوب
  [c('بلاء أيوب وصبره وشفاؤه', 'Ayyub’s trial, patience and cure', [21, 83, 84], [38, 41, 44])],
  // شعيب
  [
    c('شعيب ينهى أهل مدين عن التطفيف', 'Shu‘ayb forbids cheating in Madyan', [11, 84, 90]),
    c('عناد القوم وهلاكهم', 'Their stubbornness and end', [11, 91, 95], [7, 88, 93]),
  ],
  // موسى
  [
    c('مولد موسى وإلقاؤه في اليم', 'Musa’s birth and the river', [28, 3, 13]),
    c('خروجه إلى مدين', 'Flight to Madyan', [28, 14, 28]),
    c('النار المقدسة والرسالة', 'The fire and the mission', [20, 9, 36]),
    c('أمام فرعون والسحرة', 'Before Pharaoh and the magicians', [26, 10, 51]),
    c('الخروج وانشقاق البحر', 'The exodus and the parting sea', [26, 52, 68]),
    c('فتنة العجل', 'The trial of the calf', [20, 83, 98]),
    c('قصة البقرة', 'The story of the cow', [2, 67, 73]),
    c('موسى والخضر', 'Musa and al-Khidr', [18, 60, 82]),
  ],
  // هارون
  [
    c('هارون وزير موسى', 'Harun, Musa’s helper', [20, 29, 36], [19, 53, 53]),
    c('هارون وبنو إسرائيل في غياب موسى', 'Harun while Musa was away', [20, 90, 94]),
  ],
  // ذو الكفل
  [c('ذو الكفل من الأخيار', 'Dhul-Kifl among the best', [21, 85, 86], [38, 48, 48])],
  // داود
  [
    c('داود وجالوت', 'Dawud and Goliath', [2, 249, 251]),
    c('ما آتاه الله من الفضل', 'Allah’s favours upon Dawud', [34, 10, 11], [38, 17, 20]),
    c('الخصمان والحكم بالعدل', 'The two litigants', [38, 21, 26]),
  ],
  // سليمان
  [
    c('سليمان والنملة', 'Sulayman and the ant', [27, 15, 19]),
    c('الهدهد وملكة سبأ', 'The hoopoe and the Queen of Sheba', [27, 20, 44]),
    c('الملك والريح والجن', 'Kingdom, wind and jinn', [38, 30, 40]),
    c('موت سليمان', 'The death of Sulayman', [34, 12, 14]),
  ],
  // إلياس
  [c('إلياس ينهى قومه عن عبادة بعل', 'Ilyas and the idol Ba‘l', [37, 123, 132])],
  // اليسع
  [c('اليسع من المفضّلين', 'Al-Yasa‘ among the favoured', [6, 84, 86], [38, 48, 48])],
  // يونس
  [
    c('يونس في بطن الحوت', 'Yunus in the whale', [37, 139, 148], [21, 87, 88]),
    c('إيمان قوم يونس', 'The people of Yunus believe', [10, 98, 98]),
  ],
  // زكريا
  [
    c('زكريا يكفل مريم', 'Zakariyya, guardian of Maryam', [3, 35, 37]),
    c('دعاء زكريا والبشرى بيحيى', 'His prayer and the glad tidings', [19, 2, 11], [3, 38, 41]),
  ],
  // يحيى
  [c('يحيى البار التقي', 'Yahya, the devout', [19, 12, 15])],
  // عيسى
  [
    c('مولد مريم ونشأتها', 'The birth of Maryam', [3, 33, 37]),
    c('البشارة بعيسى', 'The annunciation', [3, 42, 47]),
    c('ميلاد عيسى وكلامه في المهد', 'His birth; speaking in the cradle', [19, 16, 36]),
    c('معجزاته ورفعه', 'His miracles and ascension', [3, 48, 55]),
    c('المائدة', 'The table spread', [5, 112, 118]),
  ],
  // محمد ﷺ
  [
    c('بدء الوحي', 'The beginning of revelation', [96, 1, 5]),
    c('تثبيت الله لنبيه', 'Allah comforts His Prophet', [93, 1, 11], [94, 1, 8]),
    c('الإسراء', 'The Night Journey', [17, 1, 1]),
    c('الهجرة', 'The Hijrah', [8, 30, 30], [9, 40, 40]),
    c('الفتح ووصف الصحابة', 'The victory and the companions', [48, 27, 29]),
    c('خاتم النبيين ورحمة للعالمين', 'The Seal of the Prophets', [33, 40, 40], [21, 107, 107], [110, 1, 3]),
  ],
];
