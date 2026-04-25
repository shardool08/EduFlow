import type { Activity } from '@/types';

export const activities: Activity[] = [
  // ─── Lesson 1: Greetings ────────────────────────────────────────────────────
  {
    id: 'act-greet-001',
    title: { en: 'Hello Song with Actions', mr: 'अभिवादनाचे गाणे', hi: 'Hello गाना', ur: 'Hello گانا' },
    type: 'song',
    practiceMode: 'guided',
    applicableLessons: ['bb-g1-en-01'],
    minClassSize: 10,
    maxClassSize: 80,
    requiredResources: [],
    durationMinutes: 10,
    instructions: {
      en: "Teach the chant 'Good morning, good morning, how do you do? I am fine, thank you!' to a 4-beat clap. Children wave on 'good morning' and bow on 'thank you'. Repeat until confident, then practise in pairs.",
      mr: "'Good morning, good morning, how do you do? I am fine, thank you!' हे गाणे 4-beat टाळ्यांवर शिकवा. 'good morning' ला हात हलवा, 'thank you' ला झुका. आत्मविश्वास येईपर्यंत पुन्हा करा.",
      hi: "4-beat ताली पर गाना सिखाएं। 'good morning' पर हाथ हिलाएं, 'thank you' पर झुकें।",
      ur: "4-beat تالی پر گانا سکھائیں۔ 'good morning' پر ہاتھ ہلائیں، 'thank you' پر جھکیں۔",
    },
    classroomManagementTips: [
      'Tap desk rhythm before adding words so children internalise the beat',
      'Slow the tempo on "thank you" so the gesture is clear',
    ],
  },
  {
    id: 'act-greet-002',
    title: { en: 'Greeting Ball Pass', mr: 'अभिवादन बॉल पास', hi: 'Greeting Ball Pass', ur: 'Greeting Ball Pass' },
    type: 'game',
    practiceMode: 'group',
    applicableLessons: ['bb-g1-en-01'],
    minClassSize: 10,
    maxClassSize: 50,
    requiredResources: ['soft ball or crumpled paper ball'],
    durationMinutes: 15,
    instructions: {
      en: "Children sit in a circle. Teacher greets the child to the left — 'Good morning, ___!' — and rolls the ball. Child replies and passes it on. Alternate between 'Good morning', 'Good afternoon', and 'Goodbye' each round.",
      mr: "मुले वर्तुळात बसतात. शिक्षक डाव्या मुलाला 'Good morning, ___!' म्हणून बॉल पाठवतात. मूल उत्तर देऊन पुढे पाठवते. प्रत्येक फेरीत 'Good morning', 'Good afternoon', 'Goodbye' आळीपाळीने वापरा.",
      hi: "बच्चे वृत्त में बैठते हैं। शिक्षक बाईं ओर 'Good morning, ___!' कहकर ball लुढ़काते हैं। बच्चा जवाब देकर आगे देता है।",
      ur: "بچے دائرے میں بیٹھتے ہیں۔ استاد بائیں طرف 'Good morning, ___!' کہہ کر ball لڑھکاتا ہے۔",
    },
    classroomManagementTips: [
      'Use a sponge ball so no one gets hurt if a throw goes wide',
      'Allow 5 seconds thinking time so shy children are not rushed',
    ],
  },
  {
    id: 'act-greet-003',
    title: { en: 'Good Morning Shop', mr: 'गुड मॉर्निंग दुकान', hi: 'Good Morning दुकान', ur: 'Good Morning دکان' },
    type: 'roleplay',
    practiceMode: 'group',
    applicableLessons: ['bb-g1-en-01'],
    minClassSize: 10,
    maxClassSize: 40,
    requiredResources: [],
    durationMinutes: 15,
    instructions: {
      en: "Two chairs face-to-face at the front make a 'shop'. One child is the shopkeeper, one the customer. Customer says 'Good morning!' and shopkeeper replies in kind, then customer says 'Thank you, goodbye!' Rotate pairs every 2 minutes.",
      mr: "पुढे दोन खुर्च्या समोरासमोर ठेवून 'दुकान' बनवा. एक दुकानदार, एक ग्राहक. ग्राहक 'Good morning!' म्हणतो, दुकानदार उत्तर देतो, मग 'Thank you, goodbye!' दर 2 मिनिटांनी जोड्या बदला.",
      hi: "दो कुर्सियाँ आमने-सामने रखकर दुकान बनाएं। एक दुकानदार, एक ग्राहक। अभिवादन का आदान-प्रदान करें। हर 2 मिनट में जोड़े बदलें।",
      ur: "دو کرسیاں آمنے سامنے رکھ کر دکان بنائیں۔ ایک دکاندار، ایک گاہک۔ سلام کا تبادلہ کریں۔",
    },
    classroomManagementTips: [
      'Demonstrate the full exchange yourself before sending children up',
      'Whisper-prompt shy children just before their turn',
    ],
  },

  // ─── Lesson 5: My Body ──────────────────────────────────────────────────────
  {
    id: 'act-body-001',
    title: {
      en: 'Simon Says Body Parts',
      mr: 'Simon Says',
      hi: 'Simon Says',
      ur: 'Simon Says',
    },
    type: 'movement',
    practiceMode: 'guided',
    applicableLessons: ['bb-g1-en-05'],
    minClassSize: 10,
    maxClassSize: 80,
    requiredResources: [],
    durationMinutes: 10,
    instructions: {
      en: 'Teacher says "Simon says touch your head!" — children touch. Without "Simon says", they should NOT move.',
      mr: '"Simon says डोक्याला हात लावा!" — मुलं हात लावतात. Simon says शिवाय सांगितलं तर हात लावायचा नाही.',
      hi: '"Simon says सिर को छुओ!" — बच्चे छूते हैं। बिना Simon says के नहीं छूना।',
      ur: '"Simon says سر کو چھوؤ!" — بچے چھوتے ہیں۔ بغیر Simon says کے نہیں چھونا۔',
    },
    classroomManagementTips: [
      'Start slowly, increase speed as children get better',
      'Children who move at wrong time sit down — last standing wins',
      'Works for all class sizes, needs no materials',
    ],
  },
  {
    id: 'act-body-002',
    title: {
      en: 'Point and Say',
      mr: 'Point and Say',
      hi: 'Point and Say',
      ur: 'Point and Say',
    },
    type: 'game',
    practiceMode: 'individual',
    applicableLessons: ['bb-g1-en-05'],
    minClassSize: 10,
    maxClassSize: 40,
    requiredResources: ['blackboard'],
    durationMinutes: 12,
    instructions: {
      en: 'Draw a stick figure on the board. Teacher points to a body part, children call out the English word. Then children take turns pointing.',
      mr: 'Blackboard वर एक माणसाचं चित्र काढा. तुम्ही point करा, मुलं English word बोलतात. मग मुलं turn घेतात.',
      hi: 'बोर्ड पर एक figure बनाएं। शिक्षक point करें, बच्चे English word बोलें। फिर बच्चे turn लें।',
      ur: 'بورڈ پر ایک figure بنائیں۔ استاد point کریں، بچے English word بولیں۔',
    },
    classroomManagementTips: [
      'Call on quieter children when they seem to know the answer',
      'For 40+ students, ask the whole class together first, then individuals',
    ],
  },
  {
    id: 'act-body-003',
    title: {
      en: 'Head Shoulders Knees and Toes',
      mr: 'Action Song',
      hi: 'Action Song',
      ur: 'Action Song',
    },
    type: 'song',
    practiceMode: 'group',
    applicableLessons: ['bb-g1-en-05'],
    minClassSize: 10,
    maxClassSize: 80,
    requiredResources: [],
    durationMinutes: 8,
    instructions: {
      en: 'Teach "Head, Shoulders, Knees and Toes" with actions. Demonstrate, class repeats.',
      mr: '"Head, Shoulders, Knees and Toes" हे गाणं actions सहित शिकवा. तुम्ही दाखवता, मुलं follow करतात.',
      hi: '"Head, Shoulders, Knees and Toes" गाना actions के साथ सिखाएं। आप दिखाएं, बच्चे दोहराएं।',
      ur: '"Head, Shoulders, Knees and Toes" گانا actions کے ساتھ سکھائیں۔',
    },
    classroomManagementTips: [
      'Perfect for large classes — no materials, everyone participates',
      'Sing slowly first, then faster — children love the speed challenge',
      'Great as an energizer after sitting work',
    ],
  },

  // ─── Lesson 6: My Family ────────────────────────────────────────────────────
  {
    id: 'act-family-001',
    title: {
      en: 'Flashcard Game in Pairs',
      mr: 'Flashcard Game (Pairs)',
      hi: 'Flashcard Game',
      ur: 'Flashcard Game',
    },
    type: 'game',
    practiceMode: 'group',
    applicableLessons: ['bb-g1-en-06'],
    minClassSize: 20,
    maxClassSize: 80,
    requiredResources: ['flashcards'],
    durationMinutes: 12,
    instructions: {
      en: 'In pairs, one child holds up a flashcard, the other says the English word. Then switch. After 2 minutes, try sentences: "This is my mother."',
      mr: 'Pairs मध्ये, एक मूल flashcard दाखवतं, दुसरं English word बोलतं. मग बदलतात. 2 मिनिटांनंतर sentence बनवतात.',
      hi: 'जोड़ियों में, एक बच्चा flashcard दिखाता है, दूसरा English word बोलता है। फिर बदलें।',
      ur: 'جوڑیوں میں، ایک بچہ flashcard دکھاتا ہے، دوسرا English word بولتا ہے۔',
    },
    classroomManagementTips: [
      'Pair one confident speaker with a quieter child',
      'Walk around during pair work — stop off-task pairs',
      'For 40+ students: give flashcards to every other pair first, then swap',
    ],
  },
  {
    id: 'act-family-002',
    title: {
      en: 'Family Photo Introduction',
      mr: 'Family Photo',
      hi: 'Family Photo',
      ur: 'Family Photo',
    },
    type: 'roleplay',
    practiceMode: 'guided',
    applicableLessons: ['bb-g1-en-06'],
    minClassSize: 10,
    maxClassSize: 40,
    requiredResources: [],
    durationMinutes: 10,
    instructions: {
      en: "Teacher shows her own family photo (or draws on board). Says 'This is my mother. This is my father.' Then asks 5–6 children to share about their family.",
      mr: "तुम्ही तुमचा family चा photo दाखवा (किंवा board वर काढा). 'This is my mother. This is my father.' म्हणा. मग 5–6 मुलांना सांगायला सांगा.",
      hi: "शिक्षक अपना family photo दिखाएं। 'This is my mother' बोलें। फिर 5–6 बच्चों को बोलने को कहें।",
      ur: "استاد اپنا family photo دکھائیں۔ 'This is my mother' بولیں۔ پھر بچوں کو بولنے کو کہیں۔",
    },
    classroomManagementTips: [
      'Personal sharing creates strong engagement',
      'If a child is shy, let them point while teacher says the word',
      'Limit to 5–6 sharers to keep within time',
    ],
  },
  {
    id: 'act-family-003',
    title: {
      en: 'Family Clapping Song',
      mr: 'Family Action Song',
      hi: 'Family Song',
      ur: 'Family Song',
    },
    type: 'song',
    practiceMode: 'group',
    applicableLessons: ['bb-g1-en-06'],
    minClassSize: 10,
    maxClassSize: 80,
    requiredResources: [],
    durationMinutes: 8,
    instructions: {
      en: "Teach 'This is my mother, this is my father...' as a clapping song with a different clap pattern for each family member.",
      mr: "'This is my mother, this is my father...' हे clapping song म्हणून शिकवा. प्रत्येक member ला वेगळा clap pattern.",
      hi: "'This is my mother, this is my father...' को clapping song की तरह सिखाएं।",
      ur: "'This is my mother, this is my father...' کو clapping song کی طرح سکھائیں۔",
    },
    classroomManagementTips: [
      'Works for all class sizes with no materials',
      'Teach one family member at a time before combining',
      'Good as a warm-up to review previous learning',
    ],
  },

  // ─── Lesson 7: Colors ───────────────────────────────────────────────────────
  {
    id: 'act-colors-001',
    title: {
      en: 'Color Hunt',
      mr: 'Color Hunt',
      hi: 'Color Hunt',
      ur: 'Color Hunt',
    },
    type: 'movement',
    practiceMode: 'group',
    applicableLessons: ['bb-g1-en-07'],
    minClassSize: 10,
    maxClassSize: 80,
    requiredResources: [],
    durationMinutes: 10,
    instructions: {
      en: "Teacher calls a color. Children touch something of that color in the classroom. 'Red! Touch something red!'",
      mr: "तुम्ही रंग बोलता. मुलं वर्गात त्या रंगाची वस्तू touch करतात. 'Red! Red रंगाची वस्तू touch करा!'",
      hi: "शिक्षक रंग बोलते हैं। बच्चे उस रंग की चीज़ को class में touch करते हैं।",
      ur: "استاد رنگ بولتے ہیں۔ بچے اس رنگ کی چیز touch کرتے ہیں۔",
    },
    classroomManagementTips: [
      'Set a time limit — children move fast for 10 seconds then come back',
      'No materials needed — classroom is the resource',
      'Great for kinesthetic learners',
    ],
  },
];

export const getActivitiesForLesson = (lessonId: string): Activity[] =>
  activities.filter((a) => a.applicableLessons.includes(lessonId));

export function recommendActivity(
  lessonActivities: Activity[],
  studentCount: number,
  resources: string[]
): Activity | null {
  if (!lessonActivities.length) return null;

  // Filter to activities where the teacher has required resources (or activity needs none)
  const available = lessonActivities.filter(
    (a) =>
      a.requiredResources.length === 0 ||
      a.requiredResources.every((r) => resources.includes(r))
  );

  // Filter by class size
  const sized = available.filter(
    (a) => studentCount >= a.minClassSize && studentCount <= a.maxClassSize
  );

  const pool = sized.length ? sized : available.length ? available : lessonActivities;

  // For large classes prefer group/movement activities
  if (studentCount > 40) {
    const groupMatch = pool.find(
      (a) => a.practiceMode === 'group' || a.type === 'song' || a.type === 'movement'
    );
    if (groupMatch) return groupMatch;
  }

  return pool[0];
}
