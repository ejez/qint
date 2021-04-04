import type { QSsrContext } from '@quasar/app'
import type { MetaOptions, MetaTagOptions } from 'quasar/dist/types/meta'
import { getHost, localizeRoutePathSegments } from '..'
import type { QintI18n, QintLangTagsConf } from '../types'

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
  const host = getHost(ssrContext)

  link['herflang-x-default'] = {
    rel: 'alternate',
    hreflang: 'x-default',
    href:
      `https://${host}/` +
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
        `https://${host}/` +
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
