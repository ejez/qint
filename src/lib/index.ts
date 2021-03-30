import type { QSsrContext } from '@quasar/app'
import { cookies } from './helpers'
import { setQLang } from './quasar-lang'
import type {
    QintCookieOptions, QintI18n, QintImportQLangFn,
    QintImportVueI18nMsgFn,
    QintLangTagConf
} from './types'
import { loadVueI18nMsg } from './vue-i18n'


export * from './helpers'
export * from './quasar-lang'
export * from './vue-i18n'

export async function setAppLangTag({
  langTag,
  langTagConf,
  i18n,
  importVueI18nGeneralMsg,
  importQLang,
  useCookie,
  langTagCookieOptions,
  ssrContext,
}: {
  langTag: string
  langTagConf?: QintLangTagConf
  i18n: QintI18n
  importVueI18nGeneralMsg: QintImportVueI18nMsgFn
  importQLang: QintImportQLangFn
  useCookie?: boolean
  langTagCookieOptions?: QintCookieOptions
  ssrContext?: QSsrContext | null
}) {
  const loadVueI18nGeneralMsgPromise = loadVueI18nMsg({
    langTag,
    i18n,
    importMsgFn: importVueI18nGeneralMsg,
  })

  // Load and set the language pack corresponding to `langTag`.
  const setQLangPromise = setQLang({
    langTag,
    importQLang,
    langTagConf,
    ssrContext,
  })

  // Await promises.
  await loadVueI18nGeneralMsgPromise
  await setQLangPromise

  if (typeof i18n.locale === 'string') {
    i18n.locale = langTag
  } else {
    i18n.locale.value = langTag
  }

  if (useCookie) {
    cookies(ssrContext).set('lang_tag', langTag, langTagCookieOptions)
  }
}
