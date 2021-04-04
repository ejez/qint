import type { QSsrContext } from '@quasar/app'

export function getHost(ssrContext?: QSsrContext | null) {
  return process.env.SERVER
    ? ssrContext
      ? ssrContext.req.headers.host || 'example.com'
      : 'example.com'
    : window.location.host
}
