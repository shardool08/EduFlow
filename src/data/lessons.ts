import type { BalbharatiLesson } from '@/types';

// Balbharati Grade 1 English — "My English Reader"
// Maharashtra State Bureau of Textbook Production & Curriculum Research
// 24 lessons, academic year June–January, pages 1–96 (4 pages per lesson)
export const lessons: BalbharatiLesson[] = [
  // ── June ──────────────────────────────────────────────────────────────────
  {
    id: 'bb-g1-en-01',
    lessonNumber: 1,
    title: { en: 'Greetings', mr: 'अभिवादन', hi: 'अभिवादन', ur: 'سلام' },
    vocabulary: ['hello', 'good morning', 'good afternoon', 'good evening', 'goodbye', 'thank you', 'please'],
    targetStructures: ['Good ___, ___!', 'Hello, I am ___'],
    learningObjectives: [
      { en: 'Children can greet in English at different times of day', mr: 'मुलं दिवसाच्या वेगवेगळ्या वेळी English मध्ये अभिवादन करू शकतात' },
      { en: "Children can introduce themselves: 'I am ___'", mr: "मुलं स्वतःची ओळख सांगू शकतात: 'I am ___'" },
    ],
    pageNumbers: [1, 2, 3, 4],
    thematicGroup: 'Social Skills',
    suggestedMonth: 6,
  },
  {
    id: 'bb-g1-en-02',
    lessonNumber: 2,
    title: { en: 'My School', mr: 'माझी शाळा', hi: 'मेरी स्कूल', ur: 'میری اسکول' },
    vocabulary: ['school', 'classroom', 'teacher', 'student', 'blackboard', 'book', 'bag', 'chalk'],
    targetStructures: ['This is my ___', 'I see a ___'],
    learningObjectives: [
      { en: 'Children can name 6 school objects in English', mr: 'मुलं 6 शाळेच्या वस्तू English मध्ये सांगू शकतात' },
      { en: "Children can say 'This is my ___' and 'I see a ___'", mr: "मुलं 'This is my ___' आणि 'I see a ___' हे वाक्य बोलू शकतात" },
    ],
    pageNumbers: [5, 6, 7, 8],
    thematicGroup: 'School',
    suggestedMonth: 6,
  },
  {
    id: 'bb-g1-en-03',
    lessonNumber: 3,
    title: { en: 'Numbers 1–5', mr: 'संख्या १–५', hi: 'संख्या 1–5', ur: 'نمبر 1–5' },
    vocabulary: ['one', 'two', 'three', 'four', 'five'],
    targetStructures: ['I have ___ ___s', 'Count: one, two, three, four, five'],
    learningObjectives: [
      { en: 'Children can count 1–5 in English', mr: 'मुलं English मध्ये 1–5 मोजू शकतात' },
      { en: "Children can say 'I have ___ ___s'", mr: "मुलं 'I have ___ ___s' हे वाक्य बोलू शकतात" },
    ],
    pageNumbers: [9, 10, 11, 12],
    thematicGroup: 'Numbers',
    suggestedMonth: 6,
  },
  {
    id: 'bb-g1-en-04',
    lessonNumber: 4,
    title: { en: 'My Classroom', mr: 'माझी वर्गखोली', hi: 'मेरी कक्षा', ur: 'میری کلاس' },
    vocabulary: ['chair', 'table', 'window', 'door', 'bench', 'wall', 'fan'],
    targetStructures: ['Where is the ___?', 'The ___ is here'],
    learningObjectives: [
      { en: 'Children can name 6 classroom objects in English', mr: 'मुलं 6 वर्गातील वस्तू English मध्ये सांगू शकतात' },
      { en: "Children respond to 'Where is the ___?' questions", mr: "मुलं 'Where is the ___?' प्रश्नांना उत्तर देऊ शकतात" },
    ],
    pageNumbers: [13, 14, 15, 16],
    thematicGroup: 'School',
    suggestedMonth: 6,
  },
  // ── July ──────────────────────────────────────────────────────────────────
  {
    id: 'bb-g1-en-05',
    lessonNumber: 5,
    title: { en: 'My Body', mr: 'माझे शरीर', hi: 'मेरा शरीर', ur: 'میرا جسم' },
    vocabulary: ['head', 'eyes', 'ears', 'nose', 'mouth', 'hands', 'feet', 'shoulders'],
    targetStructures: ['I have two ___s', 'Touch your ___'],
    learningObjectives: [
      { en: 'Children can name 7 body parts in English', mr: 'मुलं 7 शरीराचे अवयव English मध्ये सांगू शकतात' },
      { en: "Children respond to 'Touch your ___' commands", mr: "मुलं 'Touch your ___' commands ला respond करतात" },
    ],
    pageNumbers: [17, 18, 19, 20],
    thematicGroup: 'Body',
    suggestedMonth: 7,
  },
  {
    id: 'bb-g1-en-06',
    lessonNumber: 6,
    title: { en: 'My Family', mr: 'माझे कुटुंब', hi: 'मेरा परिवार', ur: 'میرا خاندان' },
    vocabulary: ['mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather'],
    targetStructures: ['This is my ___', 'Who is this?'],
    learningObjectives: [
      { en: 'Children can name 6 family members in English', mr: 'मुलं 6 family members ची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say 'This is my ___'", mr: "मुलं 'This is my ___' हे वाक्य बोलू शकतात" },
    ],
    pageNumbers: [21, 22, 23, 24],
    thematicGroup: 'Self and Family',
    suggestedMonth: 7,
  },
  {
    id: 'bb-g1-en-07',
    lessonNumber: 7,
    title: { en: 'Colors', mr: 'रंग', hi: 'रंग', ur: 'رنگ' },
    vocabulary: ['red', 'blue', 'yellow', 'green', 'black', 'white', 'orange', 'pink'],
    targetStructures: ['The ___ is ___', 'I like ___'],
    learningObjectives: [
      { en: 'Children can name 7 basic colors in English', mr: 'मुलं 7 मूळ रंग English मध्ये सांगू शकतात' },
      { en: "Children can say 'The ___ is ___' to describe colors", mr: "मुलं 'The ___ is ___' वापरून रंग वर्णन करू शकतात" },
    ],
    pageNumbers: [25, 26, 27, 28],
    thematicGroup: 'Colors',
    suggestedMonth: 7,
  },
  {
    id: 'bb-g1-en-08',
    lessonNumber: 8,
    title: { en: 'Animals', mr: 'प्राणी', hi: 'जानवर', ur: 'جانور' },
    vocabulary: ['cat', 'dog', 'cow', 'bird', 'fish', 'elephant', 'lion', 'horse'],
    targetStructures: ['I see a ___', 'The ___ says ___'],
    learningObjectives: [
      { en: 'Children can name 7 common animals in English', mr: 'मुलं 7 प्राण्यांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say 'The ___ says ___' for animal sounds", mr: "मुलं प्राण्यांचे आवाज सांगू शकतात: 'The ___ says ___'" },
    ],
    pageNumbers: [29, 30, 31, 32],
    thematicGroup: 'Animals',
    suggestedMonth: 7,
  },
  // ── August ────────────────────────────────────────────────────────────────
  {
    id: 'bb-g1-en-09',
    lessonNumber: 9,
    title: { en: 'Fruits', mr: 'फळे', hi: 'फल', ur: 'پھل' },
    vocabulary: ['mango', 'banana', 'apple', 'orange', 'grapes', 'coconut', 'guava'],
    targetStructures: ['I like ___', 'This is a ___'],
    learningObjectives: [
      { en: 'Children can name 6 fruits in English', mr: 'मुलं 6 फळांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can express preference: 'I like ___'", mr: "मुलं आवड सांगू शकतात: 'I like ___'" },
    ],
    pageNumbers: [33, 34, 35, 36],
    thematicGroup: 'Food',
    suggestedMonth: 8,
  },
  {
    id: 'bb-g1-en-10',
    lessonNumber: 10,
    title: { en: 'Vegetables', mr: 'भाज्या', hi: 'सब्ज़ियाँ', ur: 'سبزیاں' },
    vocabulary: ['tomato', 'potato', 'onion', 'carrot', 'spinach', 'pumpkin', 'brinjal'],
    targetStructures: ['We need ___', 'I eat ___ every day'],
    learningObjectives: [
      { en: 'Children can name 6 vegetables in English', mr: 'मुलं 6 भाज्यांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say 'I eat ___ every day'", mr: "मुलं 'I eat ___ every day' बोलू शकतात" },
    ],
    pageNumbers: [37, 38, 39, 40],
    thematicGroup: 'Food',
    suggestedMonth: 8,
  },
  {
    id: 'bb-g1-en-11',
    lessonNumber: 11,
    title: { en: 'Numbers 6–10', mr: 'संख्या ६–१०', hi: 'संख्या 6–10', ur: 'نمبر 6–10' },
    vocabulary: ['six', 'seven', 'eight', 'nine', 'ten'],
    targetStructures: ['How many ___s?', 'I have ___ ___s'],
    learningObjectives: [
      { en: 'Children can count 6–10 in English', mr: 'मुलं English मध्ये 6–10 मोजू शकतात' },
      { en: "Children can ask and answer 'How many ___s?'", mr: "मुलं 'How many ___s?' विचारू व उत्तर देऊ शकतात" },
    ],
    pageNumbers: [41, 42, 43, 44],
    thematicGroup: 'Numbers',
    suggestedMonth: 8,
  },
  {
    id: 'bb-g1-en-12',
    lessonNumber: 12,
    title: { en: 'My House', mr: 'माझे घर', hi: 'मेरा घर', ur: 'میرا گھر' },
    vocabulary: ['house', 'room', 'kitchen', 'bedroom', 'bathroom', 'garden', 'roof'],
    targetStructures: ['I live in a ___', 'This is my ___'],
    learningObjectives: [
      { en: 'Children can name parts of a house in English', mr: 'मुलं घराचे भाग English मध्ये सांगू शकतात' },
      { en: "Children can say 'I live in a ___'", mr: "मुलं 'I live in a ___' बोलू शकतात" },
    ],
    pageNumbers: [45, 46, 47, 48],
    thematicGroup: 'Home',
    suggestedMonth: 8,
  },
  // ── September ─────────────────────────────────────────────────────────────
  {
    id: 'bb-g1-en-13',
    lessonNumber: 13,
    title: { en: 'Clothing', mr: 'कपडे', hi: 'कपड़े', ur: 'کپڑے' },
    vocabulary: ['shirt', 'pants', 'dress', 'shoes', 'socks', 'hat', 'uniform'],
    targetStructures: ['I wear a ___', 'This is a ___'],
    learningObjectives: [
      { en: 'Children can name 6 clothing items in English', mr: 'मुलं 6 कपड्यांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say 'I wear a ___'", mr: "मुलं 'I wear a ___' बोलू शकतात" },
    ],
    pageNumbers: [49, 50, 51, 52],
    thematicGroup: 'Self',
    suggestedMonth: 9,
  },
  {
    id: 'bb-g1-en-14',
    lessonNumber: 14,
    title: { en: 'Weather', mr: 'हवामान', hi: 'मौसम', ur: 'موسم' },
    vocabulary: ['hot', 'cold', 'rainy', 'sunny', 'windy', 'cloudy'],
    targetStructures: ['Today it is ___', 'I feel ___'],
    learningObjectives: [
      { en: "Children can describe today's weather in English", mr: 'मुलं आजचं हवामान English मध्ये सांगू शकतात' },
      { en: "Children can say 'Today it is ___'", mr: "मुलं 'Today it is ___' बोलू शकतात" },
    ],
    pageNumbers: [53, 54, 55, 56],
    thematicGroup: 'Nature',
    suggestedMonth: 9,
  },
  {
    id: 'bb-g1-en-15',
    lessonNumber: 15,
    title: { en: 'Days of the Week', mr: 'आठवड्याचे दिवस', hi: 'हफ़्ते के दिन', ur: 'ہفتے کے دن' },
    vocabulary: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    targetStructures: ['Today is ___', 'Yesterday was ___', 'Tomorrow is ___'],
    learningObjectives: [
      { en: 'Children can name all 7 days of the week in English', mr: 'मुलं आठवड्याचे 7 दिवस English मध्ये सांगू शकतात' },
      { en: 'Children can say today, yesterday, tomorrow in English', mr: 'मुलं आज, काल, उद्या English मध्ये बोलू शकतात' },
    ],
    pageNumbers: [57, 58, 59, 60],
    thematicGroup: 'Time',
    suggestedMonth: 9,
  },
  {
    id: 'bb-g1-en-16',
    lessonNumber: 16,
    title: { en: 'Action Words', mr: 'क्रियापदे', hi: 'क्रिया शब्द', ur: 'فعلی الفاظ' },
    vocabulary: ['run', 'jump', 'eat', 'sleep', 'sing', 'dance', 'write', 'read'],
    targetStructures: ['I can ___', 'We ___ together'],
    learningObjectives: [
      { en: 'Children can act out and name 7 action words in English', mr: 'मुलं 7 क्रियापदे English मध्ये करून सांगू शकतात' },
      { en: "Children can say 'I can ___'", mr: "मुलं 'I can ___' बोलू शकतात" },
    ],
    pageNumbers: [61, 62, 63, 64],
    thematicGroup: 'Movement',
    suggestedMonth: 9,
  },
  // ── October ───────────────────────────────────────────────────────────────
  {
    id: 'bb-g1-en-17',
    lessonNumber: 17,
    title: { en: 'Birds', mr: 'पक्षी', hi: 'पक्षी', ur: 'پرندے' },
    vocabulary: ['parrot', 'crow', 'sparrow', 'peacock', 'pigeon', 'duck', 'hen'],
    targetStructures: ['I see a ___', 'The ___ can fly'],
    learningObjectives: [
      { en: 'Children can name 6 birds in English', mr: 'मुलं 6 पक्ष्यांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say 'The ___ can fly'", mr: "मुलं 'The ___ can fly' बोलू शकतात" },
    ],
    pageNumbers: [65, 66, 67, 68],
    thematicGroup: 'Animals',
    suggestedMonth: 10,
  },
  {
    id: 'bb-g1-en-18',
    lessonNumber: 18,
    title: { en: 'Shapes', mr: 'आकार', hi: 'आकार', ur: 'شکلیں' },
    vocabulary: ['circle', 'square', 'triangle', 'rectangle', 'star', 'oval'],
    targetStructures: ['This is a ___', 'I draw a ___'],
    learningObjectives: [
      { en: 'Children can name 5 basic shapes in English', mr: 'मुलं 5 मूळ आकार English मध्ये सांगू शकतात' },
      { en: 'Children can identify shapes in the classroom', mr: 'मुलं वर्गातील आकार ओळखू शकतात' },
    ],
    pageNumbers: [69, 70, 71, 72],
    thematicGroup: 'Math',
    suggestedMonth: 10,
  },
  // ── November ──────────────────────────────────────────────────────────────
  {
    id: 'bb-g1-en-19',
    lessonNumber: 19,
    title: { en: 'Transport', mr: 'वाहतूक', hi: 'वाहन', ur: 'گاڑیاں' },
    vocabulary: ['car', 'bus', 'train', 'bicycle', 'auto', 'boat', 'airplane'],
    targetStructures: ['I travel by ___', 'I see a ___'],
    learningObjectives: [
      { en: 'Children can name 6 modes of transport in English', mr: 'मुलं 6 वाहनांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say 'I travel by ___'", mr: "मुलं 'I travel by ___' बोलू शकतात" },
    ],
    pageNumbers: [73, 74, 75, 76],
    thematicGroup: 'Community',
    suggestedMonth: 11,
  },
  {
    id: 'bb-g1-en-20',
    lessonNumber: 20,
    title: { en: 'Community Helpers', mr: 'समाजसेवक', hi: 'समाज के सहायक', ur: 'معاشرے کے مددگار' },
    vocabulary: ['doctor', 'farmer', 'teacher', 'police', 'shopkeeper', 'postman', 'firefighter'],
    targetStructures: ['___ helps us', 'Thank you, ___!'],
    learningObjectives: [
      { en: 'Children can name 6 community helpers in English', mr: 'मुलं 6 समाजसेवकांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say '___ helps us'", mr: "मुलं '___ helps us' बोलू शकतात" },
    ],
    pageNumbers: [77, 78, 79, 80],
    thematicGroup: 'Community',
    suggestedMonth: 11,
  },
  // ── December ──────────────────────────────────────────────────────────────
  {
    id: 'bb-g1-en-21',
    lessonNumber: 21,
    title: { en: 'Food I Like', mr: 'मला आवडणारे खाद्यपदार्थ', hi: 'मुझे पसंद खाना', ur: 'مجھے پسند کھانا' },
    vocabulary: ['rice', 'bread', 'dal', 'milk', 'egg', 'chapati', 'sweet'],
    targetStructures: ['I like ___', 'I eat ___ every day'],
    learningObjectives: [
      { en: 'Children can name 6 food items in English', mr: 'मुलं 6 खाद्यपदार्थांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say 'I eat ___ every day'", mr: "मुलं 'I eat ___ every day' बोलू शकतात" },
    ],
    pageNumbers: [81, 82, 83, 84],
    thematicGroup: 'Food',
    suggestedMonth: 12,
  },
  {
    id: 'bb-g1-en-22',
    lessonNumber: 22,
    title: { en: 'My Neighbourhood', mr: 'माझा परिसर', hi: 'मेरा मोहल्ला', ur: 'میرا محلہ' },
    vocabulary: ['park', 'shop', 'hospital', 'temple', 'road', 'tree', 'well'],
    targetStructures: ['I go to the ___', 'I see ___ near my house'],
    learningObjectives: [
      { en: 'Children can name 5 neighbourhood places in English', mr: 'मुलं 5 परिसरातील जागा English मध्ये सांगू शकतात' },
      { en: "Children can say 'I go to the ___'", mr: "मुलं 'I go to the ___' बोलू शकतात" },
    ],
    pageNumbers: [85, 86, 87, 88],
    thematicGroup: 'Community',
    suggestedMonth: 12,
  },
  // ── January ───────────────────────────────────────────────────────────────
  {
    id: 'bb-g1-en-23',
    lessonNumber: 23,
    title: { en: 'Festivals', mr: 'सण', hi: 'त्योहार', ur: 'تہوار' },
    vocabulary: ['Diwali', 'Eid', 'Christmas', 'Holi', 'birthday', 'celebration', 'gift'],
    targetStructures: ['We celebrate ___', 'I like the ___ festival'],
    learningObjectives: [
      { en: 'Children can name 4 festivals in English', mr: 'मुलं 4 सणांची नावं English मध्ये सांगू शकतात' },
      { en: "Children can say 'We celebrate ___'", mr: "मुलं 'We celebrate ___' बोलू शकतात" },
    ],
    pageNumbers: [89, 90, 91, 92],
    thematicGroup: 'Culture',
    suggestedMonth: 1,
  },
  {
    id: 'bb-g1-en-24',
    lessonNumber: 24,
    title: { en: 'Good Habits', mr: 'चांगल्या सवयी', hi: 'अच्छी आदतें', ur: 'اچھی عادتیں' },
    vocabulary: ['wash', 'brush', 'sleep', 'exercise', 'help', 'clean', 'share'],
    targetStructures: ['I ___ every day', 'I always ___'],
    learningObjectives: [
      { en: 'Children can name 6 good habits in English', mr: 'मुलं 6 चांगल्या सवयी English मध्ये सांगू शकतात' },
      { en: "Children can say 'I ___ every day'", mr: "मुलं 'I ___ every day' बोलू शकतात" },
    ],
    pageNumbers: [93, 94, 95, 96],
    thematicGroup: 'Health',
    suggestedMonth: 1,
  },
];

export const getLessonById = (id: string): BalbharatiLesson | undefined =>
  lessons.find((l) => l.id === id);

export const getLessonByNumber = (n: number): BalbharatiLesson | undefined =>
  lessons.find((l) => l.lessonNumber === n);

export const getLessonByPage = (page: number): BalbharatiLesson | undefined =>
  lessons.find((l) => l.pageNumbers.includes(page));

export const getNextLesson = (currentId: string): BalbharatiLesson | undefined => {
  const cur = lessons.find((l) => l.id === currentId);
  if (!cur) return undefined;
  return lessons.find((l) => l.lessonNumber === cur.lessonNumber + 1);
};
