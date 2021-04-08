import type { RouteRecordRaw } from 'vue-router'
import type { QintI18n } from 'qint'

export function localizeRoutePathSegments({
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
  return path
    ? encodeURI(
        path
          .split('/')
          .map((segment) =>
            i18n.t(`ps.${segment}`, segment, { locale: langTag })
          )
          .join('/')
      )
    : ''
}

export function assignToRoute({
  routes,
  targetName,
  source,
}: {
  routes: RouteRecordRaw[]
  targetName: string
  source: Partial<RouteRecordRaw>
}) {
  const targetIndex = routes.findIndex((route) => route.name === targetName)
  Object.assign(routes[targetIndex], source)
  return routes
}

export function assignToRoutes({
  routes,
  assignments,
}: {
  routes: RouteRecordRaw[]
  assignments: { [targetName: string]: Partial<RouteRecordRaw> }
}) {
  for (const [targetName, source] of Object.entries(assignments)) {
    assignToRoute({ routes, targetName, source })
  }
  return routes
}

export function replaceRoute({
  routes,
  oldRouteName,
  newRoute,
}: {
  routes: RouteRecordRaw[]
  oldRouteName: string
  newRoute: RouteRecordRaw
}) {
  const routeIndex = routes.findIndex((route) => route.name === oldRouteName)
  routes[routeIndex] = newRoute
  return routes
}

export function replaceRoutes({
  routes,
  replacements,
}: {
  routes: RouteRecordRaw[]
  replacements: { [oldRouteName: string]: RouteRecordRaw }
}) {
  for (const [oldRouteName, newRoute] of Object.entries(replacements)) {
    replaceRoute({ routes, oldRouteName, newRoute })
  }
  return routes
}
