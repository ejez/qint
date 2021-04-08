/**
 * Language tag utilities.
 */

import type { QSsrContext } from '@quasar/app'
import type {
    QintCookieOptions,
    QintI18n,
    QintImportQLangFn,
    QintImportVueI18nMsgFn,
    QintLangTagConf,
    QintLangTagsConf,
    QintUrlConf
} from 'qint'
import {
    cookies,
    getClientPreferredLangTag,
    getUrlHost,
    loadVueI18nMsg,
    setQLang
} from 'qint'

/**
 * Options for `getLangTag` function.
 */
export interface GetLangTagOptions {
  /** List of the language tags to choose from. */
  langTags: string[]
  /** App language tags configuration. */
  langTagsConf?: QintLangTagsConf
  /** The mode of the app URL structure. */
  mode?: QintUrlConf['mode']
  /** The URL host (including the port if any). */
  host?: string
  /** The URL path to inspect for a language tag in it. */
  urlPath?: string
  /**
   * The language tag query param key. Used only when the mode is 'query-param'.
   */
  queryParamKey?: string
  /** Whether to use a cookie to determine the language tag. */
  useCookie?: boolean
  /** Whether to use the language preferences set in the user's client. */
  useClientPreferredLangTags?: boolean
  /** Used to avoid cross-request state pollution in ssr. */
  ssrContext?: QSsrContext | null
}

/**
 * Selects a language tag from a provided list based on a specified URL mode, a
 * cookie, the user's client preferences or a fallback to the first language tag
 * in the provided list.
 *
 * Note that the use of the the cookie or the client preferences is optional.
 *
 * @param getLangTagOptions - Options object.
 * @returns The chosen language tag, or `undefined` when the provided language
 * tags list is empty or contains an empty string.
 */
