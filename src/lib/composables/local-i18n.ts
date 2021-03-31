import { watch } from 'vue'
import type { ComposerOptions } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import type { QintImportVueI18nMsgFn } from '../types'
import { loadVueI18nMsg } from '../vue-i18n'

export function setupLocalI18n({
  importMsgFn,
  composerOptions = {},
}: {
  importMsgFn: QintImportVueI18nMsgFn
  composerOptions?: ComposerOptions
}) {
  const i18n = useI18n(
    Object.assign(composerOptions, {
      useScope: 'local' as const,
    })
  )

  watch(
    i18n.locale,
    (langTag) => {
      loadVueI18nMsg({
        langTag,
        i18n,
        importMsgFn,
      }).catch((err) => {
        console.error(err)
      })
    },
    { immediate: true }
  )

  return i18n
}
