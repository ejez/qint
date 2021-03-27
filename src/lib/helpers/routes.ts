import type { RouteRecordRaw } from 'vue-router'
import type { QintI18n } from '../types'

export function translatePath({
  path,
  langTag,
  i18n,
}: {
  path: string
  langTag: string
  i18n: QintI18n
}) {
  // blog => مدونة
  // blog/recent-posts => مدونة/مدونات-حديثة
  return encodeURI(
    path
      .split('/')
      .map((segment) =>
        i18n.global.t(`ps.${segment}`, segment, { locale: langTag })
      )
      .join('/')
  )
}

export function overrideRoute({
  routes,
  routeName,
  newRoute,
}: {
  routes: RouteRecordRaw[]
  routeName: string
  newRoute: RouteRecordRaw
}) {
  const routeIndex = routes.findIndex((route) => route.name === routeName)
  routes[routeIndex] = newRoute
  return routes
}

export function overrideRoutes({
  routes,
  newRoutes,
}: {
  routes: RouteRecordRaw[]
  newRoutes: { [routeName: string]: RouteRecordRaw }
}) {
  for (const [routeName, newRoute] of Object.entries(newRoutes)) {
    overrideRoute({ routes, routeName, newRoute })
  }
  return routes
}
