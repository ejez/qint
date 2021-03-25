import type { QSsrContext } from '@quasar/app'
import type { QintImportQLangFn, QintLangTagConf } from './types'
import { Quasar } from 'quasar'

export async function setQLang({
  langTag,
  langTagConf,
  importQLang,
  ssrContext,
}: {
  langTag: string
  langTagConf?: QintLangTagConf
  importQLang: QintImportQLangFn
  ssrContext?: QSsrContext | null
}) {
  // The `isoName` corresponding to the `langTag`.
  const isoName = langTagConf?.quasarLang?.isoName || langTag
  // `true` if using a custom language pack.
  const custom = langTagConf?.quasarLang?.custom

  try {
    // Import the language pack.
    const qLang = await importQLang(isoName, custom)

    // Set the language pack.
    if (process.env.SERVER && ssrContext) {
      // @ts-expect-error second parameter missing
      Quasar.lang.set(qLang, ssrContext)
    } else {
      Quasar.lang.set(qLang)
    }
  } catch (err) {
    console.error(
      `[qint] Error loading the ${
        custom ? 'custom' : ''
      } "${isoName}" language pack: `,
      err
    )
  }
}
