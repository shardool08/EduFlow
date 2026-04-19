import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, es } from '@/locales';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
const supportedLanguages = Object.keys(resources);
const initialLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
