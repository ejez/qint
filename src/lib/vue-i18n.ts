/**
 * vue-i18n utilities.
 */

import type { QintI18n, QintImportVueI18nMsgFn } from 'qint'
import type { LocaleMessageDictionary, VueMessageType } from 'vue-i18n'

/**
 * Options for `loadVueI18nMsg` function.
 */
export interface LoadVueI18nMsgOptions {
  /** The language tag to load the message for. */
  langTag: string
  /** vue-i18n composer or legacy instance to load the message in. */
  i18n: QintI18n
  /** The function to use for importing the locale message. */
  importMsgFn: QintImportVueI18nMsgFn
}

/**
 * Imports a vue-i18n locale message for a specified language tag and merges it
 * to the messages of a provided vue-i18n instance.
 *
 * @param loadVueI18nMsgOptions - Options object.
 * @returns Promise that is fulfilled with the imported locale message when the
 * operation is successful.
 */
export async function loadVueI18nMsg({
  langTag,
  i18n,
  importMsgFn,
}: LoadVueI18nMsgOptions): Promise<
  LocaleMessageDictionary<VueMessageType> | undefined
> {
  // Validate the language tag.
  if (langTag === '') {
    console.error(`
[Qint loadVueI18nMsg] The language tag cannot be empty.
`)
    return
  }

  try {
    // Import the locale message.
    const msg = await importMsgFn(langTag)

    // Merge the locale message.
    i18n.mergeLocaleMessage(langTag, msg)

    // If all goes well, return the locale message.
    return msg
  } catch (err) {
    console.error(
      `
[Qint loadVueI18nMsg] Error loading Vue I18n message for the "${langTag}"
language tag, using function "${importMsgFn.name}":
`,
      err
    )
  }
}
