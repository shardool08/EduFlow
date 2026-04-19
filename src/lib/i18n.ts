import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, hi, mr, ur } from '@/locales';

// Marathi is the primary language for this app (per spec)
const resources = {
  mr: { translation: mr },
  hi: { translation: hi },
  ur: { translation: ur },
  en: { translation: en },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'mr';
const supportedLanguages = Object.keys(resources);
const initialLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'mr';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
