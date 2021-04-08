/**
 * Misc types used by Qint.
 */

import type { Cookies, QuasarLanguage } from 'quasar'
import type {
    ComposerOptions,
    I18n,
    LocaleMessageDictionary,
    VueI18nOptions,
    VueMessageType
} from 'vue-i18n'

/**
 * Configuration for a language tag.
 */
interface QintLangTagConf {
  /**
   * The native name of the language tag. (Can be used in the language tag
   * selector.)
   */
  nativeName?: string
  /**
   * The `hreflang` attribute value to use. Normally there is no need to set it,
   * as the language tag will be used as a fallback. Specify when the language
   * tag is not a valid hreflang attribute.
   */
  hreflang?: string
  /** Quasar language options. */
  quasarLang?: {
    /**
     * The `isoName` of the Quasar language corresponding to the language tag.
     * Specify if different from the language tag. e.g. using `en` language tag
     * with the `en-US` Quasar language pack.
     */
    isoName?: string
    /**
     * Whether the Quasar language pack is a custom pack or supplied by Quasar.
     *
     * @defaultValue `undefined` (treated as `false`).
     */
    custom?: boolean
  }
  /**
   * The top level domain corresponding to the language tag. Used only when the
   * app URL structure mode is set to 'tld'.
   * @see {@link QintUrlConf}
   *
   * @example
   * ```ts
   * tld: 'example.co.uk' // for 'en-GB' language tag.
   * ```
   */
  tld?: string
}

/**
 * App language tags configuration.
 */
interface QintLangTagsConf {
  [langTag: string]: QintLangTagConf
}

/**
 * Configuration related to the structure of the app URLs with regard to
 * internationalization.
 */
interface QintUrlConf {
  /**
   * The mode of the app URL structure.
   *
   * @see {@link https://webmasters.stackexchange.com/a/44289 }
   * @see {@link https://developers.google.com/search/blog/2010/03/working-with-multi-regional-websites#url-structures }
   *
   * @defaultValue 'prefix'
   *
   * @example 'prefix' mode example URLs
   * 'example.com/es/blog', 'example.com/en-GB/blog'
   *
   * @example 'subdomain' mode example URLs
   * 'es.example.com/blog', 'en-GB.example.com'
   *
   * @example 'tld' mode example URLs
   * 'example.es/blog', 'example.co.uk/blog'
   * 'my-spanish-site.com', 'my-english-site.com'
   *
   * @example 'query-param' mode example URLs
   * 'example.com/blog?lang=es', 'example.com/blog?lang=en-GB'
   *
   * @example 'none' mode example URLs
   * 'example.com/blog' (the same URL used for all language tags)
   */
  mode?: 'prefix' | 'subdomain' | 'tld' | 'query-param' | 'none'
  /**
   * The language tag query param key. Used only when the mode is 'query-param'.
   *
   * @defaultValue 'l'
   *
   * @example `queryParamKey` examples
   * ```ts
   * queryParamKey: 'langTag' // -> 'example.com/blog?langTag=en'
   * queryParamKey: 'lang'    // -> 'example.com/blog?lang=en'
   * ```
   */
  queryParamKey?: string
  /**
   * The URL host (including the port if any).
   *
   * Normally, there is no need to set the host as Qint will determine it based
   * on `window.location.host` in the client and the request headers in the
   * server (in SSR mode). However, if for some reason (e.g. due to intermediate
   * proxies) it is not correctly determined, you can set it explicitly.
   *
   * @example
   * ```ts
   * host: 'example.com'
   * host: 'example.com:8000'
   * ```
   */
  host?: string
  /**
   * The URL protocol.
   *
   * Normally, there is no need to set the protocol as Qint will determine it based
   * on `window.location.protocol` in the client and the request headers in the
   * server (in SSR mode). However, if for some reason (e.g. due to intermediate
   * proxies) it is not correctly determined, you can set it explicitly.
   *
   * @example
   * 'http' 'https'
   * ```ts
   * protocol: 'https'
   * protocol: 'http'
   * ```
   */
  protocol?: string
}

/**
 * A function to use for importing a Quasar language pack.
 *
 * @param isoName - The `isoName` of the Quasar language pack to import.
 * @param custom - Whether the Quasar language pack is a custom pack or supplied
 * by Quasar.
 * @returns Promise that should resolve to a Quasar language pack.
 */
type QintImportQLangFn = (
  isoName: string,
  custom?: boolean
) => Promise<QuasarLanguage>

/**
 * Quasar language related configurations.
 */
interface QintQuasarLangConf {
  /** A function to use for importing a Quasar language pack. */
  importQLang: QintImportQLangFn
}

/**
 * A function to use for importing a vue-i18n locale message.
 *
 * @param langTag - The language tag to import the message for.
 * @returns Promise that should resolve to a locale message.
 */
type QintImportVueI18nMsgFn = (
  langTag: string
) => Promise<LocaleMessageDictionary<VueMessageType>>

/**
 * vue-i18n related configurations.
 */
interface QintVueI18nConf {
  /**
   * Whether to use a composer (recommended) or a legacy vue-i18n instance
   * (default).
   */
  legacy?: boolean
  /** Options for the composer instance. */
  composerOptions?: ComposerOptions
  /** Options for the legacy vue-i18n instance. */
  vueI18nOptions?: VueI18nOptions
  /** Function to use for importing general messages. */
  importGeneralMsg: QintImportVueI18nMsgFn
}

/**
 * Cookie related configurations.
 */
interface QintCookieConf {
  /**
   * Whether the language tag cookie is used.
   * If enabled, you need also to activate Quasar `Cookies` plugin in
   * `quasar.conf.js`.
   */
  useCookie?: boolean
  /** Options to use for the language tag cookie. */
  langTagCookieOptions?: QintCookieOptions
}

/**
 * Qint configuration.
 */
interface QintConf {
  /**
   * List of language tags to use in the app. It is recommended to use `BCP 47`
   * language tags.
   * @see {@link https://www.w3.org/International/articles/language-tags | Language tags in HTML and XML }
   *
   * The first language tag in the list is considered the default app language
   * tag.
   *
   * @example langTags Example
   * ```ts
   * langTags: ['ar', 'en-GB', 'en-US', 'zh-Hans']
   * ```
   */
  langTags: string[]
  /** Configuration for the app language tags. */
  langTagsConf?: QintLangTagsConf
  /**
   * Configuration related to the structure of the app URLs with regard to
   * internationalization.
   */
  urlConf?: QintUrlConf
  /** Quasar language related configurations. */
  quasarLangConf: QintQuasarLangConf
  /** vue-i18n related configurations. */
  vueI18nConf: QintVueI18nConf
  /** Cookie related configurations. */
  cookieConf?: QintCookieConf
  /** Whether to use the language preferences set in the user's client. */
  useClientPreferredLangTags?: boolean
}

/** Options to use for the language tag cookie. */
type QintCookieOptions = Parameters<typeof Cookies.set>[2]

/** vue-i18n composer or legacy instance. */
type QintI18n = I18n<unknown, unknown, unknown, boolean>['global']

/** Add Quasar ssr related types. */
declare module 'quasar/dist/types/feature-flag' {
  interface QuasarFeatureFlags {
    ssr: true
  }
}
