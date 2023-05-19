import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import zhCN from './langs/zh-CN.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'zh-CN',
    // we init with resources
    resources: {
      en: {
        translations: {
          test: 'test',
          'Welcome to React': 'Welcome to React and react-i18next',
          welcome: 'Hello <br/> <strong>World</strong>'
        }
      },
      'zh-CN': {
        translations: zhCN
      }
    },
    fallbackLng: 'en',
    debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  })

export default i18n
