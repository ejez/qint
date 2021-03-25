import type { QSsrContext } from '@quasar/app'
import { Cookies } from 'quasar'

export function cookies(ssrContext?: QSsrContext | null) {
  return process.env.SERVER && ssrContext
    ? Cookies.parseSSR(ssrContext)
    : Cookies
}
