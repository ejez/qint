import { useI18n } from 'vue-i18n'
import { localizeRoutePathSegments } from '..'

export function pt(path: string) {
  const i18n = useI18n()
  const langTag = i18n.locale.value
  return `/${langTag}/` + localizeRoutePathSegments({ path, langTag, i18n })
}
