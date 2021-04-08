/**
 * App meta utilities.
 */

import type { QSsrContext } from '@quasar/app'
import type { QintI18n, QintLangTagsConf } from 'qint'
import { getUrlHost, getUrlProtocol, localizeRoutePathSegments } from 'qint'
import type { MetaOptions, MetaTagOptions } from 'quasar/dist/types/meta'
import type { Ref } from 'vue'
import { ref } from 'vue'

/**
 * A reactive object to be used as an app meta holder. It is intended to be used
 * as a central place for manipulating Qint related app meta from different
 * places of the app code.
 */
export const qintMeta: Ref<MetaOptions> = ref({})

/**
 * Options for `hreflang` function.
 */
export interface HreflangOptions {
  /**
   * An object with language tags as keys, and their corresponding hrefs as
   * values.
   *
   * @example
   * ```ts
   *{ar: 'https://example.com/ar/مدونة', en: 'https://example.com/en/blog'}
   * ```
   */
  hrefs: { [langTag: string]: string }
  /** The language tag that will be used for the `x-default` hreflang. */
  xDefaultLangTag: string
  /**
   * Object containing the hreflang attribute values to use instead of the
   * language tags. Intended to be used when a language tag is not a valid
   * hreflang attribute.
   * @see {@link https://en.wikipedia.org/wiki/Hreflang | hreflang }
   */
  langTagsConf?: QintLangTagsConf
}

/**
 * Builds hreflang link tags ready for consumption by Quasar meta plugin.
 *
 * @param hreflangOptions - Options object.
 * @returns An object for use by Quasar meta plugin, or `undefined` if the input
 * validation fails.
 */
export function hreflang({
  hrefs,
  xDefaultLangTag,
  langTagsConf,
}: HreflangOptions): MetaTagOptions | undefined {
  // Validation
  if (xDefaultLangTag === '') {
    console.error(`
[Qint hreflang] The "x-default" language tag cannot be empty.
`)
    return
  }
  if (!(xDefaultLangTag in hrefs)) {
    console.error(`
[Qint hreflang] The provided "hrefs" must contain the "x-default" language tag.
`)
    return
  }

  const link: MetaTagOptions = {}

  // x-default hreflang.
  link['hreflang-x-default'] = {
    rel: 'alternate',
    hreflang: 'x-default',
    href: hrefs[xDefaultLangTag],
  }

  // Other hreflangs.
  for (const [langTag, href] of Object.entries(hrefs)) {
    // Check if an hreflang attribute value was provided.
    const hreflang = langTagsConf?.[langTag]?.hreflang || langTag

    link[`hreflang-${hreflang}`] = { rel: 'alternate', hreflang, href }
  }

  return link
}

/**
 * Builds hreflang link tags from the provided URL paths.
 *
 * @param hreflangOptions - Options object.
 * @returns An object for use by Quasar meta plugin, or `undefined` if the input
 * validation fails.
 */
export function hreflangPaths() {}
export function hreflangPath() {}

/**  */
export function createHreflangLink({
  localizedPaths,
  xDefaultLangTag,
  langTagsConf,
  ssrContext,
}: {
  localizedPaths: { [langTag: string]: string }
  xDefaultLangTag: string
  langTagsConf?: QintLangTagsConf
  ssrContext?: QSsrContext | null
}) {
  if (!(xDefaultLangTag in localizedPaths)) {
    return
  }

  const link: MetaTagOptions = {}
  const host = getUrlHost(ssrContext) || 'example.com'
  const protocol = getUrlProtocol(ssrContext) || 'https'

  link['herflang-x-default'] = {
    rel: 'alternate',
    hreflang: 'x-default',
    href:
      `${protocol}://${host}/` +
      (process.env.VUE_ROUTER_MODE === 'hash' ? '#/' : '') +
      xDefaultLangTag +
      (localizedPaths[xDefaultLangTag]
        ? '/' + localizedPaths[xDefaultLangTag]
        : ''),
  }

  for (const [langTag, localizedPath] of Object.entries(localizedPaths)) {
    const hreflang = langTagsConf?.[langTag]?.hreflang || langTag

    link[`hreflang-${hreflang}`] = {
      rel: 'alternate',
      hreflang,
      href:
        `${protocol}://${host}/` +
        (process.env.VUE_ROUTER_MODE === 'hash' ? '#/' : '') +
        langTag +
        (localizedPath ? '/' + localizedPath : ''),
    }
  }

  return link
}

export function createHreflangRouteMeta({
  path,
  xDefaultLangTag,
  langTags,
  langTagsConf,
  ssrContext,
  i18n,
}: {
  path: string
  xDefaultLangTag?: string
  langTags: string[]
  langTagsConf?: QintLangTagsConf
  ssrContext?: QSsrContext | null
  i18n: QintI18n
}): MetaOptions {
  xDefaultLangTag = xDefaultLangTag || langTags[0]

  const localizedPaths: { [langTag: string]: string } = {}
  langTags.forEach((langTag) => {
    localizedPaths[langTag] = localizeRoutePathSegments({ path, langTag, i18n })
  })

  const link = createHreflangLink({
    localizedPaths,
    xDefaultLangTag,
    langTagsConf,
    ssrContext,
  })

  return link ? { link } : {}
}
