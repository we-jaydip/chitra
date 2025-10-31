// app/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en/translation.json';
import marathiTranslations from './locales/marathi/translation.json';
import hindiTranslations from './locales/hindi/translation.json';

// Map common codes to your resource keys
const languageAlias: Record<string, 'en' | 'hindi' | 'marathi'> = {
  en: 'en',
  'en-US': 'en',
  'en-IN': 'en',
  hi: 'hindi',
  'hi-IN': 'hindi',
  hindi: 'hindi',
  mr: 'marathi',
  'mr-IN': 'marathi',
  marathi: 'marathi',
};

const resources = {
  en: { translation: enTranslations },
  marathi: { translation: marathiTranslations },
  hindi: { translation: hindiTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: { escapeValue: false },
    returnNull: false,
    returnEmptyString: false,
    debug: __DEV__,
  });

export function setAppLanguage(code: string) {
  const normalized = languageAlias[code] ?? 'en';
  return i18n.changeLanguage(normalized);
}

export default i18n;
