import type { Cookies, QuasarLanguage } from 'quasar'
import 'quasar/dist/types/feature-flag'
import type {
    ComposerOptions,
    I18n,
    LocaleMessageDictionary,
    VueI18nOptions,
    VueMessageType
} from 'vue-i18n'

interface QintLangTagConf {
  nativeName?: string
  quasarLang?: {
    isoName?: string
    custom?: boolean
  }
}

interface QintLangTagsConf {
  [langTag: string]: QintLangTagConf
}

type QintImportQLangFn = (
  isoName: string,
  custom?: boolean
) => Promise<QuasarLanguage>

interface QintQuasarLangConf {
  importQLang: QintImportQLangFn
}

type QintImportVueI18nMsgFn = (
  langTag: string
) => Promise<LocaleMessageDictionary<VueMessageType>>

interface QintVueI18nConf {
  legacy?: boolean
  composerOptions?: ComposerOptions
  vueI18nOptions?: VueI18nOptions
  importGeneralMsg: QintImportVueI18nMsgFn
}

interface QintCookieConf {
  /**
   * Whether the language tag cookie is used.
   * If enabled, you need also to activate Quasar `Cookies` plugin in
   * `quasar.conf.js`.
   */
  useCookie?: boolean

  langTagCookieOptions?: QintCookieOptions
}

interface QintConf {
  langTags: string[]
  langTagsConf?: QintLangTagsConf
  quasarLangConf: QintQuasarLangConf
  vueI18nConf: QintVueI18nConf
  cookieConf?: QintCookieConf
}

type QintCookieOptions = Parameters<typeof Cookies.set>[2]

type QintI18n = I18n<unknown, unknown, unknown, boolean>['global']

declare module 'quasar/dist/types/feature-flag' {
  interface QuasarFeatureFlags {
    ssr: true
  }
}
