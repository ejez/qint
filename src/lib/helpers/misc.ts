/**
 * Miscellaneous helpers.
 */

import type { QSsrContext } from '@quasar/app'
import { Cookies } from 'quasar'
import { inject, InjectionKey } from 'vue'

const ssrContextKey: InjectionKey<QSsrContext> = Symbol(
  'ssrContext injection key'
)

/**
 * Gives access to a provided Quasar `ssrContext`.
 *
 * @returns A Quasar `ssrContext` or `undefined` if no `ssrContext` was provided.
 */
export function useSsrContext(): QSsrContext | undefined {
  const ssrContext = inject(ssrContextKey)
  if (ssrContext === void 0) {
    console.error('[Qint] No ssrContext was provided.')
  }
  return ssrContext
}

/**
 * Returns an appropriate Quasar `Cookies` object whether running on the server
 * or the client.
 *
 * @param ssrContext - Used to avoid cross-request state pollution in ssr.
 * @returns Quasar `Cookies` object.
 */
export function cookies(ssrContext?: QSsrContext | null): Cookies {
  return process.env.SERVER && ssrContext
    ? Cookies.parseSSR(ssrContext)
    : Cookies
}

/**
 * Selects a language tag from a provided list based on the user's client
 * preferences. The most preferred language tag from the provided list is
 * selected.
 *
 * @param langTags - The list of language tags to chose from.
 * @param ssrContext - Used to avoid cross-request state pollution in ssr.
 * @returns The chosen language tag, or `undefined` when the provided language
 * tags list is empty or contains an empty string, or when the provided list
 * does not contain any of the user's client preferred languages (the check is
 * done in a case-insensitive manner).
 */
export function getClientPreferredLangTag(
  langTags: string[],
  ssrContext?: QSsrContext | null
): string | undefined {
  // Validate the list of language tags.
  if (langTags.length === 0 || langTags.includes('')) {
    console.error(
      '[Qint] The language tags list cannot be empty or contain an empty string.'
    )
    return
  }

  // When on server we use the `Accept-Language` header.
  if (process.env.SERVER) {
    return ssrContext?.req.acceptsLanguages(langTags) || void 0
  }

  // On the client we use `navigator.languages` (Not compatible with Internet
  // Explorer).

  const lowerCasedLangTags = langTags.map((langTag) => langTag.toLowerCase())

  // Find the first preferred language tag that is present in the provided list.
  const preferredNavigatorLang = navigator.languages.find((lang) =>
    lowerCasedLangTags.includes(lang.toLowerCase())
  )

  if (preferredNavigatorLang) {
    // Return the corresponding language tag from the provided list.
    return langTags.find(
      (langTag) =>
        langTag.toLowerCase() === preferredNavigatorLang.toLowerCase()
    )
  }
}

/**
 * Gets the URL host.
 *
 * @param ssrContext - Used to avoid cross-request state pollution in ssr.
 * @returns The host, e.g. `example.com` or `example.com:8000`.
 */
export function getUrlHost(
  ssrContext?: QSsrContext | null
): string | undefined {
  return process.env.SERVER
    ? ssrContext?.req.headers.host
    : window.location.host
}

/**
 * Gets the URL protocol.
 *
 * @param ssrContext - Used to avoid cross-request state pollution in ssr.
 * @returns The protocol, e.g. `http` or `https`.
 */
export function getUrlProtocol(
  ssrContext?: QSsrContext | null
): string | undefined {
  return process.env.SERVER
    ? ssrContext?.req.protocol
    : window.location.protocol.slice(0, -1) // `slice` removes the ending column.
}
