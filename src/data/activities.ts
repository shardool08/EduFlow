import type { Activity } from '@/types';

export const activities: Activity[] = [
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
