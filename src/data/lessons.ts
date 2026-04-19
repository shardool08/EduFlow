import type { BalbharatiLesson } from '@/types';

export const lessons: BalbharatiLesson[] = [
  {
    id: 'bb-g1-en-01',
    lessonNumber: 1,
    title: { en: 'Greetings', mr: 'अभिवादन', hi: 'अभिवादन', ur: 'سلام' },
    vocabulary: ['hello', 'good morning', 'good afternoon', 'goodbye', 'thank you'],
    targetStructures: ['Good morning, ___!', 'Hello, I am ___'],
    learningObjectives: [
      { en: 'Children can greet in English', mr: 'मुलं English मध्ये अभिवादन करू शकतात' },
      { en: 'Children can say their name', mr: 'मुलं त्यांचं नाव सांगू शकतात' },
    ],
    pageNumbers: [1, 2],
    thematicGroup: 'Social Skills',
    suggestedMonth: 6,
  },
  {
    id: 'bb-g1-en-02',
    lessonNumber: 2,
    title: { en: 'My School', mr: 'माझी शाळा', hi: 'मेरी स्कूल', ur: 'میری اسکول' },
    vocabulary: ['school', 'classroom', 'teacher', 'student', 'blackboard', 'book', 'bag'],
    targetStructures: ['This is my ___', 'I see a ___'],
    learningObjectives: [
      {
        en: 'Children can name 5 school objects in English',
        mr: 'मुलं 5 शाळेच्या वस्तू English मध्ये सांगू शकतात',
      },
    ],
    pageNumbers: [3, 4, 5],
    thematicGroup: 'School',
    suggestedMonth: 6,
  },
  {
    id: 'bb-g1-en-03',
    lessonNumber: 3,
    title: { en: 'Numbers 1–5', mr: 'संख्या १–५', hi: 'संख्या 1–5', ur: 'نمبر 1–5' },
    vocabulary: ['one', 'two', 'three', 'four', 'five'],
    targetStructures: ['I have ___ ___s', 'Count: one, two, three...'],
    learningObjectives: [
      { en: 'Children can count 1–5 in English', mr: 'मुलं English मध्ये 1–5 मोजू शकतात' },
      {
        en: "Children can say 'I have ___ ___s'",
        mr: "मुलं 'I have ___ ___s' हे वाक्य बोलू शकतात",
      },
    ],
    pageNumbers: [6, 7],
    thematicGroup: 'Numbers',
    suggestedMonth: 6,
  },
  {
    id: 'bb-g1-en-04',
    lessonNumber: 4,
    title: { en: 'My Classroom', mr: 'माझी वर्गखोली', hi: 'मेरी कक्षा', ur: 'میری کلاس' },
    vocabulary: ['chair', 'table', 'window', 'door', 'bench', 'wall'],
    targetStructures: ['Where is the ___?', 'The ___ is here'],
    learningObjectives: [
      {
        en: 'Children can name classroom objects in English',
        mr: 'मुलं वर्गातील वस्तू English मध्ये सांगू शकतात',
      },
    ],
    pageNumbers: [8, 9, 10],
    thematicGroup: 'School',
    suggestedMonth: 7,
  },
  {
    id: 'bb-g1-en-05',
    lessonNumber: 5,
    title: { en: 'My Body', mr: 'माझे शरीर', hi: 'मेरा शरीर', ur: 'میرا جسم' },
    vocabulary: ['head', 'eyes', 'ears', 'nose', 'mouth', 'hands', 'feet'],
    targetStructures: ['I have two ___s', 'Touch your ___'],
    learningObjectives: [
      {
        en: 'Children can name 7 body parts in English',
        mr: 'मुलं 7 शरीराचे अवयव English मध्ये सांगू शकतात',
      },
      {
        en: "Children respond to 'Touch your ___' commands",
        mr: "मुलं 'Touch your ___' commands ला respond करतात",
      },
    ],
    pageNumbers: [11, 12, 13],
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
      {
        en: 'Children can name 6 family members in English',
        mr: 'मुलं 6 family members ची नावं English मध्ये सांगू शकतात',
      },
      {
        en: "Children can say 'This is my ___'",
        mr: "मुलं 'This is my ___' हे वाक्य बोलू शकतात",
      },
    ],
    pageNumbers: [14, 15, 16],
    thematicGroup: 'Self and Family',
    suggestedMonth: 7,
  },
  {
    id: 'bb-g1-en-07',
    lessonNumber: 7,
    title: { en: 'Colors', mr: 'रंग', hi: 'रंग', ur: 'رنگ' },
    vocabulary: ['red', 'blue', 'yellow', 'green', 'black', 'white', 'orange'],
    targetStructures: ['The ___ is ___', 'I like ___'],
    learningObjectives: [
      {
        en: 'Children can name 7 basic colors in English',
        mr: 'मुलं 7 मूळ रंग English मध्ये सांगू शकतात',
      },
    ],
    pageNumbers: [17, 18, 19],
    thematicGroup: 'Colors',
    suggestedMonth: 7,
  },
  {
    id: 'bb-g1-en-08',
    lessonNumber: 8,
    title: { en: 'Animals', mr: 'प्राणी', hi: 'जानवर', ur: 'جانور' },
    vocabulary: ['cat', 'dog', 'cow', 'bird', 'fish', 'elephant', 'lion'],
    targetStructures: ['I see a ___', 'The ___ says ___'],
    learningObjectives: [
      {
        en: 'Children can name 7 animals in English',
        mr: 'मुलं 7 प्राण्यांची नावं English मध्ये सांगू शकतात',
      },
    ],
    pageNumbers: [20, 21, 22],
    thematicGroup: 'Animals',
    suggestedMonth: 8,
  },
];

export const getLessonById = (id: string): BalbharatiLesson | undefined =>
  lessons.find((l) => l.id === id);
