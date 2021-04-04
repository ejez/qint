import type { MetaOptions } from 'quasar/dist/types/meta'
import type { Ref } from 'vue'
import { ref } from 'vue'

const qintMeta: Ref<MetaOptions> = ref({})

export function useQintMeta() {
  return qintMeta
}
