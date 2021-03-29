import type { QSsrContext } from '@quasar/app'
import { cookies } from './cookies'

export function getLangTag(
  {
    langTags,
    urlPath,
    useCookie = false,
    ssrContext,
  }: {
    langTags: string[]
    urlPath?: string
    useCookie?: boolean
    ssrContext?: QSsrContext | null
  } = { langTags: ['en-US'] }
) {
  /////////////////////////////////////////////////////////////////////////////
  //                                URL prefix                               //
  /////////////////////////////////////////////////////////////////////////////

  const prefix = urlPath?.split('/')[
    // In hash mode we look for the language prefix in the second position:
    // `/#/ar`
    process.env.VUE_ROUTER_MODE === 'hash' ? 2 : 1
  ]

  // Use the language tag prefix from the url if it exists and valid.
  if (prefix && langTags.includes(prefix)) {
    return prefix
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                  Cookie                                 //
  /////////////////////////////////////////////////////////////////////////////

  if (useCookie) {
    const cookie = cookies(ssrContext).get('lang_tag')

    // Use a cookie if previously set.
    if (cookie && langTags.includes(cookie)) {
      return cookie
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //                                 Fallback                                //
  /////////////////////////////////////////////////////////////////////////////

  // Fallback to the first element of `langTags` if it exists, else to 'en-US'.
  return langTags[0] || 'en-US'
}
