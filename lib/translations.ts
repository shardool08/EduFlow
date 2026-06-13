export type Language = "mr" | "hi" | "ur" | "en";

export interface Translations {
  // Registration step 1
  greeting: string;
  phoneLabel: string;
  phonePlaceholder: string;
  sendOtp: string;
  // Step 2 — About You
  aboutYouTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  districtLabel: string;
  districtPlaceholder: string;
  adminTypeLabel: string;
  zpLabel: string;
  corpNameLabel: string;
  mediumLabel: string;
  comfortLabel: string;
  comfortLow: string;
  comfortMed: string;
  comfortHigh: string;
  continueButton: string;
  // Step 3 — About Your Class
  aboutClassTitle: string;
  schoolTypeLabel: string;
  schoolNameLabel: string;
  schoolNamePlaceholder: string;
  locationLabel: string;
  locationUrban: string;
  locationSemiUrban: string;
  locationRural: string;
  pinCodeLabel: string;
  pinCodePlaceholder: string;
  studentCountLabel: string;
  resourcesLabel: string;
  chartsLabel: string;
  storyBooksLabel: string;
  speakerLabel: string;
  smartBoardLabel: string;
  projectorLabel: string;
  // Home
  homeGreeting: string;
  cameraButton: string;
  lessonPickerButton: string;
  lessonsHeader: string;
  lesson1Title: string;
  lesson6Title: string;
  navHome: string;
  navRoadmap: string;
  navProfile: string;
  // Profile popup
  completeProfileMsg: string;
  goToProfileBtn: string;
  // Profile summary
  profileSummaryTitle: string;
  editProfileButton: string;
  notSetLabel: string;
  // Profile edit
  profileEditTitle: string;
  saveButton: string;
  schoolDetailsSec: string;
  classroomDetailsSec: string;
  resourcesSec: string;
  studentContextSec: string;
  teacherSec: string;
  stateLabel: string;
  classroomSizeLabel: string;
  seatingLabel: string;
  canRearrangeLabel: string;
  yesLabel: string;
  noLabel: string;
  socioEconLabel: string;
  homeLanguageLabel: string;
  homeLanguagePlaceholder: string;
  firstGenLabel: string;
  parentalLabel: string;
  teacherSectionLabel: string;
  currentLessonLabel: string;
  currentLessonPlaceholder: string;
  // Plan
  aiGreeting: string;
  micButton: string;
  back: string;
}

