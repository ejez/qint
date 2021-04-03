<template>
  <q-select
    v-model="langTag"
    :options="langTagOptions"
    dense
    borderless
    emit-value
    map-options
    options-dense
    style="min-width: 100px"
  />
</template>

<script lang="ts">
import { getAppMeta, getHost } from 'qint'
import type { QintLangTagsConf } from 'qint/types'
import { defineComponent, PropType, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'QintLangTagSelector',

  props: {
    langTags: {
      type: Array as PropType<string[]>,
      required: true,
    },

    langTagsConf: {
      type: Object as PropType<QintLangTagsConf>,
      required: true,
    },
  },

  setup(props) {
    const langTagOptions = props.langTags.map((langTag) => ({
      label: props.langTagsConf?.[langTag]?.nativeName || langTag,
      value: langTag,
    }))

    const router = useRouter()
    const route = useRoute()

    const { locale } = useI18n()

    const langTag = ref(locale.value)

    watch(langTag, async (langTag) => {
      const appMeta = getAppMeta(route)
      const hreflang = props.langTagsConf?.[langTag]?.hreflang || langTag
      const host = getHost()

      await router.push(
        appMeta?.link?.[`hreflang-${hreflang}`]?.href?.replace(
          `https://${host}` +
            (process.env.VUE_ROUTER_MODE === 'hash' ? '/#' : ''),
          ''
        ) || `/${langTag}`
      )
    })

    return {
      langTag,
      langTagOptions,
    }
  },
})
</script>
