// region 1. Platform Libraries
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// endregion

// region 2. Project Libraries
import translationEn from './i18n/en/translation.json';
import translationZhTw from './i18n/zh-TW/translation.json';
// endregion

// region K. Constants
const resources = {
  en: {
    translation: translationEn,
  },
  'zh-TW': {
    translation: translationZhTw,
  },
};
// endregion

const format = (value, formatName) => {
  if (value === undefined) return value;
  switch (formatName) {
    case 'lowercase':
      return value.toLowerCase();
    case 'plural':
      return `${value}s`;
    default:
      return value;
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
      format,
    },
  });

export default i18n;
