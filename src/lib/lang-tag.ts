import type { QSsrContext } from '@quasar/app'
import { cookies, setQLang } from '.'
import type {
    QintCookieOptions,
    QintI18n,
    QintImportQLangFn,
    QintImportVueI18nMsgFn,
    QintLangTagConf
} from './types'
import { loadVueI18nMsg } from './vue-i18n'

export function getLangTag(
  {
    langTags,
    urlPath,
    useCookie = false,
    ssrContext,
  }: {
    langTags: string[]
    urlPath?: string
    useCookie?: boolean
    ssrContext?: QSsrContext | null
  } = { langTags: ['en-US'] }
) {
  /////////////////////////////////////////////////////////////////////////////
  //                                URL prefix                               //
  /////////////////////////////////////////////////////////////////////////////

  const prefix = urlPath?.split('/')[
    // In hash mode we look for the language prefix in the second position:
    // `/#/ar`
    process.env.VUE_ROUTER_MODE === 'hash' ? 2 : 1
  ]

  // Use the language tag prefix from the url if it exists and valid.
  if (prefix && langTags.includes(prefix)) {
    return prefix
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                  Cookie                                 //
  /////////////////////////////////////////////////////////////////////////////

  if (useCookie) {
    const cookie = cookies(ssrContext).get('lang_tag')

    // Use a cookie if previously set.
    if (cookie && langTags.includes(cookie)) {
      return cookie
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                 Fallback                                //
  /////////////////////////////////////////////////////////////////////////////

  // Fallback to the first element of `langTags` if it exists, else to 'en-US'.
  return langTags[0] || 'en-US'
}

export async function setAppLangTag({
  langTag,
  langTagConf,
  i18n,
  importVueI18nMsgFn,
  importQLang,
  useCookie,
  langTagCookieOptions,
  ssrContext,
}: {
  langTag: string
  langTagConf?: QintLangTagConf
  i18n: QintI18n
  importVueI18nMsgFn: QintImportVueI18nMsgFn
  importQLang: QintImportQLangFn
  useCookie?: boolean
  langTagCookieOptions?: QintCookieOptions
  ssrContext?: QSsrContext | null
}) {
  const loadVueI18nMsgPromise = loadVueI18nMsg({
    langTag,
    i18n,
    importMsgFn: importVueI18nMsgFn,
  })

  // Load and set the language pack corresponding to `langTag`.
  const setQLangPromise = setQLang({
    langTag,
    importQLang,
    langTagConf,
    ssrContext,
  })

  // Await promises.
  await loadVueI18nMsgPromise
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
