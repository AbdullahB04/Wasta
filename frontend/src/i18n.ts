import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';
import kuTranslation from './locales/ku/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: enTranslation 
      },
      ar: { 
        translation: arTranslation 
      },
      ku: { 
        translation: kuTranslation 
      }
    },
    lng: localStorage.getItem('language') || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

// Set initial direction based on language
if (i18n.language === 'ar' || i18n.language === 'ku') {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = i18n.language;
} else {
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = 'en';
}

// Update direction when language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  if (lng === 'ar' || lng === 'ku') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = lng;
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }
});

export default i18n;
