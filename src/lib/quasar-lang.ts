/**
 * Quasar Language packs utilities.
 */

import type { QSsrContext } from '@quasar/app'
import type { QintImportQLangFn, QintLangTagConf } from 'qint'
import type { QuasarLanguage } from 'quasar'
import { Quasar } from 'quasar'

/**
 * Options for `setQLang` function.
 */
export interface SetQLangOptions {
  /** The language tag that corresponds to the Quasar language pack. */
  langTag: string
  /** The language tag configuration. */
  langTagConf?: QintLangTagConf
  /** A function to use for importing Quasar language pack. */
  importQLang: QintImportQLangFn
  /** Used to avoid cross-request state pollution in ssr. */
  ssrContext?: QSsrContext | null
}

/**
 * Loads and sets the Quasar language pack corresponding to a specified language
 * tag.
 *
 * @param setQLangOptions - Options object.
 * @returns Promise that is fulfilled with the loaded Quasar language pack when
 * the operation is successful.
 */
export async function setQLang({
  langTag,
  langTagConf,
  importQLang,
  ssrContext,
}: SetQLangOptions): Promise<QuasarLanguage | undefined> {
  // Validate the language tag.
  if (langTag === '') {
    console.error(`
[Qint setQLang] The language tag cannot be empty.
`)
    return
  }

  // The `isoName` corresponding to the `langTag`.
  const isoName = langTagConf?.quasarLang?.isoName || langTag
  // `true` if using a custom language pack.
  const custom = langTagConf?.quasarLang?.custom

  try {
    // Import Quasar language pack.
    const qLang = await importQLang(isoName, custom)

    // Set the language pack.
    if (process.env.SERVER && ssrContext) {
      // @ts-expect-error second parameter missing
      Quasar.lang.set(qLang, ssrContext)
    } else {
      Quasar.lang.set(qLang)
    }

    // Return the language pack as a sign of operation success.
    return qLang
  } catch (err) {
    console.error(
      `
[Qint setQLang] Error loading the ${custom ? 'custom' : ''} "${isoName}"
language pack:
`,
      err
    )
  }
}