export const translations: Record<Language, Translations> = {
  mr: {
    greeting: "नमस्कार!",
    phoneLabel: "मोबाइल नंबर",
    phonePlaceholder: "१०-अंकी नंबर टाका",
    sendOtp: "OTP पाठवा",
    aboutYouTitle: "तुमच्याबद्दल",
    nameLabel: "नाव",
    namePlaceholder: "तुमचं पूर्ण नाव",
    districtLabel: "जिल्हा",
    districtPlaceholder: "जिल्हा शोधा",
    adminTypeLabel: "प्रशासन प्रकार",
    zpLabel: "जिल्हा परिषद",
    corpNameLabel: "महानगरपालिका",
    mediumLabel: "शिक्षणाचे माध्यम",
    comfortLabel: "इंग्रजीशी किती ओळख?",
    comfortLow: "नाही / थोडी",
    comfortMed: "ठीक आहे",
    comfortHigh: "चांगली",
    continueButton: "पुढे जा",
    aboutClassTitle: "तुमच्या वर्गाबद्दल",
    schoolTypeLabel: "शाळेचा प्रकार",
    schoolNameLabel: "शाळेचं नाव",
    schoolNamePlaceholder: "शाळेचं पूर्ण नाव",
    locationLabel: "स्थान",
    locationUrban: "शहरी",
    locationSemiUrban: "अर्ध-शहरी",
    locationRural: "ग्रामीण",
    pinCodeLabel: "पिन कोड",
    pinCodePlaceholder: "६-अंकी पिन",
    studentCountLabel: "विद्यार्थ्यांची संख्या",
    resourcesLabel: "उपलब्ध साधने",
    chartsLabel: "तक्ते / फ्लॅशकार्ड",
    storyBooksLabel: "गोष्टींची पुस्तके",
    speakerLabel: "स्पीकर",
    smartBoardLabel: "स्मार्ट बोर्ड / टीव्ही",
    projectorLabel: "प्रोजेक्टर",
    homeGreeting: "नमस्कार! आज काय शिकवायचं आहे?",
    cameraButton: "📷 पाठ्यपुस्तक स्कॅन करा",
    lessonPickerButton: "📚 पाठ निवडा",
    lessonsHeader: "माझे पाठ",
    lesson1Title: "पाठ १: नमस्कार!",
    lesson6Title: "पाठ ६: माझे कुटुंब",
    navHome: "मुख्यपृष्ठ",
    navRoadmap: "रोडमॅप",
    navProfile: "प्रोफाइल",
    completeProfileMsg: "चांगल्या पाठ योजनांसाठी तुमची माहिती पूर्ण करा!",
    goToProfileBtn: "माहिती भरा",
    profileSummaryTitle: "माझी माहिती",
    editProfileButton: "संपादित करा",
    notSetLabel: "नाही भरले",
    profileEditTitle: "प्रोफाइल संपादन",
    saveButton: "जतन करा",
    schoolDetailsSec: "शाळेची माहिती",
    classroomDetailsSec: "वर्गाची माहिती",
    resourcesSec: "साधने",
    studentContextSec: "विद्यार्थ्यांची माहिती",
    teacherSec: "शिक्षक माहिती",
    stateLabel: "राज्य",
    classroomSizeLabel: "वर्गाचा आकार",
    seatingLabel: "बैठक व्यवस्था",
    canRearrangeLabel: "बैठक बदलता येते का?",
    yesLabel: "होय",
    noLabel: "नाही",
    socioEconLabel: "आर्थिक-सामाजिक पार्श्वभूमी",
    homeLanguageLabel: "विद्यार्थ्यांची घरची भाषा",
    homeLanguagePlaceholder: "उदा. मराठी, हिंदी",
    firstGenLabel: "प्रथम पिढी शिकणारे",
    parentalLabel: "पालकांचा सहभाग",
    teacherSectionLabel: "वर्ग / तुकडी",
    currentLessonLabel: "सध्याचा पाठ",
    currentLessonPlaceholder: "उदा. पाठ १",
    aiGreeting: "नमस्कार! आज आपण {lessonTitle} शिकवायचं आहे. सुरुवात करूया का?",
    micButton: "🎤 बोला",
    back: "← मागे",
  },
  hi: {
    greeting: "नमस्ते!",
    phoneLabel: "मोबाइल नंबर",
    phonePlaceholder: "10 अंक का नंबर दर्ज करें",
    sendOtp: "OTP भेजें",
    aboutYouTitle: "आपके बारे में",
    nameLabel: "नाम",
    namePlaceholder: "पूरा नाम",
    districtLabel: "जिला",
    districtPlaceholder: "जिला खोजें",
    adminTypeLabel: "प्रशासन प्रकार",
    zpLabel: "जिला परिषद",
    corpNameLabel: "नगर निगम",
    mediumLabel: "शिक्षा का माध्यम",
    comfortLabel: "अंग्रेज़ी से कितना परिचय?",
    comfortLow: "नहीं / थोड़ा",
    comfortMed: "ठीक है",
    comfortHigh: "अच्छा",
    continueButton: "आगे बढ़ें",
    aboutClassTitle: "आपकी कक्षा के बारे में",
    schoolTypeLabel: "विद्यालय का प्रकार",
    schoolNameLabel: "विद्यालय का नाम",
    schoolNamePlaceholder: "पूरा विद्यालय नाम",
    locationLabel: "स्थान",
    locationUrban: "शहरी",
    locationSemiUrban: "अर्ध-शहरी",
    locationRural: "ग्रामीण",
    pinCodeLabel: "पिन कोड",
    pinCodePlaceholder: "6 अंकों का पिन",
    studentCountLabel: "विद्यार्थियों की संख्या",
    resourcesLabel: "उपलब्ध संसाधन",
    chartsLabel: "चार्ट / फ्लैशकार्ड",
    storyBooksLabel: "कहानी की किताबें",
    speakerLabel: "स्पीकर",
    smartBoardLabel: "स्मार्ट बोर्ड / टीवी",
    projectorLabel: "प्रोजेक्टर",
    homeGreeting: "नमस्ते! आज क्या पढ़ाना है?",
    cameraButton: "📷 पाठ्यपुस्तक स्कैन करें",
    lessonPickerButton: "📚 पाठ चुनें",
    lessonsHeader: "मेरे पाठ",
    lesson1Title: "पाठ १: नमस्कार!",
    lesson6Title: "पाठ ६: मेरा परिवार",
    navHome: "होम",
    navRoadmap: "रोडमैप",
    navProfile: "प्रोफाइल",
    completeProfileMsg: "बेहतर पाठ योजनाओं के लिए अपनी जानकारी पूरी करें!",
    goToProfileBtn: "जानकारी भरें",
    profileSummaryTitle: "मेरी जानकारी",
    editProfileButton: "संपादित करें",
    notSetLabel: "नहीं भरा",
    profileEditTitle: "प्रोफाइल संपादन",
    saveButton: "सहेजें",
    schoolDetailsSec: "विद्यालय विवरण",
    classroomDetailsSec: "कक्षा विवरण",
    resourcesSec: "संसाधन",
    studentContextSec: "विद्यार्थी जानकारी",
    teacherSec: "शिक्षक जानकारी",
    stateLabel: "राज्य",
    classroomSizeLabel: "कक्षा का आकार",
    seatingLabel: "बैठक व्यवस्था",
    canRearrangeLabel: "क्या बैठक बदली जा सकती है?",
    yesLabel: "हाँ",
    noLabel: "नहीं",
    socioEconLabel: "सामाजिक-आर्थिक पृष्ठभूमि",
    homeLanguageLabel: "विद्यार्थियों की घर की भाषा",
    homeLanguagePlaceholder: "जैसे मराठी, हिंदी",
    firstGenLabel: "प्रथम पीढ़ी शिक्षार्थी",
    parentalLabel: "अभिभावक सहभाग",
    teacherSectionLabel: "कक्षा / वर्ग",
    currentLessonLabel: "वर्तमान पाठ",
    currentLessonPlaceholder: "जैसे पाठ 1",
    aiGreeting: "नमस्ते! आज हम {lessonTitle} पढ़ाएंगे। शुरू करें?",
    micButton: "🎤 बोलें",
    back: "← वापस",
  },
  ur: {
    greeting: "آداب!",
    phoneLabel: "موبائل نمبر",
    phonePlaceholder: "10 ہندسے کا نمبر درج کریں",
    sendOtp: "OTP بھیجیں",
    aboutYouTitle: "آپ کے بارے میں",
    nameLabel: "نام",
    namePlaceholder: "پورا نام",
    districtLabel: "ضلع",
    districtPlaceholder: "ضلع تلاش کریں",
    adminTypeLabel: "انتظامی قسم",
    zpLabel: "ضلع پریشد",
    corpNameLabel: "میونسپل کارپوریشن",
    mediumLabel: "تعلیم کا ذریعہ",
    comfortLabel: "انگریزی سے کتنی واقفیت؟",
    comfortLow: "نہیں / تھوڑی",
    comfortMed: "ٹھیک ہے",
    comfortHigh: "اچھی",
    continueButton: "آگے بڑھیں",
    aboutClassTitle: "آپ کے درجہ کے بارے میں",
    schoolTypeLabel: "اسکول کی قسم",
    schoolNameLabel: "اسکول کا نام",
    schoolNamePlaceholder: "اسکول کا پورا نام",
    locationLabel: "مقام",
    locationUrban: "شہری",
    locationSemiUrban: "نیم شہری",
    locationRural: "دیہاتی",
    pinCodeLabel: "پن کوڈ",
    pinCodePlaceholder: "6 ہندسے کا پن",
    studentCountLabel: "طلباء کی تعداد",
    resourcesLabel: "دستیاب وسائل",
    chartsLabel: "چارٹ / فلیش کارڈ",
    storyBooksLabel: "کہانی کی کتابیں",
    speakerLabel: "اسپیکر",
    smartBoardLabel: "سمارٹ بورڈ / ٹی وی",
    projectorLabel: "پروجیکٹر",
    homeGreeting: "آداب! آج کیا پڑھانا ہے؟",
    cameraButton: "📷 درسی کتاب اسکین کریں",
    lessonPickerButton: "📚 سبق منتخب کریں",
    lessonsHeader: "میرے سبق",
    lesson1Title: "سبق ١: آداب!",
    lesson6Title: "سبق ٦: میرا خاندان",
    navHome: "ہوم",
    navRoadmap: "روڈ میپ",
    navProfile: "پروفائل",
    completeProfileMsg: "بہتر سبق کے منصوبوں کے لیے اپنی معلومات مکمل کریں!",
    goToProfileBtn: "معلومات بھریں",
    profileSummaryTitle: "میری معلومات",
    editProfileButton: "ترمیم کریں",
    notSetLabel: "نہیں بھرا",
    profileEditTitle: "پروفائل ترمیم",
    saveButton: "محفوظ کریں",
    schoolDetailsSec: "اسکول کی تفصیلات",
    classroomDetailsSec: "درجہ کی تفصیلات",
    resourcesSec: "وسائل",
    studentContextSec: "طلباء کی معلومات",
    teacherSec: "استاد کی معلومات",
    stateLabel: "ریاست",
    classroomSizeLabel: "درجہ کا حجم",
    seatingLabel: "بیٹھنے کا انتظام",
    canRearrangeLabel: "کیا بیٹھنے کا انتظام بدلا جا سکتا ہے؟",
    yesLabel: "ہاں",
    noLabel: "نہیں",
    socioEconLabel: "سماجی-اقتصادی پس منظر",
    homeLanguageLabel: "طلباء کی گھریلو زبان",
    homeLanguagePlaceholder: "مثلاً مراٹھی، ہندی",
    firstGenLabel: "پہلی نسل کے طالب علم",
    parentalLabel: "والدین کی شرکت",
    teacherSectionLabel: "درجہ / سیکشن",
    currentLessonLabel: "موجودہ سبق",
    currentLessonPlaceholder: "مثلاً سبق 1",
    aiGreeting: "آداب! آج ہم {lessonTitle} پڑھائیں گے۔ شروع کریں؟",
    micButton: "🎤 بولیں",
    back: "← واپس",
  },
  en: {
    greeting: "Hello!",
    phoneLabel: "Mobile Number",
    phonePlaceholder: "Enter 10-digit number",
    sendOtp: "Send OTP",
    aboutYouTitle: "About You",
    nameLabel: "Your Name",
    namePlaceholder: "Full name",
    districtLabel: "District",
    districtPlaceholder: "Search district",
    adminTypeLabel: "Administration Type",
    zpLabel: "Zilla Parishad",
    corpNameLabel: "Corporation",
    mediumLabel: "Medium of Instruction",
    comfortLabel: "English comfort level?",
    comfortLow: "Little / None",
    comfortMed: "Some",
    comfortHigh: "Comfortable",
    continueButton: "Continue",
    aboutClassTitle: "About Your Class",
    schoolTypeLabel: "School Type",
    schoolNameLabel: "School Name",
    schoolNamePlaceholder: "Full school name",
    locationLabel: "Location",
    locationUrban: "Urban",
    locationSemiUrban: "Semi-urban",
    locationRural: "Rural",
    pinCodeLabel: "PIN Code",
    pinCodePlaceholder: "6-digit PIN",
    studentCountLabel: "Number of Students",
    resourcesLabel: "Resources Available",
    chartsLabel: "Charts / Flashcards",
    storyBooksLabel: "Story Books",
    speakerLabel: "Speaker",
    smartBoardLabel: "Smart Board / TV",
    projectorLabel: "Projector",
    homeGreeting: "Hello! What will you teach today?",
    cameraButton: "📷 Scan Textbook",
    lessonPickerButton: "📚 Choose Lesson",
    lessonsHeader: "My Lessons",
    lesson1Title: "Lesson 1: Greetings!",
    lesson6Title: "Lesson 6: My Family",
    navHome: "Home",
    navRoadmap: "Roadmap",
    navProfile: "Profile",
    completeProfileMsg: "Complete your profile for better lesson plans!",
    goToProfileBtn: "Complete Profile",
    profileSummaryTitle: "My Profile",
    editProfileButton: "Edit Profile",
    notSetLabel: "Not set",
    profileEditTitle: "Edit Profile",
    saveButton: "Save",
    schoolDetailsSec: "School Details",
    classroomDetailsSec: "Classroom Details",
    resourcesSec: "Resources",
    studentContextSec: "Student Context",
    teacherSec: "Teacher",
    stateLabel: "State",
    classroomSizeLabel: "Classroom Size",
    seatingLabel: "Seating Arrangement",
    canRearrangeLabel: "Can seating be rearranged?",
    yesLabel: "Yes",
    noLabel: "No",
    socioEconLabel: "Socio-economic Background",
    homeLanguageLabel: "Home Language of Students",
    homeLanguagePlaceholder: "e.g. Marathi, Hindi",
    firstGenLabel: "First-generation Learners",
    parentalLabel: "Parental Involvement",
    teacherSectionLabel: "Section / Class",
    currentLessonLabel: "Current Lesson",
    currentLessonPlaceholder: "e.g. Lesson 1",
    aiGreeting: "Hello! Today we will teach {lessonTitle}. Shall we begin?",
    micButton: "🎤 Speak",
    back: "← Back",
  },
};
