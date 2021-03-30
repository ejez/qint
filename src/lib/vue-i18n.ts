import type { QintI18n, QintImportVueI18nMsgFn } from './types'

export async function loadVueI18nMsg({
  langTag,
  i18n,
  importMsgFn,
}: {
  langTag: string
  i18n: QintI18n
  importMsgFn: QintImportVueI18nMsgFn
}) {
  try {
    const msg = await importMsgFn(langTag)

    i18n.mergeLocaleMessage(langTag, msg)
  } catch (err) {
    console.error(
      `[qint] Error loading Vue I18n message for the "${langTag}" language tag,
       using function "${importMsgFn.name}": `,
      err
    )
  }
}