export function getLangTag({
  langTags,
  langTagsConf,
  mode,
  host,
  urlPath,
  queryParamKey,
  useCookie,
  useClientPreferredLangTags,
  ssrContext,
}: GetLangTagOptions): string | undefined {
  // Validate the list of language tags.
  if (langTags.length === 0 || langTags.includes('')) {
    console.error(`
[Qint getLangTag] The language tags list cannot be empty or contain an empty
string.
`)
    return
  }

  // Will hold the return value if any.
  let langTag: string | undefined

  /////////////////////////////////////////////////////////////////////////////
  //                              'prefix' mode                              //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'prefix' || mode === void 0) {
    // Determine the language tag based on the URL path.
    const prefix = urlPath?.split('/')[
      // In hash mode we look for the language tag prefix in the second position
      // (e.g. `/#/ar`)
      process.env.VUE_ROUTER_MODE === 'hash' ? 2 : 1
    ]

    if (prefix) {
      // Find the language tag that corresponds to the prefix.
      langTag = langTags.find((lt) => lt.toLowerCase() === prefix.toLowerCase())
      if (langTag) return langTag
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //                        'subdomain' or 'tld' mode                        //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'subdomain' || mode === 'tld') {
    // Get the host if it is not explicitly provided.
    const urlHost = host || getUrlHost(ssrContext)

    // Warn when the host is invalid.
    if (!urlHost) {
      console.warn(`
[Qint getLangTag] "subdomain|tld" mode: The URL host is empty or undefined.
`)
    }

    ///////////////////////////////////////////////////////////////////////////
    //                            'subdomain' mode                           //
    ///////////////////////////////////////////////////////////////////////////

    if (mode === 'subdomain') {
      // Find the language tag that corresponds to the URL host subdomain.
      langTag = langTags.find(
        (lt) => lt.toLowerCase() === urlHost?.split('.')[0].toLowerCase()
      )
      if (langTag) return langTag
    }

    ///////////////////////////////////////////////////////////////////////////
    //                               'tld' mode                              //
    ///////////////////////////////////////////////////////////////////////////

    if (mode === 'tld') {
      // Warn about a missing tld.
      for (const lt of langTags) {
        if (!langTagsConf?.[lt].tld) {
          console.warn(`
[Qint getLangTag] "tld" mode: The language tag "${lt}" does not have a
corresponding "tld" defined.
`)
        }
      }

      if (urlHost) {
        // Find the language tag that corresponds to the host.
        langTag = langTags.find(
          (lt) => langTagsConf?.[lt].tld === urlHost.split(':')[0]
        )
        if (langTag) return langTag
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //                            'query-param' mode                           //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'query-param') {
    // Language tag query param key.
    const key = queryParamKey || 'l'

    // Construct a URL for later processing.
    const url = new URL(
      'https://example.com' +
        (urlPath
          ? process.env.VUE_ROUTER_MODE === 'hash'
            ? urlPath.split('#')[1] // remove the hash.
            : urlPath
          : '')
    )
    const searchParams = new URLSearchParams(url.search)

    // Find the language tag corresponding to the query param.
    langTags.find(
      (lt) => lt.toLowerCase() === searchParams.get(key)?.toLowerCase()
    )
    if (langTag) return langTag
  }

  /////////////////////////////////////////////////////////////////////////////
  //             mode is 'none', or no language tag is found yet             //
  /////////////////////////////////////////////////////////////////////////////

  //Determine the language tag based on a cookie.
  if (useCookie) {
    // Find the language tag that is stored in a cookie.
    langTag = langTags.find((lt) => lt === cookies(ssrContext).get('lang_tag'))
    if (langTag) return langTag
  }

  // Determine the language tag based on the user's client preferences.
  if (useClientPreferredLangTags) {
    langTag = getClientPreferredLangTag(langTags, ssrContext)
    if (langTag) return langTag
  }

  // Fallback to the first element of `langTags`.
  return langTags[0]
}

/**
 * Options for `setAppLangTag` function.
 */
interface SetAppLangTagOptions {
  /** The language tag to set the app to. */
  langTag: string
  /** The language tag configuration. */
  langTagConf?: QintLangTagConf
  /** The vue-i18n Composer or legacy VueI18n instance. */
  i18n: QintI18n
  /** A function to use for importing vue-i18n locale message. */
  importVueI18nMsgFn: QintImportVueI18nMsgFn
  /** A function to use for importing Quasar language pack. */
  importQLang: QintImportQLangFn
  /** Whether to save the used language tag in a cookie. */
  useCookie?: boolean
  /** The language tag cookie options. */
  langTagCookieOptions?: QintCookieOptions
  /** Used to avoid cross-request state pollution in ssr. */
  ssrContext?: QSsrContext | null
}

/**
 * Sets the app to a specified language tag. This includes loading the
 * corresponding Quasar language pack and vue-i18n locale message and setting a
 * cookie (optional).
 *
 * @param setAppLangTagOptions - Options object.
 * @returns Promise that is fulfilled with the provided language tag when the
 * operation is successful.
 */
export async function setAppLangTag({
  langTag,
  langTagConf,
  i18n,
  importVueI18nMsgFn,
  importQLang,
  useCookie,
  langTagCookieOptions,
  ssrContext,
}: SetAppLangTagOptions): Promise<string | undefined> {
  // Validate the language tag.
  if (langTag === '') {
    console.error(`
[Qint setAppLangTag] The language tag cannot be empty.
`)
    return
  }

  try {
    // Load the vue-i18n locale message corresponding to the provided language
    // tag.
    const loadVueI18nMsgPromise = loadVueI18nMsg({
      langTag,
      i18n,
      importMsgFn: importVueI18nMsgFn,
    })

    // Load and set the Quasar language pack corresponding to the provided
    // language tag.
    const setQLangPromise = setQLang({
      langTag,
      importQLang,
      langTagConf,
      ssrContext,
    })

    // Await promises (promises are run in parallel).
    await loadVueI18nMsgPromise
    await setQLangPromise

    // If all goes well, set vue-i18n locale.
    if (typeof i18n.locale === 'string') {
      // For legacy vue-i18n instance.
      i18n.locale = langTag
    } else {
      // For composer vue-i18n instance.
      i18n.locale.value = langTag
    }

    // If all goes well, set the language tag cookie.
    if (useCookie) {
      cookies(ssrContext).set('lang_tag', langTag, langTagCookieOptions)
    }

    // Return the language tag as a sign of operation success.
    return langTag
  } catch (err) {
    console.error(
      `
[Qint setAppLangTag] An error occurred while setting the app language tag:
`,
      err
    )
  }
}
