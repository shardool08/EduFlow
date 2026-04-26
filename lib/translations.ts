export type Language = "mr" | "hi" | "ur" | "en";

export interface Translations {
  greeting: string;
  phoneLabel: string;
  phonePlaceholder: string;
  sendOtp: string;
  homeGreeting: string;
  cameraButton: string;
  lessonPickerButton: string;
  lessonsHeader: string;
  lesson1Title: string;
  lesson6Title: string;
  navHome: string;
  navRoadmap: string;
  navProfile: string;
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
    homeGreeting: "नमस्कार! आज काय शिकवायचं आहे?",
    cameraButton: "📷 पाठ्यपुस्तक स्कॅन करा",
    lessonPickerButton: "📚 पाठ निवडा",
    lessonsHeader: "माझे पाठ",
    lesson1Title: "पाठ १: नमस्कार!",
    lesson6Title: "पाठ ६: माझे कुटुंब",
    navHome: "मुख्यपृष्ठ",
    navRoadmap: "रोडमॅप",
    navProfile: "प्रोफाइल",
    aiGreeting:
      "नमस्कार! आज आपण {lessonTitle} शिकवायचं आहे. सुरुवात करूया का?",
    micButton: "🎤 बोला",
    back: "← मागे",
  },
  hi: {
    greeting: "नमस्ते!",
    phoneLabel: "मोबाइल नंबर",
    phonePlaceholder: "10 अंक का नंबर दर्ज करें",
    sendOtp: "OTP भेजें",
    homeGreeting: "नमस्ते! आज क्या पढ़ाना है?",
    cameraButton: "📷 पाठ्यपुस्तक स्कैन करें",
    lessonPickerButton: "📚 पाठ चुनें",
    lessonsHeader: "मेरे पाठ",
    lesson1Title: "पाठ १: नमस्कार!",
    lesson6Title: "पाठ ६: मेरा परिवार",
    navHome: "होम",
    navRoadmap: "रोडमैप",
    navProfile: "प्रोफाइल",
    aiGreeting: "नमस्ते! आज हम {lessonTitle} पढ़ाएंगे। शुरू करें?",
    micButton: "🎤 बोलें",
    back: "← वापस",
  },
  ur: {
    greeting: "آداب!",
    phoneLabel: "موبائل نمبر",
    phonePlaceholder: "10 ہندسے کا نمبر درج کریں",
    sendOtp: "OTP بھیجیں",
    homeGreeting: "آداب! آج کیا پڑھانا ہے؟",
    cameraButton: "📷 درسی کتاب اسکین کریں",
    lessonPickerButton: "📚 سبق منتخب کریں",
    lessonsHeader: "میرے سبق",
    lesson1Title: "سبق ١: آداب!",
    lesson6Title: "سبق ٦: میرا خاندان",
    navHome: "ہوم",
    navRoadmap: "روڈ میپ",
    navProfile: "پروفائل",
    aiGreeting: "آداب! آج ہم {lessonTitle} پڑھائیں گے۔ شروع کریں؟",
    micButton: "🎤 بولیں",
    back: "← واپس",
  },
  en: {
    greeting: "Hello!",
    phoneLabel: "Mobile Number",
    phonePlaceholder: "Enter 10-digit number",
    sendOtp: "Send OTP",
    homeGreeting: "Hello! What will you teach today?",
    cameraButton: "📷 Scan Textbook",
    lessonPickerButton: "📚 Choose Lesson",
    lessonsHeader: "My Lessons",
    lesson1Title: "Lesson 1: Greetings!",
    lesson6Title: "Lesson 6: My Family",
    navHome: "Home",
    navRoadmap: "Roadmap",
    navProfile: "Profile",
    aiGreeting: "Hello! Today we will teach {lessonTitle}. Shall we begin?",
    micButton: "🎤 Speak",
    back: "← Back",
  },
};
