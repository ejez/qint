import type { QSsrContext } from '@quasar/app'
import type { MetaOptions, MetaTagOptions } from 'quasar/dist/types/meta'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { getHost, localizePathSegments } from '..'
import type { QintI18n, QintLangTagsConf } from '../types'

export function getAppMeta(route: RouteLocationNormalizedLoaded): MetaOptions {
  if (route) {
    const currentRouteRecord = route.matched.find(
      (routeRecord) => routeRecord.name === route.name
    )

    return currentRouteRecord?.meta?.appMeta || {}
  }

  return {}
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

  const link: MetaTagOptions = {}

  const host = getHost(ssrContext)

  const xDefaultLocalizedPath = localizePathSegments({
    path,
    langTag: xDefaultLangTag,
    i18n,
  })

  link['herflang-x-default'] = {
    rel: 'alternate',
    hreflang: 'x-default',
    href:
      `https://${host}/` +
      (process.env.VUE_ROUTER_MODE === 'hash' ? '#/' : '') +
      xDefaultLangTag +
      (path ? '/' + xDefaultLocalizedPath : ''),
  }

  langTags.forEach((langTag) => {
    const hreflang = langTagsConf?.[langTag]?.hreflang || langTag
    const localizedPath = localizePathSegments({ path, langTag, i18n })

    link[`hreflang-${hreflang}`] = {
      rel: 'alternate',
      hreflang,
      href:
        `https://${host}/` +
        (process.env.VUE_ROUTER_MODE === 'hash' ? '#/' : '') +
        langTag +
        (path ? '/' + localizedPath : ''),
    }
  })

  return { link }
}
